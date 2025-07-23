import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { saveCodingAnswer } from '../../../../../Controllers/SubmissionController';

const SaveButton = ({ 
  submissionId, 
  question, 
  answer, 
  selectedLanguage, 
  onSaveSuccess,
  onSaveError 
}) => {
  const [status, setStatus] = useState(null); // 'saving', 'saved', 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setStatus('saving');
      
      const saveData = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: answer,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false
      };

      await saveCodingAnswer(submissionId, saveData);
      
      setStatus('saved');
      if (onSaveSuccess) onSaveSuccess();
      
      // Reset status after 2 seconds
      setTimeout(() => setStatus(null), 2000);
    } catch (error) {
      console.error('Failed to save answer:', error);
      setStatus('error');
      if (onSaveError) onSaveError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`px-5 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
        status === 'saving'
          ? 'bg-cyan-400 text-white cursor-not-allowed'
          : status === 'saved'
            ? 'bg-green-100 text-green-800 border-2 border-green-200'
            : status === 'error'
              ? 'bg-red-100 text-red-800 border-2 border-red-200'
              : 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm'
      }`}
    >
      {status === 'saving' ? 'Saving...' :
        status === 'saved' ? '✓ Saved!' :
          status === 'error' ? '✗ Error Saving' : (
            <>
              <Save className="w-4 h-4 inline mr-1" />
              Save Answer
            </>
          )}
    </button>
  );
};

export default SaveButton;