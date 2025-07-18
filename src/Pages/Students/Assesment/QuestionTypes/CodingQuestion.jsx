import React from 'react';

const CodingQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div>
      <p className="mb-4 font-medium text-gray-800">{question.content.question_text}</p>
      <textarea
        value={answer || ''}
        onChange={(e) => onAnswerChange(question._id, e.target.value)}
        rows={10}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
        placeholder="Write your code here..."
      />
    </div>
  );
};

export default CodingQuestion;
