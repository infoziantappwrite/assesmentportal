import React, { useState } from 'react';

const QuizQuestion = ({ question }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (selectedOption) {
      // You can save answer to localStorage or backend
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div>
      <p className="text-gray-800 font-medium mb-4">{question.content?.question_text}</p>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <label key={opt.option_id} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name={question._id}
              value={opt.option_id}
              checked={selectedOption === opt.option_id}
              onChange={() => setSelectedOption(opt.option_id)}
              className="accent-blue-600"
            />
            {opt.text}
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={!selectedOption}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        {saved ? 'Saved' : 'Save Answer'}
      </button>
    </div>
  );
};

export default QuizQuestion;
