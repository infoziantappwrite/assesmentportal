import React from 'react';

const QuizQuestion = ({ question, answer, onAnswerChange }) => {
  const handleOptionClick = (optionId) => {
    if (question.type === 'single_correct') {
      onAnswerChange(question._id, optionId);
    } else {
      const existing = answer || [];
      const updated = existing.includes(optionId)
        ? existing.filter((opt) => opt !== optionId)
        : [...existing, optionId];
      onAnswerChange(question._id, updated);
    }
  };

  return (
    <div>
      <p className="mb-4 font-medium text-gray-800">{question.content.question_text}</p>
      <div className="space-y-2">
        {question.options.map((opt) => {
          const selected =
            question.type === 'single_correct'
              ? answer === opt.option_id
              : (answer || []).includes(opt.option_id);
          return (
            <button
              key={opt.option_id}
              onClick={() => handleOptionClick(opt.option_id)}
              className={`block w-full text-left px-4 py-2 rounded-md border text-sm ${
                selected
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;
