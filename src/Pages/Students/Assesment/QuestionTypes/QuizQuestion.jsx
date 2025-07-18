import React, { useState, useEffect } from 'react';
import { saveAnswer } from '../../../../Controllers/SubmissionController';

const QuizQuestion = ({ question, answer }) => {
  const submissionId = localStorage.getItem('submission_id');

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // ✅ Load answer from props on first mount or when question changes
  useEffect(() => {
    if (answer) {
      setSelectedOptions(answer);
      // You can also use: setIsMarkedForReview(answer.flags?.is_marked_for_review ?? false);
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
      setSaveMessage('Answer saved successfully.');
    } catch (err) {
      console.error('Error saving answer:', err);
      setSaveMessage('Error saving answer.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="border p-4 rounded-lg mb-6 shadow-sm bg-white">
      <p className="mb-4 font-medium text-gray-800">{question.content.question_text}</p>

      <div className="space-y-2 mb-4">
        {question.options.map((opt) => {
          const selected = selectedOptions.includes(opt.option_id);
          return (
            <button
              key={opt.option_id}
              onClick={() => handleOptionClick(opt.option_id)}
              className={`block w-full text-left px-4 py-2 rounded-md border text-sm transition ${
                selected
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* ✅ Mark for Review */}
      <label className="inline-flex items-center text-sm text-gray-700 mb-3">
        <input
          type="checkbox"
          className="mr-2"
          checked={isMarkedForReview}
          onChange={(e) => setIsMarkedForReview(e.target.checked)}
        />
        Mark for Review
      </label>

      <div>
        <button
          onClick={handleSaveAnswer}
          disabled={isSaving}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Answer'}
        </button>
      </div>

      {saveMessage && <p className="text-xs mt-2 text-gray-600">{saveMessage}</p>}
    </div>
  );
};

export default QuizQuestion;
