import React, { useState, useRef } from 'react';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { saveCodingAnswer } from '../../../../../Controllers/SubmissionController';

const SaveButton = ({ 
  submissionId, 
  question, 
  answer, 
  selectedLanguage, 
  onSaveSuccess,
  onSaveError 
}) => {
  const [status, setStatus] = useState(null); // 'saving', 'saved', 'error', 'retrying'
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState(null);
  
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  const MAX_RETRIES = 3;
  const TIMEOUT_DURATION = 30000; // 30 seconds
  const RETRY_DELAYS = [1000, 3000, 5000]; // Progressive delays

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const attemptSave = async (attempt = 0) => {
    try {
      // Create abort controller for this attempt
      abortControllerRef.current = new AbortController();
      
      const saveData = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: answer,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false
      };

      // Set timeout for this attempt
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error(`Request timed out after ${TIMEOUT_DURATION / 1000} seconds`));
        }, TIMEOUT_DURATION);
      });

      // Make the API call with timeout race
      const savePromise = saveCodingAnswer(submissionId, saveData, {
        signal: abortControllerRef.current.signal
      });

      await Promise.race([savePromise, timeoutPromise]);
      
      // Success
      cleanup();
      setStatus('saved');
      setRetryCount(0);
      setLastError(null);
      
      if (onSaveSuccess) onSaveSuccess();
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus(null), 3000);
      
    } catch (error) {
      cleanup();
      
      // Don't retry if the request was manually aborted
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error(`Save attempt ${attempt + 1} failed:`, error);
      setLastError(error.message || 'Unknown error occurred');
      
      // If we haven't reached max retries, attempt retry
      if (attempt < MAX_RETRIES) {
        setStatus('retrying');
        setRetryCount(attempt + 1);
        
        // Wait before retrying with progressive delay
        await sleep(RETRY_DELAYS[attempt] || 5000);
        
        // Check if component is still mounted and user hasn't started a new save
        if (isLoading) {
          return attemptSave(attempt + 1);
        }
      } else {
        // All retries exhausted
        setStatus('error');
        setRetryCount(0);
        if (onSaveError) onSaveError(error);
      }
    }
  };

  const handleSave = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setStatus('saving');
      setRetryCount(0);
      setLastError(null);
      
      await attemptSave();
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    cleanup();
    setIsLoading(false);
    setStatus(null);
    setRetryCount(0);
    setLastError(null);
  };

  const handleManualRetry = () => {
    handleSave();
  };

  const getButtonContent = () => {
    switch (status) {
      case 'saving':
        return (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Saving...
          </div>
        );
      case 'retrying':
        return (
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 animate-spin mr-2" />
            Retrying... ({retryCount}/{MAX_RETRIES})
          </div>
        );
      case 'saved':
        return '✓ Saved Successfully!';
      case 'error':
        return (
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Save Failed
          </div>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4 inline mr-1" />
            Save Answer
          </>
        );
    }
  };

  const getButtonClass = () => {
    const baseClass = "px-5 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all duration-200";
    
    switch (status) {
      case 'saving':
        return `${baseClass} bg-cyan-500 text-white cursor-not-allowed`;
      case 'retrying':
        return `${baseClass} bg-amber-500 text-white cursor-not-allowed`;
      case 'saved':
        return `${baseClass} bg-green-500 text-white border-2 border-green-400`;
      case 'error':
        return `${baseClass} bg-red-500 text-white border-2 border-red-400 hover:bg-red-600`;
      default:
        return `${baseClass} bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm hover:shadow-md`;
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <button
          onClick={status === 'error' ? handleManualRetry : handleSave}
          disabled={isLoading && status !== 'error'}
          className={getButtonClass()}
        >
          {getButtonContent()}
        </button>
        
        {/* Cancel button when loading */}
        {(status === 'saving' || status === 'retrying') && (
          <button
            onClick={handleCancel}
            className="px-3 py-2.5 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
      
      {/* Error message display */}
      {status === 'error' && lastError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <strong>Error:</strong> {lastError}
          <div className="mt-1 text-red-500">
            Click "Save Failed" button above to retry manually.
          </div>
        </div>
      )}
      
      {/* Retry info */}
      {status === 'retrying' && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          <strong>Retrying:</strong> Attempt {retryCount} of {MAX_RETRIES}
          {lastError && <div className="mt-1">Last error: {lastError}</div>}
        </div>
      )}
    </div>
  );
};

export default SaveButton;