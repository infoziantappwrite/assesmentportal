import React, { useState, useEffect } from 'react';
import {
  saveAnswer,
  getAnsweredStatus
} from '../../../../Controllers/SubmissionController';

const QuizQuestion = ({ question, refreshSectionStatus }) => {
  const submissionId = localStorage.getItem('submission_id');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [isSkipped, setIsSkipped] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());

  // Fetch saved answer when component mounts
  useEffect(() => {
    const fetchAnswer = async () => { 
      setSelectedOptions([]);
      setIsMarkedForReview(false);
      setIsSkipped(true);
      setStartTime(Date.now());

      try {
        const response = await getAnsweredStatus(submissionId, question._id);
        const answer = response.data;
       // console.log(answer)

        if (answer?.selected_options) {
          setSelectedOptions(answer.selected_options);
          setIsSkipped(answer.selected_options.length === 0);
        }

        if (answer?.flags?.is_marked_for_review) {
          setIsMarkedForReview(true);
        }
      } catch (error) {
        console.error("Error fetching saved answer:", error);
      }
    };

    if (submissionId && question?._id) {
      fetchAnswer();
    }
  }, [submissionId, question._id]);

  useEffect(() => {
  const fetchAnswer = async () => {
    setSelectedOptions([]);
    setIsMarkedForReview(false);
    setIsSkipped(true);
    setStartTime(Date.now());

    try {
      const response = await getAnsweredStatus(submissionId, question._id);
      const answer = response.data;

      let hasAnswer = false;

      if (answer?.selected_options?.length > 0) {
        setSelectedOptions(answer.selected_options);
        setIsSkipped(false);
        hasAnswer = true;
      }

      if (answer?.flags?.is_marked_for_review) {
        setIsMarkedForReview(true);
      }

      // 🟡 Mark as visited but unanswered if nothing was saved earlier
      if (!hasAnswer) {
        await handleSaveAnswer([], false, true); // isSkipped = true
      }

    } catch (error) {
      console.error("Error fetching saved answer:", error);
    }
  };

  if (submissionId && question?._id) {
    fetchAnswer();
  }
}, [submissionId, question._id]);


  // Save Answer
  const handleSaveAnswer = async (opts = selectedOptions, marked = isMarkedForReview, skip = isSkipped) => {
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    const payload = {
      sectionId: question.section_id,
      questionId: question._id,
      type: question.type,
      selectedOptions: opts,
      isMarkedForReview: marked,
      timeTakenSeconds,
      isSkipped: skip
    };

    try {
      await saveAnswer(submissionId, payload);
      if (typeof refreshSectionStatus === 'function') refreshSectionStatus();
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  };

  // When option is selected
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
    setIsSkipped(updatedOptions.length === 0);
    await handleSaveAnswer(updatedOptions, isMarkedForReview, updatedOptions.length === 0);
  };

  // When Mark for Review is toggled
  const handleMarkForReview = async (e) => {
    const checked = e.target.checked;
    setIsMarkedForReview(checked);
    await handleSaveAnswer(selectedOptions, checked, isSkipped);
  };

  return (
    <div>
      

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
