import React from 'react';

const DescriptiveQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div>
      <p className="mb-4 font-medium text-gray-800">{question.content.question_text}</p>
      <textarea
        value={answer || ''}
        onChange={(e) => onAnswerChange(question._id, e.target.value)}
        rows={6}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        placeholder="Write your answer..."
      />
    </div>
  );
};

export default DescriptiveQuestion;
