import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuestionPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const questions = state?.questions || [];

  const handleAnswerSubmit = () => {
    const correctAnswer = questions[currentQuestionIndex]?.correct_answer;
  
    if (!correctAnswer) {
      console.error(`Question ${currentQuestionIndex + 1} has no valid 'correct_answer' field.`);
      return;
    }
  
    // Record the user's answer
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestionIndex]?.question,
        userAnswer: selectedAnswer,
        correctAnswer: correctAnswer,
      },
    ]);
  
    // Increment score if the answer is correct
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1); // Correctly update the score
    }
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(''); // Reset selected answer for the next question
    } else {
      setQuizComplete(true); // Mark the quiz as complete
    }
  };
  

  if (quizComplete) {
    return (
      <div className="h-screen bg-cover flex items-center justify-center px-10">
        <div className="w-3/5 p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed</h2>
          <p className="text-lg">Your score is: {score} / {questions.length}</p>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-sky-700 text-white rounded-lg"
            >
              Go Home
            </button>
            <button
              onClick={() => navigate('/response-sheet', { state: { userAnswers } })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              View Response Sheet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-cover flex flex-col items-start justify-center px-10">
      <div className="mt-6 p-8 bg-white rounded-lg shadow-lg w-3/5 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <div className="mb-4">
          {questions[currentQuestionIndex]?.question}
        </div>
        <div className="space-y-4">
          {questions[currentQuestionIndex]?.type === 'multiple-choice' ? (
            questions[currentQuestionIndex]?.options && Object.entries(questions[currentQuestionIndex].options).map(([key, option], index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${key}`}
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                <label htmlFor={`option-${key}`} className="ml-2">
                  {option}
                </label>
              </div>
            ))
          ) : questions[currentQuestionIndex]?.type === 'true/false' ? (
            <div className="flex flex-col space-y-4">
              <div>
                <input
                  type="radio"
                  id="true"
                  name="trueFalse"
                  value="True"
                  checked={selectedAnswer === 'True'}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                <label htmlFor="true" className="ml-2">
                  True
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="false"
                  name="trueFalse"
                  value="False"
                  checked={selectedAnswer === 'False'}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                <label htmlFor="false" className="ml-2">
                  False
                </label>
              </div>
            </div>
          ) : questions[currentQuestionIndex]?.type === 'fill-in-the-blank' ? (
            <input
              type="text"
              placeholder="Type your answer here"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              className="border p-2 w-full"
            />
          ) : (
            <input
              type="text"
              placeholder="Type your answer here"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              className="border p-2 w-full"
            />
          )}
        </div>
        <div className="flex justify-between mt-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              className="bg-sky-700 hover:bg-sky-800 text-white py-2 px-6 rounded-lg transition duration-300"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleAnswerSubmit}
            disabled={!selectedAnswer} // Disable the button if no answer is selected
            className={`py-2 px-6 rounded-lg transition duration-300 ${
              selectedAnswer
                ? "bg-sky-700 hover:bg-sky-800 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
