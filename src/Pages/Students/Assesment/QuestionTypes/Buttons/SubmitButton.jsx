import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { submitCodeForEvaluation } from '../../../../../Controllers/SubmissionController';

const SubmitButton = ({ 
  submissionId, 
  question, 
  answer, 
  selectedLanguage,
  answerId,
  onSubmitSuccess,
  onSubmitError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    if (!window.confirm('Are you sure you want to submit? You cannot change your answer after submission.')) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await submitCodeForEvaluation(submissionId, {
        question_id: question._id,
        code: answer,
        language: selectedLanguage,
        language_id: getLanguageId(selectedLanguage),
        answer_id: answerId
      });

      if (onSubmitSuccess) onSubmitSuccess(response);
    } catch (error) {
      console.error('Failed to submit code:', error);
      if (onSubmitError) onSubmitError(error);
      alert(error.message || 'Failed to submit code');
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageId = (language) => {
    const languageMap = {
      'python': 71,
      'javascript': 63,
      'java': 62,
      'c': 50,
      'cpp': 54,
    };
    return languageMap[language.toLowerCase()] || 71;
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isLoading}
      className={`px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm flex items-center gap-2 ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      <Terminal className="w-4 h-4" />
      {isLoading ? 'Submitting...' : 'Submit Answer'}
    </button>
  );
};

export default SubmitButton;