import React, { useState, useEffect } from 'react';
import {
  saveAnswer,
  questionVisited,
} from '../../../../Controllers/SubmissionController';
import NotificationMessage from '../../../../Components/NotificationMessage'; // adjust path

const QuizQuestion = ({ question, refreshSectionStatus,answerStatus }) => {
  const submissionId = localStorage.getItem('submission_id');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'warning', message: string }

  // Show notification then auto-clear after 2s
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 2000);
  };

  useEffect(() => {
  const fetchAnswer = async () => {
    setSelectedOptions([]);
    setIsMarkedForReview(false);
    setStartTime(Date.now());

    try {
      const answer = answerStatus;

      if (!answer || answer.selected_options?.length === 0) {
        await questionVisited({
          submissionID: submissionId,
          sectionID: question.section_id,
          questionID: question._id,
          type: question.type,
          isMarkedForReview: false,
          isSkipped: true,
        });
        

      } else {
        // Set selected options if available
        if (Array.isArray(answer.selected_options)) {
          setSelectedOptions(answer.selected_options);
        }

        // Set mark for review flag
        if (answer.is_marked_for_review) {
          setIsMarkedForReview(true);
        }
      }
    } catch  {
      //console.error("Error processing answerStatus or questionVisited:", err);
    } finally {
      if (typeof refreshSectionStatus === 'function') {
        refreshSectionStatus();
      }
    }
  };

  if (submissionId && question?._id) {
    fetchAnswer();
  }
}, [submissionId, question._id]);


  const handleSaveAnswer = async (opts = selectedOptions, marked = isMarkedForReview) => {
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);

    const payload = {
      sectionId: question.section_id,
      questionId: question._id,
      type: question.type,
      selectedOptions: opts,
      isMarkedForReview: marked,
      timeTakenSeconds,
      isSkipped: false,
    };

    try {
      await saveAnswer(submissionId, payload);
      if (typeof refreshSectionStatus === 'function') refreshSectionStatus();
      showNotification('success', 'Answer saved');
    } catch {
      showNotification('error', 'Error saving answer');
    }
  };

  const handleOptionClick = async (optionId) => {
    let updatedOptions;
    if (question.type === 'single_correct') {
      updatedOptions = [optionId];
    } else {
      updatedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter((opt) => opt !== optionId)
        : [...selectedOptions, optionId];
    }

    setSelectedOptions(updatedOptions);
    setIsMarkedForReview(false); // reset
    await handleSaveAnswer(updatedOptions, false);
  };

  const handleMarkForReview = async (e) => {
    const checked = e.target.checked;

    if (selectedOptions.length === 0 && checked) {
      showNotification('warning', 'Please select an option before marking for review');
      return;
    }

    setIsMarkedForReview(checked);
    await handleSaveAnswer(selectedOptions, checked);
  };

  return (
    <div>
      {/* 🔔 Notification if exists */}
      {notification && (
        <NotificationMessage type={notification.type} message={notification.message} />
      )}

      {/* Images */}
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

      {/* Options */}
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

      {/* Mark for Review */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2"
            checked={isMarkedForReview}
            onChange={handleMarkForReview}
          />
          Mark for Review
        </label>

        {isMarkedForReview && (
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
            🟣 Marked for Review
          </span>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
