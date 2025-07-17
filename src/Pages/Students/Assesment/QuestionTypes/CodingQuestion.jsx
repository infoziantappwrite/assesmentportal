import React from 'react';

const CodingQuestion = ({ question, index }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="mb-2 font-medium text-gray-800">
        Q{index + 1}. {question.content?.question_text}
      </div>

      <div className="bg-gray-100 p-4 rounded text-sm font-mono text-gray-700">
        // Write your JavaScript code here...
      </div>
    </div>
  );
};

export default CodingQuestion;
