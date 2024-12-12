import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuestionPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const questions = state?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  if (questions.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500">No questions available. Please start the quiz again.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-sky-700 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAnswerSubmit = () => {
    const correctAnswer = questions[currentQuestionIndex]?.answer.find((ans) => ans.correct)?.answer;

    if (selectedAnswer === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setSelectedAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {currentQuestionIndex < questions.length ? (
        <div className="w-3/5 p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="mb-4">{questions[currentQuestionIndex]?.question}</p>
          <div className="space-y-4">
            {questions[currentQuestionIndex]?.answer.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  value={option.answer}
                  checked={selectedAnswer === option.answer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                <label htmlFor={`option-${index}`} className="ml-2">
                  {option.answer}
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleAnswerSubmit}
            className="mt-4 px-4 py-2 bg-sky-700 text-white rounded-lg"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      ) : (
        <div className="w-3/5 p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed</h2>
          <p className="text-lg">Your score is: {score} / {questions.length}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-sky-700 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
