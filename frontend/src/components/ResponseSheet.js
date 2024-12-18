import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResponseSheet = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userAnswers = [] } = state || {};

  return (
    <div className="h-screen bg-cover flex items-center justify-center px-10">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Response Sheet</h2>

        {/* Scrollable Box */}
        <div className="overflow-y-auto max-h-96 p-4 bg-gray-50 rounded-lg shadow-inner">
          {userAnswers.map((answer, index) => {
            const isCorrect = answer.userAnswer === answer.correctAnswer;
            return (
              <div
                key={index}
                className={`p-3 border-b last:border-b-0 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <p className="text-base font-medium">
                  Q{index + 1}: {answer.question}
                </p>
                <p className="text-sm">
                  <strong>Your Answer:</strong> {answer.userAnswer}
                </p>
                <p className="text-sm">
                  <strong>Correct Answer:</strong> {answer.correctAnswer}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseSheet;
