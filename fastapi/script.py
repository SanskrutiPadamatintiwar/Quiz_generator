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


def get_content_from_user():
    """
    Fetch content from Wikipedia or a PDF based on user choice.
    Returns the file path containing the extracted content and the topic.
    """
    choice = input("Would you like to (1) Enter a topic to search on Wikipedia or (2) Upload a PDF file? Enter 1 or 2: ").strip()

    if choice == "1":
        topic = input("Enter the Wikipedia topic: ").strip()
        try:
            wiki = wikipedia.page(topic)
            wiki_text = wiki.content
            with open('wiki_txt.txt', 'w', encoding='utf-8') as f:
                f.write(wiki_text)
            print("Wikipedia content saved successfully.")
            return 'wiki_txt.txt', topic

        except wikipedia.exceptions.PageError:
            print(f"The page '{topic}' does not exist. Try a different title.")
            return None, None
        except wikipedia.exceptions.DisambiguationError as e:
            print(f"The title '{topic}' is ambiguous. Options are: {e.options}")
            return None, None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None, None

    elif choice == "2":
        file_path = input("Enter the path to your PDF file: ").strip()
        if os.path.isfile(file_path) and file_path.endswith('.pdf'):
            try:
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    pdf_text = "".join([page.extract_text() for page in pdf_reader.pages])
                with open('pdf_text.txt', 'w', encoding='utf-8') as f:
                    f.write(pdf_text)
                print("PDF content extracted and saved successfully.")
                topic = input("Enter a topic from the PDF content: ").strip()
                return 'pdf_text.txt', topic
            except Exception as e:
                print(f"Failed to read the PDF file: {e}")
                return None, None
        else:
            print("Invalid file path or file type. Please upload a PDF file.")
            return None, None
    else:
        print("Invalid choice. Please enter 1 or 2.")
        return None, None


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
    max_new_tokens = 750 # Adjusted from 1024 to 250

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
    allowed_context_length = 250
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
        # print("\n\n\n\nresponnse\n\n\n\n")
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
                        "question": match[0].strip(),
                        "options": {
                            "a": match[1].strip(),
                            "b": match[2].strip(),
                            "c": match[3].strip(),
                            "d": match[4].strip()
                        },
                        "correct_answer": match[5][0].strip()
                    })
            
            elif question_type == "Fill in the Blanks":
                fill_pattern = re.compile(r'Q:\s*(.*?)\nAnswer:\s*(.*?)(?=\n\n|$)', re.DOTALL)
                matches = fill_pattern.findall(generated_text)
                
                for match in matches:
                    formatted_questions.append({
                        "question": match[0].strip(),
                        "correct_answer": match[1].strip()
                    })
            
            elif question_type == "True/False":
                tf_pattern = re.compile(r'Q:\s*(.*?)\nAnswer:\s*(True|False)(?=\n\n|$)', re.DOTALL)
                matches = tf_pattern.findall(generated_text)
                
                for match in matches:
                    formatted_questions.append({
                        "question": match[0].strip(),
                        "correct_answer": match[1].strip()
                    })

            # Save to JSON if questions are found
            if formatted_questions:
                with open('questions.json', 'w') as f:
                    json.dump(formatted_questions, f, ensure_ascii=False, indent=4)
                print(f"Generated {len(formatted_questions)} questions.")
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
    score = 0
    total_questions = len(selected_questions)
    
    for idx, question in enumerate(selected_questions):
        print(f"\nQ{idx + 1}: {question['question']}")
        if 'options' in question:
            for option, text in question['options'].items():
                print(f"  {option}. {text}")
        
        answer = input("Your answer: ").strip().lower()
        
        correct_answer = question['correct_answer'].strip().lower()
        if answer == correct_answer:
            score += 1
            print("Correct!")
        else:
            print(f"Wrong! The correct answer was: {correct_answer}")

        print(f"Current Score: {score}/{idx + 1}")

    print(f"\nFinal Score: {score}/{total_questions}")

def main():
    for filename in ['wiki_txt.txt', 'pdf_text.txt', 'questions.json']:
        if os.path.exists(filename):
            open(filename, 'w').close()

    content_file, topic = get_content_from_user()
    # print(f"Content file: {content_file}, Topic: {topic}")  # Debug print

    if content_file and topic:
        print("Content loaded successfully. Preparing dataset for RAG implementation...")
        vector_store = prepare_rag_dataset(content_file)
        # print(f"Vector store: {vector_store}")  # Debug print

        # Save the vector store
        vector_store.save_local("rag_vector_store")
        print("Dataset prepared and saved for RAG implementation.")

        # Use the entire context to generate questions
        combined_context = " ".join([doc.page_content for doc in vector_store.similarity_search("", k=5)])
        # print(f"Combined context: {combined_context}")  # Debug print

        question_type_choice = input("Enter the type of question to generate (1 for mcq, 2 for fill_in_the_blank, 3 for true_false): ").strip()
        print(f"Question type choice: {question_type_choice}")  # Debug print
        
        if question_type_choice == "1":
            question_type = "Multiple Choice Questions"
        elif question_type_choice == "2":
            question_type = "Fill in the Blanks"
        elif question_type_choice == "3":
            question_type = "True/False"
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")
            return

        # Generate questions
        generated_questions = generate_questions_with_huggingface_api(combined_context, question_type, topic)
        # print(f"Generated questions: {generated_questions}")  # Debug print
        if generated_questions:
            num_questions_to_generate = int(input("How many questions would you like to answer? ").strip())
            print(f"Number of questions to generate: {num_questions_to_generate}")  # Debug print
            print("\nStarting the Quiz...\n")
            display_quiz(num_questions_to_generate)
    else:
        print("Failed to get valid content. Please try again.")

if __name__ == '__main__':
    main()
