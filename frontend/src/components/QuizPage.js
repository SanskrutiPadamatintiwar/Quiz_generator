import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const QuizPage = () => {
  const [mode, setMode] = useState('topic');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('mcq');
  const [pdfFile, setPdfFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loadingButton, setLoadingButton] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.pdf')) {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleAnswerChange = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleSubmit = async (e, buttonType) => {
    e.preventDefault();

    if (mode === 'topic' && !topic.trim()) {
      alert('Please enter a topic.');
      return;
    }
    if (mode === 'file' && (!pdfFile || !pdfFile.name.endsWith('.pdf'))) {
      alert('Please upload a valid PDF file.');
      return;
    }

    // Map questionType to numeric value
    const questionTypeMapping = {
      mcq: '1',
      fill_in_the_blank: '2',
      true_false: '3',
    };

    const formData = new FormData();
    formData.append('questionType', questionTypeMapping[questionType]);
    formData.append('numQuestions', parseInt(numQuestions, 10));
    if (mode === 'topic') formData.append('topic', topic);
    if (mode === 'file') formData.append('file', pdfFile);

    setLoadingButton(buttonType);
    try {
      const response = await axios.post(`${API_BASE_URL}/start-quiz`, formData);

      if (response.status === 200) {
        if (buttonType === 'getQuestions') {
          navigate('/questions', { state: { questions: response.data.questions } });
        } else if (buttonType === 'attemptQuiz') {
          navigate('/all-questions', { state: { questions: response.data.questions } });
        }
        setQuestions(response.data.questions);
        setLoadingButton(null);
      } else {
        console.error('Failed to fetch questions');
        setLoadingButton(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      setLoadingButton(null);
    }
  };

  return (
    <div className="h-screen bg-cover flex items-center justify-center px-10">
      <form
        onSubmit={(e) => handleSubmit(e, 'getQuestions')}
        className="w-3/5 p-8 bg-opacity-90 bg-white rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mb-2">Choose Input Method:</label>
          <div className="flex space-x-4 mt-2">
            <button
              type="button"
              onClick={() => setMode('topic')}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
                mode === 'topic' ? 'bg-sky-900 text-white hover:bg-sky-950' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Enter Topic
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
                mode === 'file' ? 'bg-sky-900 text-white hover:bg-sky-950' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Upload PDF
            </button>
          </div>
        </div>

        {mode === 'topic' ? (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="topic">Enter Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="file">Upload PDF File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="questionType">Select Question Type</label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="fill_in_the_blank">Fill in the Blank</option>
            <option value="true_false">True/False</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="numQuestions">Number of Questions</label>
          <input
            type="number"
            id="numQuestions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            min="1"
            max="20"
            required
          />
        </div>
        <div className="flex justify-between space-x-4 mt-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'getQuestions')}
            className="w-full px-4 py-2 bg-sky-900 hover:bg-sky-950 rounded-full text-white font-semibold transition duration-300"
            disabled={loadingButton === 'getQuestions'}
          >
            {loadingButton === 'getQuestions' ? 'Loading...' : 'Get Questions'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'attemptQuiz')}
            className="w-full px-4 py-2 bg-sky-900 hover:bg-sky-950 rounded-full text-white font-semibold transition duration-300"
            disabled={loadingButton === 'attemptQuiz'}
          >
            {loadingButton === 'attemptQuiz' ? 'Loading...' : 'Attempt Quiz'}
          </button>
        </div>
      </form>

      {questions.length > 0 && (
        <div className="mt-6 p-8 bg-white rounded-lg shadow-lg w-3/5 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <div className="mb-4">{questions[currentQuestionIndex].question}</div>
          <div className="space-y-4">
            {questions[currentQuestionIndex].options && Object.entries(questions[currentQuestionIndex].options).map(([key, option], index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${key}`}
                  name="answer"
                  value={option}
                  checked={selectedAnswers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerChange(option)}
                />
                <label htmlFor={`option-${key}`} className="ml-2">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevQuestion}
                className="bg-sky-700 hover:bg-sky-800 text-white py-2 px-6 rounded-lg transition duration-300"
              >
                Previous Question
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 && (
              <button
                onClick={handleNextQuestion}
                className="bg-sky-700 hover:bg-sky-800 text-white py-2 px-6 rounded-lg transition duration-300"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
