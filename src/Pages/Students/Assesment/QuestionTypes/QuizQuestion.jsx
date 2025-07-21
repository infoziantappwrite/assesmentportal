import React, { useState, useEffect } from 'react';
import {
  saveAnswer,
  getAnsweredStatus
} from '../../../../Controllers/SubmissionController';

const QuizQuestion = ({ question }) => {
  const submissionId = localStorage.getItem('submission_id');
  console.log(question)
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const fetchAnswer = async () => {
      setSelectedOptions([]);
      setIsMarkedForReview(false);

      setStartTime(Date.now());

      try {
        const response = await getAnsweredStatus(submissionId, question._id);
        const answer = response.data;
        console.log(answer);

        if (answer?.selected_options) {
          setSelectedOptions(answer.selected_options);
          setIsMarkedForReview(answer.flags?.is_marked_for_review || false);
        }
      } catch (error) {
        console.error("Error fetching saved answer:", error);
        // Optional: toast or silent fail
      }
    };

    if (submissionId && question?._id) {
      fetchAnswer();
    }
  }, [submissionId, question._id]);

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

    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);

    const payload = {
      sectionId: question.section_id,
      questionId: question._id,
      type: question.type,
      selectedOptions,
      isMarkedForReview,
      timeTakenSeconds
    };

    try {
      setIsSaving(true);
      await saveAnswer(submissionId, payload);
      setSaveMessage('✅ Answer saved successfully');
    } catch (err) {
      console.error('Error saving answer:', err);
      setSaveMessage('❌ Error saving answer');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        {question.content?.question_text || 'Untitled Question'}
      </h2>

      {question.content?.images?.length > 0 && (
        <div className="mb-4 space-x-2">
          {question.content.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`question-img-${idx}`}
              className="inline-block h-24 object-contain border rounded"
            />
          ))}
        </div>
      )}

      <div className="space-y-3 mb-6">
        {question.options.map((opt) => {
          const selected = selectedOptions.includes(opt.option_id);
          return (
            <button
              key={opt.option_id}
              onClick={() => handleOptionClick(opt.option_id)}
              className={`block w-full text-left px-4 py-2 rounded-md border text-sm transition font-medium ${
                selected
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
        <div
          className={`fixed top-3.5 right-4 z-50 px-4 py-2 rounded-lg shadow-md text-sm duration-500 transition-opacity ${
            saveMessage.includes('success')
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
