import wikipedia
import os
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.docstore.document import Document as LangchainDocument
from langchain_community.vectorstores import FAISS
from transformers import AutoTokenizer
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.utils import DistanceStrategy
import requests
import json
import random
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Hugging Face API Config
API_TOKEN = "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"  # Replace with your Hugging Face API token
MODEL_NAME = "microsoft/Phi-3.5-mini-instruct"
#MODEL_NAME= "t5-base"  # Replace with a valid model, e.g., "gpt2"
EMBEDDING_MODEL_NAME = "thenlper/gte-small"
embedding_model = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL_NAME,
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True},
)



tokenizer = AutoTokenizer.from_pretrained(EMBEDDING_MODEL_NAME)


def split_documents(chunk_size, knowledge_base):
    """
    Splits the content using the tokenizer and ensures uniqueness of chunks.
    """
    docs_processed = []
    for doc in knowledge_base:
        tokens = tokenizer.encode(doc.page_content)
        chunks = [tokens[i:i + chunk_size] for i in range(0, len(tokens), chunk_size - int(chunk_size / 10))]
        for chunk in chunks:
            content = tokenizer.decode(chunk, skip_special_tokens=True)
            docs_processed.append(LangchainDocument(page_content=content))
    # Ensure unique chunks
    unique_texts = {doc.page_content for doc in docs_processed}
    return [LangchainDocument(page_content=text) for text in unique_texts]


def create_vector_store(docs):
    """
    Creates a vector store using the FAISS library.
    """
    return FAISS.from_documents(docs, embedding_model, distance_strategy=DistanceStrategy.COSINE)


def prepare_rag_dataset(content_file, chunk_size=512):
    """
    Loads content from the file, splits it into chunks, and creates a vector store.
    Returns the vector store.
    """
    with open(content_file, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    knowledge_base = [LangchainDocument(page_content=raw_text)]
    docs = split_documents(chunk_size, knowledge_base)
    print(f"Split the content into {len(docs)} chunks.")

    vector_store = create_vector_store(docs)
    print("Vector store created successfully.")
    return vector_store




def generate_questions_with_huggingface_api(context, question_type, topic, max_total_tokens=1024, max_new_tokens=250):
    # ...existing code...
    num_questions = 10  # Reduced to make generation more manageable

    # Define maximum token limits
    max_total_tokens = 1024
    # max_total_tokens = 2048
    if question_type=="Multiple Choice Questions":
        max_new_tokens=1000
    elif question_type == "Fill in the Blanks":
        max_new_tokens = 1000 # Adjusted from 1024 to 250
    elif question_type == "True/False":
        max_new_tokens = 500

    # Generate the prompt template without the context
    if question_type == "Multiple Choice Questions":
        prompt_template = (
        
            f"Generate  {num_questions} multiple-choice questions based on this context. "
            f"Format each question as:\n"
            f"Q: [Question Text]\n"
            f"a) [Option A]\n"
            f"b) [Option B]\n"
            f"c) [Option C]\n"
            f"d) [Option D]\n"
            f"Correct Answer: [a/b/c/d]\n\n"
            f"\n"
        )
    elif question_type == "Fill in the Blanks":
        prompt_template = (
            f"Generate {num_questions} fill-in-the-blank questions based on this context. "
            f"Format each question as:\n"
            f"Q: [Question with blank]\n"
            f"Answer: [Correct word/phrase]\n\n"
            f"Context:\n"
        )
    elif question_type == "True/False":
        prompt_template = (
            f"Generate {num_questions} true/false questions based on this context. "
            f"Format each question as:\n"
            f"Q: [Statement]\n"
            f"Answer: [True/False]\n\n"
            f"Context:\n"
        )
    else:
        print("Unsupported question type.")
        return None

    # Tokenize the prompt template
    prompt_tokens = tokenizer.encode(prompt_template)
    prompt_length = len(prompt_tokens)

    # Calculate allowed context length
    # allowed_context_length = max_total_tokens - prompt_length - max_new_tokens
    allowed_context_length = 500
    # allowed_context_length = 500
    # Tokenize and truncate the context if necessary
    context_tokens = tokenizer.encode(context)
    print(f"Original context length: {len(context_tokens)} tokens")  # Debug print
    if len(context_tokens) > allowed_context_length:
        context_tokens = context_tokens[:allowed_context_length]
        context = tokenizer.decode(context_tokens,skip_special_tokens=True)
    print(f"\n\nTruncated context length: {len(context_tokens)} tokens")  # Debug print

    # Combine the prompt and the (possibly truncated) context
    #prompt = prompt_template + context + "\n\n"
    prompt = f"Topic: {topic}\nContext: {context}\n\n" +prompt_template
    with open("prompt.txt", "w", encoding="utf-8") as f:
        f.write(prompt)
    # API request configuration
    url = f"https://api-inference.huggingface.co/models/{MODEL_NAME}"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_new_tokens,
            "num_return_sequences": 1,
            "temperature": 0.7
        }
    }
    # ...existing code...

    try:
        response = requests.post(url, headers=headers, json=payload)

        # print("\n\n\n\nresponnse\n\n\n\n")
        # print(response)
        # print("\n\n\n\nresponnse\n\n\n\n")
        # print(response.text)
        print("\n\n\n\nresponnse\n\n\n\n")
        if response.status_code == 200:
            result = response.json()
            # print("Raw API Response:", result)  # Debug print

            # Adjust parsing based on the actual response format
            generated_text = ''
            if isinstance(result, list) and 'generated_text' in result[0]:
                generated_text = result[0]['generated_text']
            elif isinstance(result, dict) and 'generated_text' in result:
                generated_text = result['generated_text']
            else:
                print("Unexpected API response format.")
                return None

            print("Generated Text:", generated_text)  # Debug print

            formatted_questions = []
            
            # Pattern matching for different question types
            if question_type == "Multiple Choice Questions":
                mcq_pattern = re.compile(
                    r'Q:\s*(.*?)\n'
                    r'a\)\s*(.*?)\n'
                    r'b\)\s*(.*?)\n'
                    r'c\)\s*(.*?)\n'
                    r'd\)\s*(.*?)\n'
                    r'Correct Answer:\s*(.*?)(?:\n|$)',
                    re.DOTALL
                )
                matches = mcq_pattern.findall(generated_text)
                for match in matches:
                    formatted_questions.append({
                        "type":"multiple-choice",
                        "question": match[0].strip(),
                        "options": {
                            "a": match[1].strip(),
                            "b": match[2].strip(),
                            "c": match[3].strip(),
                            "d": match[4].strip()
                        },
                        "correct_answer": match[5].strip()
                    })
            
            elif question_type == "Fill in the Blanks":
                fill_pattern = re.compile(r'Q:\s*(.*?)\nAnswer:\s*(.*?)(?=\n\n|$)', re.DOTALL)
                matches = fill_pattern.findall(generated_text)
                
                for match in matches:
                    formatted_questions.append({
                        "type":"fill-in-the-blank",
                        "question": match[0].strip(),
                        "correct_answer": match[1].strip()
                    })
            
            elif question_type == "True/False":
                tf_pattern = re.compile(r'Q:\s*(.*?)\nAnswer:\s*(True|False)(?=\n\n|$)', re.DOTALL)
                matches = tf_pattern.findall(generated_text)
                
                for match in matches:
                    formatted_questions.append({
                        "type":"true/false",
                        "question": match[0].strip(),
                        "correct_answer": match[1].strip()
                    })

            # Save to JSON if questions are found
            if formatted_questions:
                with open('questions.json', 'w') as f:
                    json.dump(formatted_questions, f, ensure_ascii=False, indent=4)
                print(f"Generated {len(formatted_questions)} questions.")
                print(formatted_questions)
                return formatted_questions
            else:
                print("No valid questions extracted.")
                return None
        else:
            print(f"Error generating questions: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Error with the API request: {e}")
        return None

def display_quiz(num_questions):
    """
    Loads questions from the JSON file, randomly selects the specified number of questions,
    displays them, and collects answers to compute the score.
    """
    with open('questions.json', 'r') as f:
        all_questions = json.load(f)
    
    selected_questions = random.sample(all_questions[1:], min(num_questions, len(all_questions)-1))
    # print(selected_questions)
    with open('selected_questions.json', 'w') as f:
        json.dump(selected_questions, f, ensure_ascii=False, indent=4)
    # score = 0
    # total_questions = len(selected_questions)
    print(selected_questions)



    return selected_questions

@app.route('/start-quiz', methods=['POST'])
def main():
    # Clear old files
    for filename in ['wiki_txt.txt', 'pdf_text.txt', 'questions.json']:
        if os.path.exists(filename):
            open(filename, 'w').close()

    # Parse user input from frontend
    question_type_choice = request.form.get('questionType')  # Get the choice as a string
    num_questions = request.form.get('numQuestions')  # Number of questions
    topic = request.form.get('topic')
    file = request.files.get('file')

    # Validate input
    if not question_type_choice or question_type_choice not in {"1", "2", "3"}:
        return jsonify({"message": "Invalid question type choice. Please choose 1, 2, or 3.", "success": False}), 400

    if not num_questions:
        return jsonify({"message": "Number of questions is required.", "success": False}), 400

    if (not topic and not file) or (topic and file):
        return jsonify({"message": "Provide either a topic or a file, but not both.", "success": False}), 400

    # Map the question type choice
    question_type = {
        "1": "Multiple Choice Questions",
        "2": "Fill in the Blanks",
        "3": "True/False"
    }.get(question_type_choice)
    
    content_file = None

    if topic:
        # Fetch content from Wikipedia
        try:
            wiki = wikipedia.page(topic)
            wiki_text = wiki.content
            with open('wiki_txt.txt', 'w', encoding='utf-8') as f:
                f.write(wiki_text)
            print("Wikipedia content saved successfully.")
            content_file = 'wiki_txt.txt'
        except wikipedia.exceptions.PageError:
            return jsonify({"success": False, "message": f"The page '{topic}' does not exist."}), 400
        except wikipedia.exceptions.DisambiguationError as e:
            return jsonify({"success": False, "message": f"The title '{topic}' is ambiguous. Options are: {e.options}"}), 400
        except Exception as e:
            return jsonify({"success": False, "message": f"An error occurred: {e}"}), 500

    elif file:
        # Extract content from the uploaded PDF
        try:
            if file.filename.endswith('.pdf'):
                file.save('uploaded.pdf')
                with open('uploaded.pdf', 'rb') as pdf_file:
                    pdf_reader = PyPDF2.PdfReader(pdf_file)
                    pdf_text = "".join([page.extract_text() for page in pdf_reader.pages])
                with open('pdf_text.txt', 'w', encoding='utf-8') as f:
                    f.write(pdf_text)
                print("PDF content extracted and saved successfully.")
                content_file = 'pdf_text.txt'
            else:
                return jsonify({"success": False, "message": "Invalid file type. Please upload a PDF."}), 400
        except Exception as e:
            return jsonify({"success": False, "message": f"Failed to read the PDF file: {e}"}), 500
    else:
        return jsonify({"success": False, "message": "Invalid choice or missing data."}), 400

    if content_file:
        print("Content loaded successfully. Preparing dataset for RAG implementation...")
        vector_store = prepare_rag_dataset(content_file)
        vector_store.save_local("rag_vector_store")

        # Generate questions based on context
        combined_context = " ".join([doc.page_content for doc in vector_store.similarity_search("", k=5)])
        generated_questions = generate_questions_with_huggingface_api(combined_context, question_type, topic)
        questions=display_quiz(int(num_questions))
        print(f"Generated questions: {generated_questions}")
        if questions:
            return jsonify({"success": True, "questions":questions}), 200
        else:
            return jsonify({"success": False, "message": "Failed to generate questions."}), 500

    return jsonify({"success": False, "message": "Failed to process the content."}), 500



if __name__ == '__main__':
    app.run(port=5000)
