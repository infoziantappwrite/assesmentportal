import React, { useState, useEffect } from 'react';
import { saveAnswer } from '../../../../Controllers/SubmissionController';

const QuizQuestion = ({ question, answer }) => {
  const submissionId = localStorage.getItem('submission_id');

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (answer) {
      setSelectedOptions(answer);
    } else {
      setSelectedOptions([]);
      setIsMarkedForReview(false);
    }
  }, [answer, question._id]);

  const handleOptionClick = (optionId) => {
    if (question.type === 'single_correct') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((opt) => opt !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSaveAnswer = async () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option before saving.');
      return;
    }

    const payload = {
      sectionId: question.section_id,
      questionId: question._id,
      type: question.type,
      selectedOptions,
      isMarkedForReview,
    };

    try {
      setIsSaving(true);
      await saveAnswer(submissionId, payload);
      setSaveMessage('Answer saved successfully');
    } catch (err) {
      console.error('Error saving answer:', err);
      setSaveMessage('Error saving answer');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div>

      <div className="space-y-3 mb-6">
        {question.options.map((opt) => {
          const selected = selectedOptions.includes(opt.option_id);
          return (
            <button
              key={opt.option_id}
              onClick={() => handleOptionClick(opt.option_id)}
              className={`block w-full text-left px-4 py-2 rounded-md border text-sm transition font-medium ${selected
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2"
            checked={isMarkedForReview}
            onChange={(e) => setIsMarkedForReview(e.target.checked)}
          />
          Mark for Review
        </label>

        {isMarkedForReview && (
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
            🟣 Marked for Review
          </span>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAnswer}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Answer'}
          </button>
        </div>
      </div>



      {saveMessage && (
        <div className={`fixed top-3.5 right-4 z-50 px-4 py-2 rounded-lg shadow-md text-sm duration-500 transition-opacity ${saveMessage.includes('success')
            ? 'bg-green-100 text-green-700 border border-green-400'
            : 'bg-red-100 text-red-700 border border-red-400'
          } opacity-100`}
        >
          {saveMessage}
        </div>
      )}

    </div>
  );
};

export default QuizQuestion;
