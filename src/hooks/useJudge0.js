import { useState, useCallback } from 'react';
import judge0Service from '../api/judge0Service';

export const useJudge0 = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [error, setError] = useState(null);

  const executeCode = useCallback(async (sourceCode, language, stdin = '') => {
    setIsExecuting(true);
    setError(null);
    
    try {
      const result = await judge0Service.executeCode(sourceCode, language, stdin);
      setExecutionResults(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const executeWithTestCases = useCallback(async (sourceCode, language, testCases) => {
    setIsExecuting(true);
    setError(null);
    
    try {
      const results = await judge0Service.executeWithTestCases(sourceCode, language, testCases);
      setExecutionResults(results);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setExecutionResults(null);
    setError(null);
  }, []);

  return {
    isExecuting,
    executionResults,
    error,
    executeCode,
    executeWithTestCases,
    clearResults
  };
};
