import React, { useState, useEffect } from 'react';
import {
  saveAnswer,
  questionVisited,
} from '../../../../Controllers/SubmissionController';
import NotificationMessage from '../../../../Components/NotificationMessage'; 

const QuizQuestion = ({ question, refreshSectionStatus, answerStatus }) => {
  const submissionId = localStorage.getItem('submission_id');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [notification, setNotification] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const MIN_SAVE_INTERVAL = 500; // in ms

  // Show notification then auto-clear after 2s
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 2000);
  };

  useEffect(() => {
    const fetchAnswer = async () => {
      setIsLoading(true);
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
          if (Array.isArray(answer.selected_options)) {
            setSelectedOptions(answer.selected_options);
          }

          if (answer.is_marked_for_review) {
            setIsMarkedForReview(true);
          }
        }
      } catch {
        // handle error silently or log
      } finally {
        setIsLoading(false);
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
    const now = Date.now();
    if (now - lastSaveTime < MIN_SAVE_INTERVAL) return;
    setLastSaveTime(now);

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (optionId) => {
    if (isLoading) return;

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
    if (isLoading) return;

    const checked = e.target.checked;

    if (selectedOptions.length === 0 && checked) {
      showNotification('warning', 'Please select an option before marking for review');
      return;
    }

    setIsMarkedForReview(checked);
    await handleSaveAnswer(selectedOptions, checked);
  };

  return (
    <div className="relative">
      {/* 🔔 Notification if exists */}
      {notification && (
        <NotificationMessage type={notification.type} message={notification.message} />
      )}

      {/* Optional Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-sm text-gray-700">Loading...</div>
        </div>
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
      <div className={`space-y-3 mb-6 ${isLoading ? 'pointer-events-none opacity-60' : ''}`}>
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
            disabled={isLoading}
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
