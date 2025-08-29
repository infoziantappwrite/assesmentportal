import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Terminal,
  FlaskConical,
  Play,
  Settings,
  Zap,
  FileCode,
  Cpu,
  Clock,
  MemoryStick,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Save,
  Loader2,
  FileCheck2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

import { saveCodingAnswer, evaluateCodingSubmission, runSampleTestCases, RunCode } from "../../../../Controllers/SubmissionController"
import { DEFAULT_SUPPORTED_LANGUAGES, LANGUAGE_TEMPLATES } from "./utils/languageConfig";
import NotificationMessage from '../../../../Components/NotificationMessage';

const SolutionSection = ({
  question,
  answer,
  onAnswerChange,
  selectedLanguage,
  setSelectedLanguage,
  fullDetails,
  testResults,
  submissionId,
  refreshSectionStatus
}) => {
  
  // CRITICAL: Prevent code reset - stable state management
  const [editorCode, setEditorCode] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const currentQuestionIdRef = useRef(null);
  const currentLanguageRef = useRef(null);
  const initializationRef = useRef(false);
  
  // UI State
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [judge0Results, setJudge0Results] = useState(null);
  const [useDefaultLanguages, setUseDefaultLanguages] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastActionType, setLastActionType] = useState(null);
  
  // Execution state
  const [saveStatus, setSaveStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Session and timing
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [startTime] = useState(Date.now());
  
  // Execution state management
  const [executionState, setExecutionState] = useState({
    isRunning: false,
    phase: '',
    progress: 0,
    message: '',
    currentTest: 0,
    totalTests: 0,
    executionTime: 0,
    queuePosition: 0
  });
  
  // Timers
  const [executionTimer, setExecutionTimer] = useState(null);
  const [executionTimeoutTimer, setExecutionTimeoutTimer] = useState(null);
  const debounceTimeoutRef = useRef(null);

  // CRITICAL FIX: Initialize code ONLY when question changes, not on every render
  const initializeEditorCode = useCallback((questionId, language, initialAnswer) => {
    // Prevent re-initialization of same question
    if (currentQuestionIdRef.current === questionId && 
        currentLanguageRef.current === language && 
        initializationRef.current) {
      return;
    }

    console.log(`Initializing editor for question ${questionId} with language ${language}`);
    
    if (initialAnswer && initialAnswer.trim() !== '') {
      console.log('Loading existing code');
      setEditorCode(initialAnswer);
    } else {
      const template = LANGUAGE_TEMPLATES[language.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'] || '';
      console.log('Loading template for', language);
      setEditorCode(template);
    }
    
    // Mark as initialized
    currentQuestionIdRef.current = questionId;
    currentLanguageRef.current = language;
    initializationRef.current = true;
    setIsInitialized(true);
  }, []);

  // CRITICAL FIX: Only reset when question actually changes
  useEffect(() => {
    if (!question?._id) return;
    
    const questionChanged = currentQuestionIdRef.current !== question._id;
    
    if (questionChanged) {
      console.log(`Question changed to ${question._id}, resetting state`);
      
      // Clear debounce timeout for previous question
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Reset initialization tracking
      initializationRef.current = false;
      setIsInitialized(false);
      
      // Reset UI state
      setJudge0Results(null);
      setCustomInput('');
      setLastActionType(null);
      setSaveStatus('idle');
      setSubmitStatus(null);
      
      // Set sample input if available
      if (fullDetails?.sample_test_cases?.[0]?.input) {
        setCustomInput(fullDetails.sample_test_cases[0].input.trim());
      }
    }
  }, [question._id, fullDetails]);

  // CRITICAL FIX: Initialize code only once per question
  useEffect(() => {
    if (!question?._id || !selectedLanguage || isInitialized) return;
    
    console.log('Initializing code for question', question._id);
    initializeEditorCode(question._id, selectedLanguage, answer);
  }, [question._id, selectedLanguage, answer, isInitialized, initializeEditorCode]);

  // STABLE: Code change handler with proper debouncing
  const handleCodeChange = useCallback((value) => {
    if (value === undefined || value === null) return;
    
    // Always update local state immediately for responsive UI
    setEditorCode(value);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounced update to parent (only for current question)
    debounceTimeoutRef.current = setTimeout(() => {
      if (currentQuestionIdRef.current === question._id) {
        onAnswerChange(question._id, value);
      }
    }, 1000); // Increased to 1 second to prevent issues
  }, [question._id, onAnswerChange]);

  // FIXED: Language change handler
  const handleLanguageChange = useCallback((newLanguage) => {
    if (newLanguage === selectedLanguage) return;
    
    console.log(`Changing language from ${selectedLanguage} to ${newLanguage}`);
    
    // If user has written significant code, ask for confirmation
    if (editorCode && editorCode.trim().length > 50) {
      const shouldKeepCode = window.confirm(
        `You have written code in ${selectedLanguage}. Do you want to keep your current code when switching to ${newLanguage}?\n\nClick OK to keep your code, Cancel to load the ${newLanguage} template.`
      );
      
      if (shouldKeepCode) {
        setSelectedLanguage(newLanguage);
        currentLanguageRef.current = newLanguage;
        return;
      }
    }
    
    // Load new language template
    setSelectedLanguage(newLanguage);
    currentLanguageRef.current = newLanguage;
    
    const template = LANGUAGE_TEMPLATES[newLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'] || '';
    setEditorCode(template);
    onAnswerChange(question._id, template);
  }, [selectedLanguage, editorCode, question._id, onAnswerChange]);

  // FIXED: Simple reset handler
  const handleResetCode = useCallback(() => {
    const confirmReset = window.confirm('Are you sure you want to reset your code? This will delete all your current code and load the template.');
    if (!confirmReset) return;
    
    const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'] || '';
    setEditorCode(template);
    onAnswerChange(question._id, template);
    setCustomInput('');
    setJudge0Results(null);
    
    showNotification('success', `Code reset to ${selectedLanguage.toUpperCase()} template`);
  }, [selectedLanguage, question._id, onAnswerChange]);

  // Utility functions
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const hasValidCode = useCallback((code) => {
    return code && code.trim().length > 0;
  }, []);

  const getAvailableLanguages = useCallback(() => {
    if (useDefaultLanguages || !fullDetails?.supported_languages || fullDetails.supported_languages.length <= 1) {
      return DEFAULT_SUPPORTED_LANGUAGES;
    }
    return fullDetails.supported_languages;
  }, [useDefaultLanguages, fullDetails]);

  // Timer management
  const startExecutionTimer = useCallback(() => {
    const timer = setInterval(() => {
      setExecutionState(prev => ({
        ...prev,
        executionTime: prev.executionTime + 0.1
      }));
    }, 100);
    setExecutionTimer(timer);
    return timer;
  }, []);

  const startExecutionTimeout = useCallback(() => {
    if (executionTimeoutTimer) {
      clearTimeout(executionTimeoutTimer);
    }
    
    const timeoutTimer = setTimeout(() => {
      resetExecutionState();
      showNotification('warning', 'Execution timed out after 60 seconds. Please try again.');
    }, 60000);
    setExecutionTimeoutTimer(timeoutTimer);
    return timeoutTimer;
  }, [executionTimeoutTimer]);

  const stopExecutionTimer = useCallback(() => {
    if (executionTimer) {
      clearInterval(executionTimer);
      setExecutionTimer(null);
    }
  }, [executionTimer]);

  const stopExecutionTimeout = useCallback(() => {
    if (executionTimeoutTimer) {
      clearTimeout(executionTimeoutTimer);
      setExecutionTimeoutTimer(null);
    }
  }, [executionTimeoutTimer]);

  const updateExecutionState = useCallback((updates) => {
    setExecutionState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetExecutionState = useCallback(() => {
    stopExecutionTimer();
    stopExecutionTimeout();
    setExecutionState({
      isRunning: false,
      phase: '',
      progress: 0,
      message: '',
      currentTest: 0,
      totalTests: 0,
      executionTime: 0,
      queuePosition: 0
    });
  }, [stopExecutionTimer, stopExecutionTimeout]);

  // Submission state management
  const getSubmissionStateKey = useCallback((questionId, submissionId) => {
    return `submission_state_${submissionId}_${questionId}_${sessionId}`;
  }, [sessionId]);

  const saveSubmissionState = useCallback((questionId, submissionId, isSubmitted) => {
    const key = getSubmissionStateKey(questionId, submissionId);
    const stateData = {
      isSubmitted,
      timestamp: Date.now(),
      questionId,
      submissionId
    };
    localStorage.setItem(key, JSON.stringify(stateData));
  }, [getSubmissionStateKey]);

  const getSubmissionState = useCallback((questionId, submissionId) => {
    const key = getSubmissionStateKey(questionId, submissionId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }, [getSubmissionStateKey]);

  // Language ID mapping
  const getLanguageIdforRunCode = (language) => {
    const languageMap = {
      'python': 71,
      'javascript': 63,
      'java': 62,
      'c': 50,
      'cpp': 54,
      'csharp': 51,
      'php': 68,
      'ruby': 72,
      'go': 60,
      'rust': 73,
      'swift': 83,
      'kotlin': 78,
      'typescript': 74,
    };
    return languageMap[language.toLowerCase()] || 71;
  };

  // API handlers
  const handleRunWithAPI = async () => {
    if (!hasValidCode(editorCode)) {
      showNotification('warning', 'Please write your solution code before running!');
      return;
    }

    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;
    const submissionState = getSubmissionState(question._id, currentSubmissionId);
    if (submissionState && submissionState.isSubmitted) {
      showNotification('error', 'This question has already been submitted and cannot be executed');
      setSubmitStatus('success');
      return;
    }

    try {
      updateExecutionState({
        isRunning: true,
        phase: 'compiling',
        progress: 10,
        message: 'Checking syntax...',
        executionTime: 0,
        queuePosition: Math.floor(Math.random() * 3) + 1 
      });

      startExecutionTimer();
      startExecutionTimeout();

      setTimeout(() => {
        updateExecutionState({
          phase: 'compiling',
          progress: 40,
          message: 'Compiling your code...'
        });
      }, 500);

      setTimeout(() => {
        updateExecutionState({
          phase: 'executing',
          progress: 70,
          message: 'Running your program...'
        });
      }, 1200);

      setLastActionType('runCode');
      const result = await RunCode({
        source_code: editorCode,
        language_id: getLanguageIdforRunCode(selectedLanguage || 'python'),
        stdin: customInput || ''
      });

      updateExecutionState({
        phase: 'completed',
        progress: 100,
        message: 'Execution completed!'
      });

      stopExecutionTimer();
      stopExecutionTimeout();

      setTimeout(() => {
        resetExecutionState();
      }, 1000);

      if (result.status?.description === 'Accepted') {
        result.status.description = 'Compiled';
        showNotification('success', 'Code compiled and executed successfully');
      } else if (result.status?.description === 'Wrong Answer') {
        result.status.description = 'Compiled';
        showNotification('success', 'Code compiled and executed successfully');
      } else {
        showNotification('error', 'Code compilation or execution failed');
      }

      setJudge0Results(result);
    } catch (error) {
      resetExecutionState();
      setJudge0Results({
        status: { description: 'Error' },
        stderr: error.message || 'Failed to execute code. Please check your code and try again.'
      });
      showNotification('error', 'Error executing code');
    }
  };

  const handleRunTestCases = async () => {
    if (!hasValidCode(editorCode)) {
      showNotification('warning', 'Please write your solution code before running test cases!');
      return;
    }

    if (!fullDetails?.sample_test_cases || fullDetails.sample_test_cases.length === 0) {
      showNotification('warning', 'No test cases available for this question');
      return;
    }

    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;
    const currentQuestionId = fullDetails?.question_id || question._id;

    if (!currentSubmissionId || !currentQuestionId) {
      showNotification('error', 'Missing submission or question data');
      return;
    }

    const submissionState = getSubmissionState(question._id, currentSubmissionId);
    if (submissionState && submissionState.isSubmitted) {
      showNotification('error', 'This question has already been submitted and test cases cannot be run');
      setSubmitStatus('success');
      return;
    }

    setIsRunningTests(true);
    setLastActionType('testCases');

    const totalTestCases = fullDetails.sample_test_cases.length;

    updateExecutionState({
      isRunning: true,
      phase: 'testing',
      progress: 5,
      message: 'Preparing test environment...',
      currentTest: 0,
      totalTests: totalTestCases,
      executionTime: 0,
      queuePosition: Math.floor(Math.random() * 2) + 1
    });

    startExecutionTimer();
    startExecutionTimeout();

    try {
      setTimeout(() => {
        updateExecutionState({
          progress: 15,
          message: 'Saving your solution...'
        });
      }, 300);

      const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
      const savePayload = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: editorCode,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false,
        isSkipped: false,
        timeTakenSeconds: timeTakenSeconds,
      };

      await saveCodingAnswer(currentSubmissionId, savePayload);
      
      setTimeout(() => {
        updateExecutionState({
          progress: 30,
          message: 'Compiling your code...'
        });
      }, 600);

      setTimeout(() => {
        updateExecutionState({
          progress: 50,
          message: `Running test case 1 of ${totalTestCases}...`,
          currentTest: 1
        });
      }, 1000);

      const testPayload = {
        code: editorCode, 
        language_id: getLanguageIdforRunCode(selectedLanguage),
      };

      for (let i = 2; i <= totalTestCases; i++) {
        setTimeout(() => {
          updateExecutionState({
            progress: 50 + (i * 30 / totalTestCases),
            message: `Running test case ${i} of ${totalTestCases}...`,
            currentTest: i
          });
        }, 1200 + (i * 400));
      }

      setTimeout(() => {
        updateExecutionState({
          progress: 85,
          message: 'Evaluating results...'
        });
      }, 1200 + (totalTestCases * 400));

      const response = await runSampleTestCases(currentQuestionId, testPayload);

      let testResults = null;
      if (response.sample_results && Array.isArray(response.sample_results)) {
        testResults = response.sample_results;
      } else if (response.results && Array.isArray(response.results)) {
        testResults = response.results;
      } else if (response.data && Array.isArray(response.data)) {
        testResults = response.data;
      } else if (Array.isArray(response)) {
        testResults = response;
      }

      if (testResults && testResults.length > 0) {
        const passedCount = testResults.filter(result =>
          result.status === 'PASSED' || result.status === 'Accepted' || result.passed === true
        ).length;
        const totalCount = testResults.length;

        updateExecutionState({
          progress: 100,
          message: `Tests completed: ${passedCount}/${totalCount} passed`
        });

        stopExecutionTimer();
        stopExecutionTimeout();

        setTimeout(() => {
          resetExecutionState();
        }, 1500);

        const allPassed = passedCount === totalCount;
        const statusDescription = allPassed ? 'Correct' : 'Incorrect';

        setJudge0Results({
          testResults: testResults,
          status: { description: statusDescription },
          message: `Test cases completed: ${passedCount}/${totalCount} passed`
        });

        if (allPassed) {
          showNotification('success', `All test cases passed! (${passedCount}/${totalCount})`);
        } else {
          showNotification('error', `Some test cases failed. (${passedCount}/${totalCount} passed)`);
        }

        setSaveStatus('saved');
        
        if (refreshSectionStatus) {
          refreshSectionStatus();
        }
        
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        resetExecutionState();
        showNotification('error', 'Test cases completed but no valid results received');
      }

    } catch (error) {
      resetExecutionState();
      showNotification('error', 'Failed to save answer before running test cases');
      console.error('Save error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSaveAnswer = async () => {
    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;

    if (!hasValidCode(editorCode)) {
      showNotification('warning', 'Please write your solution code before saving!');
      setSaveStatus('error');
      return;
    }

    if (!currentSubmissionId || !question?._id || !selectedLanguage) {
      setSaveStatus('error');
      showNotification('error', 'Missing required data for saving');
      return;
    }

    const submissionState = getSubmissionState(question._id, currentSubmissionId);
    if (submissionState && submissionState.isSubmitted) {
      setSaveStatus('error');
      showNotification('error', 'This question has already been submitted and cannot be modified');
      setSubmitStatus('success');
      return;
    }

    try {
      setSaveStatus('saving');
      const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);

      const payload = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: editorCode,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false,
        isSkipped: false,
        timeTakenSeconds: timeTakenSeconds,
      };

      const response = await saveCodingAnswer(currentSubmissionId, payload);

      setSaveStatus('saved');
      showNotification('success', 'Answer saved successfully!');
      
      if (refreshSectionStatus) {
        refreshSectionStatus();
      }

      setTimeout(() => setSaveStatus('idle'), 3000);

      return response;
    } catch (error) {
      setSaveStatus('error');

      if (error.response) {
        if (
          error.response.status === 400 &&
          (error.response.data.message.includes("cannot update a coding questions answer") ||
            error.response.data.message.includes("Once it is submitted, it cannot be changed"))
        ) {
          saveSubmissionState(question._id, currentSubmissionId, true);
          setSubmitStatus('success');
          showNotification('error', 'This question has already been submitted and cannot be modified');
        } else {
          showNotification('error', 'Failed to save answer');
        }
      } else {
        showNotification('error', 'Failed to save answer');
      }

      setTimeout(() => setSaveStatus('idle'), 3000);
      throw error;
    }
  };

  const handleSubmitCode = async () => {
    if (!hasValidCode(editorCode)) {
      showNotification('warning', 'Please write your solution code before submitting!');
      return;
    }

    let res;

    updateExecutionState({
      isRunning: true,
      phase: 'submitting',
      progress: 10,
      message: 'Preparing submission...',
      executionTime: 0
    });

    startExecutionTimer();
    startExecutionTimeout();

    try {
      setTimeout(() => {
        updateExecutionState({
          progress: 30,
          message: 'Saving your final solution...'
        });
      }, 400);

      res = await handleSaveAnswer();

      setTimeout(() => {
        updateExecutionState({
          progress: 60,
          message: 'Validating code submission...'
        });
      }, 800);

    } catch {
      resetExecutionState();
      showNotification('error', 'Failed to save answer before submitting');
      return;
    }

    const answerId = res?.data?.answer?._id;

    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;
    const currentQuestionId = fullDetails?.question_id || question._id;

    if (!currentSubmissionId || !currentQuestionId) {
      resetExecutionState();
      showNotification('error', 'Missing submission or question data');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      setTimeout(() => {
        updateExecutionState({
          progress: 80,
          message: 'Submitting to evaluation system...'
        });
      }, 1200);

      const payload = {
        question_id: currentQuestionId,
        code: editorCode,
        language: selectedLanguage,
        language_id: getLanguageIdforRunCode(selectedLanguage),
        answer_id: answerId,
      };

      await evaluateCodingSubmission(currentSubmissionId, payload);

      updateExecutionState({
        progress: 100,
        message: 'Submission completed successfully!'
      });

      stopExecutionTimer();
      stopExecutionTimeout();

      setTimeout(() => {
        resetExecutionState();
      }, 1500);

      setSubmitStatus("success");
      saveSubmissionState(currentQuestionId, currentSubmissionId, true);
      showNotification('success', 'Code submitted successfully!');

    } catch (error) {
      resetExecutionState();
      setSubmitStatus("error");
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit code";
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check submission state on load
  useEffect(() => {
    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;
    const currentQuestionId = question?._id;

    if (currentQuestionId && currentSubmissionId) {
      const submissionState = getSubmissionState(currentQuestionId, currentSubmissionId);
      if (submissionState && submissionState.isSubmitted) {
        setSubmitStatus('success');
        showNotification('info', 'This question has already been submitted');
      }
    }
  }, [question?._id, submissionId, getSubmissionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (executionTimer) clearInterval(executionTimer);
      if (executionTimeoutTimer) clearTimeout(executionTimeoutTimer);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [executionTimer, executionTimeoutTimer]);

  // Helper functions
  const getStatusIcon = (status) => {
    const description = status?.description;

    if (description === 'Compiled' || description === 'Accepted') {
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    } else if (description === 'Correct') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (description === 'Incorrect') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else if (description?.includes('Error') || description?.includes('Failed')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Dynamic Execution Indicator Component
  const ExecutionIndicator = () => {
    if (!executionState.isRunning) return null;

    const getDots = () => {
      const dots = Math.floor(executionState.executionTime * 3) % 4;
      return '.'.repeat(dots);
    };

    const getPhaseIcon = () => {
      switch (executionState.phase) {
        case 'compiling':
          return <Cpu className="w-5 h-5 text-blue-500 animate-pulse" />;
        case 'executing':
          return <Play className="w-5 h-5 text-green-500 animate-spin" />;
        case 'testing':
          return <FlaskConical className="w-5 h-5 text-purple-500 animate-bounce" />;
        case 'submitting':
          return <Upload className="w-5 h-5 text-emerald-500 animate-pulse" />;
        default:
          return <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />;
      }
    };

    const getPhaseColor = () => {
      switch (executionState.phase) {
        case 'compiling':
          return 'from-blue-50 to-blue-100 border-blue-200';
        case 'executing':
          return 'from-green-50 to-green-100 border-green-200';
        case 'testing':
          return 'from-purple-50 to-purple-100 border-purple-200';
        case 'submitting':
          return 'from-emerald-50 to-emerald-100 border-emerald-200';
        default:
          return 'from-indigo-50 to-indigo-100 border-indigo-200';
      }
    };

    return (
      <div className={`fixed top-4 right-4 z-50 min-w-80 bg-gradient-to-r ${getPhaseColor()} border-2 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-right-4`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getPhaseIcon()}
              <span className="font-semibold text-gray-800 capitalize">
                {executionState.phase || 'Processing'}
              </span>
            </div>
            <div className="text-xs text-gray-600 font-mono">
              {executionState.executionTime.toFixed(1)}s
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{executionState.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${executionState.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-sm text-gray-700 mb-2">
            {executionState.message}
            {executionState.phase === 'compiling' && <span className="animate-pulse">{getDots()}</span>}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            {executionState.phase === 'testing' && executionState.totalTests > 0 && (
              <div className="flex items-center gap-1">
                <FlaskConical className="w-3 h-3" />
                <span>Test {executionState.currentTest}/{executionState.totalTests}</span>
              </div>
            )}

            {executionState.queuePosition > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Queue: #{executionState.queuePosition}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              <span>Active</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get available languages
  const availableLanguages = getAvailableLanguages();

  if (!fullDetails) return <div className="text-center py-10">Loading question details...</div>;

  return (
    <div className="space-y-6">
      {/* Dynamic Execution Indicator */}
      <ExecutionIndicator />
      
      {notification && (
        <NotificationMessage
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          <Code2 className="w-6 h-6 text-indigo-500" />
          Code Editor & Execution Environment
        </h2>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Compiler Ready</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-blue-700 font-medium">API Online</span>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-1/2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileCode className="w-4 h-4" />
            Programming Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
          >
            {availableLanguages.length > 0 ? (
              availableLanguages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.language.toUpperCase()} - {
                    lang.name || (
                      lang.language === 'javascript' ? 'JavaScript' :
                        lang.language === 'python' ? 'Python 3' :
                          lang.language === 'java' ? 'Java 11+' :
                            lang.language === 'cpp' ? 'C++ (GCC)' :
                              lang.language === 'c' ? 'C (GCC)' :
                                lang.language === 'csharp' ? 'C# (.NET)' :
                                  lang.language === 'php' ? 'PHP 8+' :
                                    lang.language === 'ruby' ? 'Ruby 3+' :
                                      lang.language === 'go' ? 'Go 1.19+' :
                                        lang.language === 'rust' ? 'Rust 1.60+' :
                                          lang.language === 'swift' ? 'Swift 5+' :
                                            lang.language === 'kotlin' ? 'Kotlin 1.7+' :
                                              lang.language === 'typescript' ? 'TypeScript 4+' :
                                                lang.language.charAt(0).toUpperCase() + lang.language.slice(1)
                    )
                  }
                </option>
              ))
            ) : (
              <option value="javascript">No languages available - using JavaScript</option>
            )}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap md:flex-nowrap items-center mt-6">
          <button
            onClick={handleResetCode}
            className="px-3 py-2 bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 rounded-md text-sm font-medium flex items-center gap-1"
            title="Reset to template and clear custom input"
          >
            <Settings className="w-4 h-4" />
            Reset Code
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveAnswer}
              disabled={saveStatus === 'saving' || submitStatus === 'success'}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all focus:outline-none focus:ring-2 ${saveStatus === 'saving'
                ? 'bg-cyan-400 text-white cursor-not-allowed'
                : submitStatus === 'success'
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : saveStatus === 'saved'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : saveStatus === 'error'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-300 hover:bg-cyan-100'
                }`}
            >
              {submitStatus === 'success' ? (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  Submitted
                </>
              ) : saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <XCircle className="w-4 h-4" />
                  Error Saving
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User-friendly guidance */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Code Editor Guidelines:</p>
            <ul className="space-y-1 text-sm">
              <li>• Save your code before moving to another question</li>
              <li>• Language changes will ask if you want to keep your current code</li>
              <b><li>• If you face code disappearing or resetting issues, click Ctrl + Z and to restore your code and click Save to avoid losing it again.</li></b>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enhanced Monaco Editor Container */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30">
          
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                  <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <span className="text-sm font-mono text-white font-thin">
                      solution.{
                        selectedLanguage === 'javascript' ? 'js' :
                          selectedLanguage === 'python' ? 'py' :
                            selectedLanguage === 'java' ? 'java' :
                              selectedLanguage === 'cpp' ? 'cpp' :
                                selectedLanguage === 'c' ? 'c' :
                                  selectedLanguage === 'csharp' ? 'cs' :
                                    selectedLanguage === 'php' ? 'php' :
                                      selectedLanguage === 'ruby' ? 'rb' :
                                        selectedLanguage === 'go' ? 'go' :
                                          selectedLanguage === 'rust' ? 'rs' :
                                            selectedLanguage === 'swift' ? 'swift' :
                                              selectedLanguage === 'kotlin' ? 'kt' :
                                                selectedLanguage === 'typescript' ? 'ts' : 'txt'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs font-mono">{editorCode ? editorCode.split('\n').length : 0} lines</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-mono">{editorCode ? editorCode.length : 0} chars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monaco Editor with stable state management */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none"></div>
            
            <Editor
              height="480px"
              language={
                selectedLanguage.toLowerCase() === 'cpp' ? 'cpp' :
                  selectedLanguage.toLowerCase() === 'csharp' ? 'csharp' :
                    selectedLanguage.toLowerCase() === 'typescript' ? 'typescript' :
                      selectedLanguage.toLowerCase()
              }
              value={editorCode}
              onChange={handleCodeChange}
              theme="vs-dark"
              key={`editor_${question?._id}_${selectedLanguage}`}
              options={{
                minimap: { 
                  enabled: true,
                  side: 'right',
                  showSlider: 'always',
                  renderCharacters: false,
                  maxColumn: 100,
                  scale: 1
                },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
                fontLigatures: true,
                fontWeight: '400',
                letterSpacing: 0.2,
                lineHeight: 1.5,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                lineNumbersMinChars: 4,
                renderWhitespace: 'boundary',
                tabSize: selectedLanguage === 'python' ? 4 : 2,
                autoIndent: 'full',
                wordWrap: 'on',
                wrappingIndent: 'indent',
                bracketPairColorization: { enabled: false },
                guides: {
                  indentation: true,
                  highlightActiveIndentation: true,
                  bracketPairs: false
                },
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: 'none',
                renderLineHighlightOnlyWhenFocus: false,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  verticalScrollbarSize: 14,
                  horizontalScrollbarSize: 14,
                  verticalSliderSize: 14,
                  horizontalSliderSize: 14,
                  arrowSize: 12
                },
                contextmenu: false,
                selectOnLineNumbers: true,
                roundedSelection: true,
                readOnly: false,
                cursorStyle: 'line',
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
                formatOnPaste: true,
                formatOnType: true,
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoSurround: 'languageDefined',
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                quickSuggestions: true,
                parameterHints: { enabled: true },
                colorDecorators: true,
                codeLens: false,
                links: true,
                mouseWheelZoom: true,
                hover: { enabled: true, delay: 300 },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                  showClasses: true,
                  showFunctions: true,
                  showVariables: true,
                  preview: true
                }
              }}
            />
            
            <div className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2 opacity-80">
              <Code2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-3 border-t border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-purple-300">
                Ready to Execute • Press Run Code
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {submitStatus === "success" ? (
          <div className="w-full flex items-center justify-center mt-4">
            <button
              type="button"
              disabled
              className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              You have already submitted your answer
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-sm text-gray-700 hover:text-indigo-600 font-medium flex items-center gap-1"
            >
              {showCustomInput ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {showCustomInput ? "Hide Custom Input" : "Show Custom Input"}
            </button>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRunWithAPI}
                disabled={executionState.isRunning || submitStatus === 'success'}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm focus:ring-2 focus:ring-blue-500 ${executionState.isRunning && executionState.phase === 'executing'
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : executionState.isRunning && (executionState.phase === 'compiling' || executionState.phase === 'runCode')
                    ? 'bg-blue-500 text-white cursor-not-allowed animate-pulse'
                    : submitStatus === 'success'
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {executionState.isRunning && (executionState.phase === 'compiling' || executionState.phase === 'executing') ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {executionState.phase === 'compiling' ? 'Compiling...' : 'Running...'}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Code
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRunTestCases}
                disabled={executionState.isRunning || submitStatus === 'success'}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm focus:ring-2 focus:ring-purple-500 ${executionState.isRunning && executionState.phase === 'testing'
                  ? 'bg-purple-500 text-white cursor-not-allowed animate-pulse'
                  : submitStatus === 'success'
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
              >
                {executionState.isRunning && executionState.phase === 'testing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-4 h-4" />
                    Run Test Cases
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={executionState.isRunning || submitStatus === 'success'}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm focus:ring-2 focus:ring-emerald-500 ${executionState.isRunning && executionState.phase === 'submitting'
                  ? 'bg-emerald-500 text-white cursor-not-allowed animate-pulse'
                  : submitStatus === 'success'
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
              >
                {executionState.isRunning && executionState.phase === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Custom Input Section */}
      {showCustomInput && (
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-base font-medium text-gray-800">
                <Terminal className="w-5 h-5" />
                Custom Input (stdin)
              </label>
              {fullDetails?.sample_test_cases && fullDetails.sample_test_cases.length > 0 && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Pre-filled with Sample Test Case 1
                </span>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg shadow-sm">
              <div className="relative">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={fullDetails?.sample_test_cases && fullDetails.sample_test_cases.length > 0 
                    ? "Auto-filled with first sample test case input. You can edit this if needed..."
                    : "Enter input for your program (one value per line)...\nExample:\n5\n3\nHello World"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none font-mono"
                  rows={6}
                />
                {fullDetails?.sample_test_cases && fullDetails.sample_test_cases.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomInput(fullDetails.sample_test_cases[0].input)}
                    className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded hover:bg-indigo-200 transition-colors duration-200 font-medium"
                    title="Reset to first sample test case input"
                  >
                    Reset Sample
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 px-2 pb-1 text-xs text-gray-500">
                <div>This input will be passed to your program via stdin</div>
                <div>
                  Characters: {customInput.length} | Lines: {customInput.split("\n").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {judge0Results && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Execution Results
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg border border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <MemoryStick className="w-4 h-4 text-purple-500" />
                <p className="text-sm font-medium text-gray-600">Memory Used</p>
              </div>
              <span className="text-sm text-gray-800 font-mono">
                {judge0Results.memory ? `${judge0Results.memory} KB` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Show output for Run Code without comparison */}
          {lastActionType === 'runCode' && judge0Results && (
              <div className="mt-4 bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Terminal className="w-5 h-5 text-blue-600" />
                  <span>Program Output</span>
                </div>

                <div className="text-sm font-mono space-y-2">
                  <div className="flex items-start gap-2">
                    <Upload className="w-4 h-4 text-indigo-500 mt-1" />
                    <div className="flex-1">
                      <span className="font-semibold">Output:</span>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto border font-mono mt-2">
                        {judge0Results.stdout || judge0Results.stdout === '' ? 
                          (judge0Results.stdout.trim() === '' ? 
                            "No output produced\n\n Your program ran successfully but didn't print anything.\n   Try adding print statements to see output." : 
                            judge0Results.stdout
                          ) : 
                          "No output available"
                        }
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {judge0Results.stderr && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" />
                Error Output
              </p>
              <pre className="bg-red-950 text-red-200 p-4 rounded-lg text-sm overflow-x-auto border font-mono">
                {judge0Results.stderr}
              </pre>
            </div>
          )}

          {judge0Results.compile_output && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                <Cpu className="w-4 h-4 text-yellow-500" />
                Compile Output
              </p>
              <pre className="bg-yellow-950 text-yellow-200 p-4 rounded-lg text-sm overflow-x-auto border font-mono">
                {judge0Results.compile_output}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Test Results Display */}
      {(testResults || judge0Results?.testResults) && (
        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-green-50 to-blue-50">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Sample Test Case Results
          </h3>

          {/* Display sample test results from judge0Results */}
          {judge0Results?.testResults && (
            <div className="mb-4">
              <div className="text-sm text-blue-600 mb-2">Latest Test Run Results:</div>
              <div className="space-y-3">
                {judge0Results.testResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border bg-white ${result.status === 'PASSED' ? 'border-green-200' : 'border-red-200'
                    }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Test Case {index + 1}</span>
                      <span className={`px-2 py-1 rounded text-xs ${result.status === 'PASSED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {result.status || 'COMPLETED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display existing testResults */}
          {testResults && (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 bg-white ${result.status === 'PASSED'
                  ? 'border-green-200'
                  : 'border-red-200'
                  }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg">Test Case {index + 1}</span>
                    <div className="flex items-center gap-2">
                      {result.status === 'PASSED' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.status === 'PASSED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">Input</p>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto border font-mono">
                        {result.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">Your Output</p>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto border font-mono">
                        {result.actual_output}
                      </pre>
                    </div>
                  </div>
                  {result.expected_output && (
                    <div className="mt-3">
                      <p className="text-gray-600 text-sm font-medium mb-2">Expected Output</p>
                      <pre className="bg-blue-900 text-blue-100 p-3 rounded-lg overflow-x-auto border font-mono">
                        {result.expected_output}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SolutionSection;