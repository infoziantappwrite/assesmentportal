import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import {
  saveAnswer,
  questionVisited,

} from '../../../../Controllers/SubmissionController';
import NotificationMessage from '../../../../Components/NotificationMessage';

const QuizQuestion = ({ question, refreshSectionStatus, answerStatus,questionIndex }) => {
  const submissionId = localStorage.getItem('submission_id');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [notification, setNotification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef(null);

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
          if (Array.isArray(answer.selected_options)) {
            setSelectedOptions(answer.selected_options);
          }
          if (answer.is_marked_for_review) {
            setIsMarkedForReview(true);
          }
        }
      } catch {
        // Silent error
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

  // Debounced Save
  const debouncedSaveAnswer = useCallback(
    debounce(async (opts, marked) => {
      setIsSaving(true);
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
        setIsSaving(false);
      }
    }, 500),
    [submissionId, question._id, startTime]
  );

  debounceRef.current = debouncedSaveAnswer;

  const handleOptionClick = (optionId) => {
    let updatedOptions;
    if (question.type === 'single_correct') {
      updatedOptions = [optionId];
    } else {
      updatedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter((opt) => opt !== optionId)
        : [...selectedOptions, optionId];
    }

    setSelectedOptions(updatedOptions);
    setIsMarkedForReview(false);
    debounceRef.current?.cancel(); // Cancel previous call
    debouncedSaveAnswer(updatedOptions, false); // Trigger new call
  };

  const handleMarkForReview = (e) => {
    const checked = e.target.checked;

    if (selectedOptions.length === 0 && checked) {
      showNotification('warning', 'Please select an option before marking for review');
      return;
    }

    setIsMarkedForReview(checked);
    debounceRef.current?.cancel();
    debouncedSaveAnswer(selectedOptions, checked);
  };

  return (
    <div className='bg-white p-4 border border-gray-200 rounded-xl'>
      {/* 🔔 Notification */}
      {notification && (
        <NotificationMessage type={notification.type} message={notification.message} />
      )}

      {/* 📷 Question Images */}
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
      <h2 className="mb-4 font-semibold text-lg text-gray-800">
        Q{questionIndex + 1}. {question.content.question_text}
      </h2>

      {/* ✅ Options List */}
      <div className="space-y-3 mb-6">
        {question.options.map((opt) => {
          const selected = selectedOptions.includes(opt.option_id);
          return (
            <button
              key={opt.option_id}
              onClick={() => handleOptionClick(opt.option_id)}
              disabled={isSaving}
              className={`block w-full text-left px-4 py-2 rounded-md border text-sm transition font-medium 
                ${selected
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} 
                ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* 🟣 Mark for Review */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2"
            checked={isMarkedForReview}
            onChange={handleMarkForReview}
            disabled={isSaving}
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
