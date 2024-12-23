import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResponseSheet = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userAnswers = [] } = state || {};

  return (
    <div className="bg-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Response Sheet</h1>
      <ul className="space-y-6">
        {userAnswers.map((answer, index) => {
          const isCorrect = answer.userAnswer === answer.correctAnswer;
          return (
            <li key={index} className="border-b border-gray-600 pb-4">
              <h3 className="text-xl font-semibold">Question {index + 1}:</h3>
              <p className="mt-2">{answer.question}</p>
              {answer.options && (
                <ul className="list-disc pl-6 mt-2">
                  {Object.entries(answer.options).map(([key, option], optionIndex) => (
                    <li key={optionIndex}>
                      <span className="font-medium">{key.toUpperCase()}:</span> {option}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2">
                <strong>Your Answer: </strong>
                <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {answer.userAnswer}
                </span>
              </p>
              <p className="mt-2">
                <strong>Correct Answer: </strong>
                <span className="text-green-400">{answer.correctAnswer}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ResponseSheet;
