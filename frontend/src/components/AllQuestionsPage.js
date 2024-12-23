import React from 'react';
import { useLocation } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Download the questions and answers as a PDF
const downloadQuestionsAsPDF = async (questions) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  
  // Use StandardFonts.Helvetica
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let yPosition = height - 40; // Start position for text
  const fontSize = 12;
  
  // Add Title
  page.drawText('Generated Questions and Answers', {
    x: 50,
    y: yPosition,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  yPosition -= 30;

  questions.forEach((question, index) => {
    // Add Question Number and Text
    page.drawText(`Question ${index + 1}: ${question.question}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Add Options
    if (question.options) {
      Object.entries(question.options).forEach(([key, option]) => {
        page.drawText(`${key.toUpperCase()}: ${option}`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
      });
    }

    // Add Correct Answer
    if (question.correct_answer) {
      page.drawText(`Correct Answer: ${question.correct_answer}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0.5, 0),  // Green color for correct answer
      });
      yPosition -= 20;
    }

    // Add some space between questions
    yPosition -= 10;

    // Avoid text overlapping by checking space
    if (yPosition < 50) {
      page.addPage([600, 800]);
      yPosition = height - 40;
    }
  });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Create a download link for the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'questions_and_answers.pdf';
  link.click();
};

const QuestionsPage = () => {
  const location = useLocation();
  const { questions } = location.state || {}; // Get questions from navigation state

  if (!questions || questions.length === 0) {
    return <p className="text-white">No questions available to display.</p>;
  }

  return (
    <div className="bg-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Generated Questions</h1>
      <ul className="space-y-6">
        {questions.map((question, index) => (
          <li key={index} className="border-b border-gray-600 pb-4">
            <h3 className="text-xl font-semibold">Question {index + 1}:</h3>
            <p className="mt-2">{question.question}</p>
            {question.options && (
              <ul className="list-disc pl-6 mt-2">
                {Object.entries(question.options).map(([key, option], optionIndex) => (
                  <li key={optionIndex}>
                    <span className="font-medium">{key.toUpperCase()}:</span> {option}
                  </li>
                ))}
              </ul>
            )}
            {question.correct_answer && (
              <p className="mt-2 text-green-400 font-medium">Correct Answer: {question.correct_answer}</p>
            )}
          </li>
        ))}
      </ul>
      <div className="text-center mt-6">
        <button
          onClick={() => downloadQuestionsAsPDF(questions)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Download Questions and Answers as PDF
        </button>
      </div>
    </div>
  );
};

export default QuestionsPage;
