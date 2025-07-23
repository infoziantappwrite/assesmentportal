import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { runSampleTestCases } from '../../../../../Controllers/SubmissionController';

const RunTestCasesButton = ({ 
  questionId, 
  answer, 
  selectedLanguage, 
  onTestResults,
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTests = async () => {
    if (!answer.trim()) {
      alert('Please write some code before running tests');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await runSampleTestCases(questionId, {
        code: answer,
        language_id: getLanguageId(selectedLanguage)
      });
      
      if (onTestResults) onTestResults(response.sample_results);
    } catch (error) {
      console.error('Failed to run test cases:', error);
      if (onError) onError(error);
      alert(error.message || 'Failed to run test cases');
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
      onClick={handleRunTests}
      disabled={isLoading}
      className={`px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm flex items-center gap-2 ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      <FlaskConical className="w-4 h-4" />
      {isLoading ? 'Running Tests...' : 'Run Test Cases'}
    </button>
  );
};

export default RunTestCasesButton;