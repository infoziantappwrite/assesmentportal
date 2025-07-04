import React, { useState } from 'react';
import { Radio } from 'lucide-react';

const dummyQuestions = [
  // Quiz Section (1–10)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    type: 'quiz',
    question: `Quiz Question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct: 'Option B',
    selected: null,
  })),
  // Coding Section (11–20)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 11,
    type: 'coding',
    question: `Coding Question ${i + 1}`,
    answer: '',
  })),
];

const AssessmentQuestions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState(dummyQuestions);

  const current = questions[currentIndex];

  const handleOptionSelect = (option) => {
    const updated = [...questions];
    updated[currentIndex].selected = option;
    setQuestions(updated);
  };

  const handleAnswerChange = (e) => {
    const updated = [...questions];
    updated[currentIndex].answer = e.target.value;
    setQuestions(updated);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <main className="px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-blue-800 mb-6">
        {current.type === 'quiz' ? 'Quiz Section' : 'Coding Section'}
      </h2>

      <div className="mb-6 text-gray-700 font-medium">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div className="bg-white border rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{current.question}</h3>

        {current.type === 'quiz' && (
          <div className="space-y-2">
            {current.options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`cursor-pointer border rounded px-4 py-2 hover:bg-blue-50 transition ${
                  current.selected === option
                    ? 'border-blue-600 bg-blue-100 text-blue-800'
                    : 'border-gray-300'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {current.type === 'coding' && (
          <textarea
            value={current.answer}
            onChange={handleAnswerChange}
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your code here..."
          />
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default AssessmentQuestions;
