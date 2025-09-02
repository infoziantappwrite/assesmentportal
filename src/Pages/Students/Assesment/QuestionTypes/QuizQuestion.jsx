import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import {
  saveAnswer,
  questionVisited,
} from '../../../../Controllers/SubmissionController';
import NotificationMessage from '../../../../Components/NotificationMessage';

const QuizQuestion = ({ question, refreshSectionStatus, answerStatus, questionIndex }) => {
  const submissionId = localStorage.getItem('submission_id');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [notification, setNotification] = useState(null);

  // "idle" | "saving" | "saved"
  const [saveStatus, setSaveStatus] = useState('idle');
  const debounceRef = useRef(null);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 2000);
  };

  // Retry logic with exponential backoff
  const retryWithBackoff = async (operation, maxRetries = 3, baseDelay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          const id = setTimeout(() => reject(new Error('Request timeout')), 10000);
          return id;
        });
        
        // Race between the operation and timeout
        const result = await Promise.race([
          operation(),
          timeoutPromise
        ]);
        
        return result; // Success
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed:`, error.message);
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError; // All attempts failed
  };

  // Fetch previous answer when question changes
  useEffect(() => {
    const fetchAnswer = async () => {
      setSelectedOptions([]);
      setIsMarkedForReview(false);
      setStartTime(Date.now());
      setSaveStatus('idle');

      try {
        const answer = answerStatus;
        if (!answer || answer.selected_options?.length === 0) {
          await retryWithBackoff(async () => {
            return await questionVisited({
              submissionID: submissionId,
              sectionID: question.section_id,
              questionID: question._id,
              type: question.type,
              isMarkedForReview: false,
              isSkipped: true,
            });
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
  },  [submissionId, question._id, answerStatus]);
  // Debounced save with timeout and retry
  const debouncedSaveAnswer = useCallback(
    debounce(async (opts, marked) => {
      if (saveStatus === 'saving') return;

      setSaveStatus('saving');
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a failsafe timeout to reset loading state (15 seconds max)
      timeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
        showNotification('error', 'Request timed out. Please try again.');
      }, 15000);

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
        await retryWithBackoff(async () => {
          return await saveAnswer(submissionId, payload);
        });
        
        // Clear the failsafe timeout on success
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        if (typeof refreshSectionStatus === 'function') refreshSectionStatus();
        showNotification('success', 'Answer saved');
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1500);
      } catch {
        // Clear the failsafe timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        showNotification('error', 'Error saving answer');
        setSaveStatus('idle');
      }
    }, 500),
    [submissionId, question._id, startTime, saveStatus]
  );

  debounceRef.current = debouncedSaveAnswer;

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
    setSaveStatus('idle');
  };

  const handleMarkForReview = (e) => {
    const checked = e.target.checked;
    if (selectedOptions.length === 0 && checked) {
      showNotification('warning', 'Please select an option before marking for review');
      return;
    }
    setIsMarkedForReview(checked);
    setSaveStatus('idle');
  };

  const handleManualSave = () => {
    if (saveStatus === 'saving') return;
    debouncedSaveAnswer.cancel();
    debouncedSaveAnswer(selectedOptions, isMarkedForReview);
  };

  // Button states
  const buttonDisabled = selectedOptions.length === 0 || saveStatus === 'saving';
  const buttonText =
    saveStatus === 'saving' ? 'Submitting...' :
    saveStatus === 'saved' ? 'Saved' :
    'Save Answer';

  return (
    <div className="relative">
      {/* Global Freeze Overlay */}
      {saveStatus === 'saving' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
          <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-14 h-14 mb-4"></div>
          <p className="text-white text-lg font-semibold">Saving your answer...</p>
        </div>
      )}

      {/* Question Content */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl">
        {/* Notification */}
        {notification && (
          <NotificationMessage type={notification.type} message={notification.message} />
        )}

        {/* Question Images */}
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

        {/* Question Text */}
        <h2 className="mb-4 font-semibold text-lg text-gray-800">
          Q{questionIndex + 1}. {question.content.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt) => {
            const selected = selectedOptions.includes(opt.option_id);
            return (
              <button
                key={opt.option_id}
                onClick={() => handleOptionClick(opt.option_id)}
                disabled={saveStatus === 'saving'}
                className={`block w-full text-left px-4 py-2 rounded-md border text-sm transition font-medium 
                  ${selected
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} 
                  ${saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Mark for Review + Save Button */}
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              className="mr-2"
              checked={isMarkedForReview}
              onChange={handleMarkForReview}
              disabled={saveStatus === 'saving'}
            />
            Mark for Review
          </label>

          {isMarkedForReview && (
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
              🟣 Marked for Review
            </span>
          )}

          <button
            onClick={handleManualSave}
            disabled={buttonDisabled}
            className={`px-4 py-2 rounded-md text-white text-sm font-semibold transition 
              ${buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;