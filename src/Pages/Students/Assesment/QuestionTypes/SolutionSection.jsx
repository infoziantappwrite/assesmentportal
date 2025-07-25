import React, { useState, useEffect } from 'react';
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
  Download,

} from 'lucide-react';
import { useJudge0 } from '../../../../hooks/useJudge0';
import { saveCodingAnswer, evaluateCodingSubmission, runSampleTestCases } from "../../../../Controllers/SubmissionController"
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
  submissionId
}) => {
  const [judge0Results, setJudge0Results] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [useDefaultLanguages, setUseDefaultLanguages] = useState(false);
  const [autoReloadTemplate, setAutoReloadTemplate] = useState(true);
  const [previousLanguage, setPreviousLanguage] = useState(selectedLanguage);
  const [templateReloadNotification, setTemplateReloadNotification] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // success, error, etc.
  const [isRunningTests, setIsRunningTests] = useState(false); // Fix casing  
  const [lastActionType, setLastActionType] = useState(null); // Track if last action was run code or test cases
  const { isExecuting, executeCode, } = useJudge0();
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'warning', message }
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track unsaved changes
  const [lastSavedCode, setLastSavedCode] = useState(''); // Track last saved code
  const [currentQuestionId, setCurrentQuestionId] = useState(question?._id); // Track current question
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [pendingAction, setPendingAction] = useState(null); // Store pending action details

  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper function to check if code has been modified since last save
  const hasCodeChanged = (code) => {
    if (!hasValidCode(code)) return false; // Template or empty code doesn't count as changes
    return code !== lastSavedCode;
  };

  // Helper function to show unsaved changes warning
  const showUnsavedChangesWarning = (action) => {
    showNotification('warning', `You have unsaved changes! Your code will be lost if you ${action} without saving.`);
  };

  // Helper function to show confirmation modal
  const showConfirmationModal = (actionType, actionData) => {
    setPendingAction({ type: actionType, data: actionData });
    setShowConfirmModal(true);
  };

  // Handle confirmation modal response
  const handleConfirmAction = (confirmed) => {
    setShowConfirmModal(false);
    
    if (confirmed && pendingAction) {
      if (pendingAction.type === 'languageChange') {
        // Proceed with language change
        const newLanguage = pendingAction.data.newLanguage;
        setPreviousLanguage(selectedLanguage);
        setSelectedLanguage(newLanguage);
        
        // Load template for new language
        const template = LANGUAGE_TEMPLATES[newLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
        onAnswerChange(question._id, template);
        
        // Reset tracking when template is loaded
        setLastSavedCode('');
        setHasUnsavedChanges(false);
      } else if (pendingAction.type === 'questionChange') {
        // Proceed with question change - always reset states for different questions
        const newQuestionId = pendingAction.data.newQuestionId;
        
        setCurrentQuestionId(newQuestionId);
        setLastSavedCode('');
        setHasUnsavedChanges(false);
        
        // Always reset all states when changing questions
        setJudge0Results(null); // Clear previous execution results
        setCustomInput(''); // Clear custom input
        setLastActionType(null); // Reset action type
        setSaveStatus('idle'); // Reset save status
        setSubmitStatus(null); // Reset submit status - each question is independent
      }
    } else if (!confirmed && pendingAction?.type === 'questionChange') {
      // User cancelled question change - revert to old question
      // Note: The parent component should handle preventing the question change
      // We just reset our pending action
    }
    
    setPendingAction(null);
  };
  

   const getAvailableLanguages = () => {
       if (useDefaultLanguages || !fullDetails?.supported_languages || fullDetails.supported_languages.length <= 1) {
        return DEFAULT_SUPPORTED_LANGUAGES;
    }
     return fullDetails.supported_languages;
  };

  const availableLanguages = getAvailableLanguages();

  // Track unsaved changes when code changes
  useEffect(() => {
    if (hasValidCode(answer)) {
      const hasChanges = hasCodeChanged(answer);
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [answer, lastSavedCode]);

  // Track question changes
  useEffect(() => {
    const newQuestionId = question?._id;
    if (currentQuestionId && newQuestionId && currentQuestionId !== newQuestionId) {
      // Question has changed
      if (hasUnsavedChanges && hasValidCode(answer)) {
        showConfirmationModal('questionChange', { 
          oldQuestionId: currentQuestionId, 
          newQuestionId: newQuestionId 
        });
        return; // Don't update state until user confirms
      }
      
      // Always reset states for different questions to ensure clean slate
      setCurrentQuestionId(newQuestionId);
      setLastSavedCode(''); // Reset saved code tracking for new question
      setHasUnsavedChanges(false);
      
      // Reset all execution and UI states for new question
      setJudge0Results(null); // Clear previous execution results
      setCustomInput(''); // Clear custom input
      setLastActionType(null); // Reset action type
      setSaveStatus('idle'); // Reset save status
      setSubmitStatus(null); // Reset submit status - each question is independent
      
    } else if (newQuestionId && !currentQuestionId) {
      setCurrentQuestionId(newQuestionId);
    }
  }, [question?._id, hasUnsavedChanges, answer]);

  // Add browser beforeunload warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && hasValidCode(answer)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, answer]);

  useEffect(() => {
    // Check if language has changed
    const languageChanged = previousLanguage !== selectedLanguage;

    if (languageChanged && previousLanguage) {
      // Check for unsaved changes before switching language
      if (hasUnsavedChanges && hasValidCode(answer)) {
        // Show confirmation modal for language change
        showConfirmationModal('languageChange', { 
          oldLanguage: previousLanguage, 
          newLanguage: selectedLanguage 
        });
        return; // Don't proceed until user confirms
      }
      setPreviousLanguage(selectedLanguage);
    }

    // Only load template if no unsaved changes or user confirmed
    if (!answer ||
      answer.trim() === '' ||
      (languageChanged && autoReloadTemplate && !hasUnsavedChanges)) {

      const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
      onAnswerChange(question._id, template);
      
      // Reset tracking when template is loaded
      setLastSavedCode('');
      setHasUnsavedChanges(false);
    }
  }, [selectedLanguage, question._id, onAnswerChange, autoReloadTemplate, previousLanguage, answer, hasUnsavedChanges]);

  // Ensure selected language is valid
  useEffect(() => {
    const isValidLanguage = availableLanguages.some(lang => lang.language === selectedLanguage);
    if (!isValidLanguage && availableLanguages.length > 0) {
      // console.log(`Selected language ${selectedLanguage} not found in available languages, switching to ${availableLanguages[0].language}`);
      setSelectedLanguage(availableLanguages[0].language);
    }
  }, [availableLanguages, selectedLanguage, setSelectedLanguage]);

  // Clear results when question changes (backup cleanup)
  useEffect(() => {
    if (question?._id && currentQuestionId !== question._id) {
      // Always reset execution results and button states for different questions
      setJudge0Results(null);
      setCustomInput('');
      setLastActionType(null);
      setSaveStatus('idle');
      
      // Only preserve submitStatus for submitted questions
      // For new questions, always reset submitStatus to allow interaction
      if (currentQuestionId !== question._id) {
        setSubmitStatus(null); // Reset submit status for new question
      }
    }
  }, [question?._id, currentQuestionId]);

  // Helper function to check if current code is just template code
  const isTemplateCode = (code) => {
    if (!code || code.trim() === '') return true;
    
    const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
    const normalizedCode = code.replace(/\s+/g, ' ').trim();
    const normalizedTemplate = template.replace(/\s+/g, ' ').trim();
    
    return normalizedCode === normalizedTemplate;
  };

  // Helper function to check if code has meaningful content
  const hasValidCode = (code) => {
    if (!code || code.trim() === '') return false;
    if (isTemplateCode(code)) return false;
    
    // Check if code has more than just comments and basic structure
    const lines = code.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed && 
             !trimmed.startsWith('//') && 
             !trimmed.startsWith('#') && 
             !trimmed.startsWith('/*') && 
             !trimmed.startsWith('*') &&
             trimmed !== '{' && 
             trimmed !== '}';
    });
    
    return lines.length > 3; // Require more than basic structure
  };

  // Handle language dropdown change
  const handleLanguageChange = (newLanguage) => {
    // If there are unsaved changes, show confirmation modal
    if (hasUnsavedChanges && hasValidCode(answer)) {
      showConfirmationModal('languageChange', { 
        oldLanguage: selectedLanguage, 
        newLanguage: newLanguage 
      });
    } else {
      // No unsaved changes, proceed with language change
      setSelectedLanguage(newLanguage);
    }
  };
  useEffect(() => {
    if (!useDefaultLanguages && fullDetails?.supported_languages && fullDetails.supported_languages.length === 1) {
      // console.log('Only one language available from question, auto-enabling default languages');
      setUseDefaultLanguages(true);
    }
  }, [fullDetails, useDefaultLanguages]);

  // Reset code to language template
  const handleResetCode = () => {
    const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
    onAnswerChange(question._id, template);
    setCustomInput('');
    setJudge0Results(null);
  };

  // Manually reload template for current language
  const handleReloadTemplate = () => {
    const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
    //console.log(`Manually reloading template for ${selectedLanguage}`);
    onAnswerChange(question._id, template);
    setJudge0Results(null);
    setTemplateReloadNotification(`Template manually reloaded for ${selectedLanguage.toUpperCase()}`);
    setTimeout(() => setTemplateReloadNotification(''), 3000);
  };

  const handleRunWithAPI = async () => {
    // Check if user has written meaningful code
    if (!hasValidCode(answer)) {
      showNotification('warning', 'Please write your solution code before running!');
      return;
    }

    try {
      setLastActionType('runCode'); // Mark this as run code action
      const result = await executeCode(answer, selectedLanguage, customInput);
      
      // For "Run Code" button, always show "Compiled" status if execution was successful
      if (result.status?.description === 'Accepted') {
        result.status.description = 'Compiled';
        showNotification('success', 'Code compiled and executed successfully');
      } else if (result.status?.description === 'Wrong Answer') {
        // Even if Judge0 says "Wrong Answer", for Run Code it should be "Compiled" 
        // because we're not testing against expected output, just running with custom input
        result.status.description = 'Compiled';
        showNotification('success', 'Code compiled and executed successfully');
      } else {
        showNotification('error', 'Code compilation or execution failed');
      }
      
      setJudge0Results(result);
    } catch (error) {
      setJudge0Results({
        status: { description: 'Error' },
        stderr: error.message || 'Failed to execute code. Please check your code and try again.'
      });
      showNotification('error', 'Error executing code');
    }
  };

  const handleRunTestCases = async () => {
    // Check if user has written meaningful code
    if (!hasValidCode(answer)) {
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

    setIsRunningTests(true);
    setLastActionType('testCases'); // Mark this as test cases action
    try {
      // Step 1: Save the answer first
      const savePayload = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: answer,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false,
        isSkipped: false,
        timeTakenSeconds: 0,
      };

      await saveCodingAnswer(currentSubmissionId, savePayload);

      // Update tracking after successful save in test cases
      setLastSavedCode(answer);
      setHasUnsavedChanges(false);

      // Step 2: Get language ID for Judge0
      const getLanguageId = (language) => {
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

      // Step 3: Prepare test cases payload
      const testPayload = {
        code: answer,
        language_id: getLanguageId(selectedLanguage),
      };

      try {
        const response = await runSampleTestCases(currentQuestionId, testPayload);
        
        // Process test results and determine status
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
          
          // Set status based on test results
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
          setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
          showNotification('error', 'Test cases completed but no valid results received');
        }
      } catch (apiError) {
        showNotification('error', 'Failed to run test cases. Please try again.');
        console.error('Test cases API error:', apiError);
      }

    } catch (error) {
      showNotification('error', 'Failed to save answer before running test cases');
      console.error('Save error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };



  const handleSaveAnswer = async () => {
    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;

    // Check if user has written meaningful code
    if (!hasValidCode(answer)) {
      showNotification('warning', 'Please write your solution code before saving!');
      setSaveStatus('error');
      return;
    }

    if (!currentSubmissionId || !question?._id || !selectedLanguage) {
      setSaveStatus('error');
      showNotification('error', 'Missing required data for saving');
      return;
    }

    try {
      setSaveStatus('saving');

      const payload = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: answer,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false,
        isSkipped: false,
        timeTakenSeconds: 0,
      };

      const response = await saveCodingAnswer(currentSubmissionId, payload);

      setSaveStatus('saved');
      showNotification('success', 'Answer saved successfully!');
      
      // Update tracking after successful save
      setLastSavedCode(answer);
      setHasUnsavedChanges(false);
      
      setTimeout(() => setSaveStatus('idle'), 3000);

      return response;
    } catch (error) {
      setSaveStatus('error');

      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data.message.includes("cannot update a coding questions answer")
        ) {
          showNotification('error', 'Coding answers cannot be updated after submission');
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
    // Check if user has written meaningful code
    if (!hasValidCode(answer)) {
      showNotification('warning', 'Please write your solution code before submitting!');
      return;
    }

    let res;

    try {
      res = await handleSaveAnswer();
    } catch (error) {
      showNotification('error', 'Failed to save answer before submitting');
      return;
    }

    const answerId = res?.data?.answer?._id;

    const localSubmissionId = localStorage.getItem("submission_id");
    const currentSubmissionId = submissionId || localSubmissionId;
    const currentQuestionId = fullDetails?.question_id || question._id;

    if (!currentSubmissionId || !currentQuestionId) {
      showNotification('error', 'Missing submission or question data');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      const getLanguageId = (language) => {
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

      const payload = {
        question_id: currentQuestionId,
        code: answer,
        language: selectedLanguage,
        language_id: getLanguageId(selectedLanguage),
        answer_id: answerId,
      };

      await evaluateCodingSubmission(currentSubmissionId, payload);
      setSubmitStatus("success");
      showNotification('success', 'Code submitted successfully!');

    } catch (error) {
      setSubmitStatus("error");
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit code";
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };



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


  const expectedSampleOutput = fullDetails?.sample_test_cases?.[0]?.output?.trim();
  const actualOutput = judge0Results?.stdout?.trim();

  // Only compare with sample test case if the last action was "testCases", not "runCode"
  const isSampleTestPassed = expectedSampleOutput === actualOutput;
  const shouldShowSampleComparison = judge0Results?.stdout && fullDetails?.sample_test_cases?.length > 0;

  return (
    <div className=" space-y-6">
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

        {/* API Status Indicator */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Ready</span>
        </div>
      </div>

      {/* Template Reload Notification */}
      {templateReloadNotification && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">{templateReloadNotification}</span>
        </div>
      )}

      {/* Language Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileCode className="w-4 h-4" />
            Programming Language
          </label>
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            const newLanguage = e.target.value;
            handleLanguageChange(newLanguage);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
        >
          {availableLanguages.length > 0 ? (
            availableLanguages.map((lang) => (
              <option key={lang.language} value={lang.language}>
                {lang.language.toUpperCase()} - {
                  lang.name || (
                    lang.language === 'javascript' ? 'JavaScript (Node.js)' :
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

      {/* Enhanced Code Editor Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-lg font-medium text-gray-800">Code Editor</label>
            <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {selectedLanguage.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReloadTemplate}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
              title="Reload template for current language"
            >
              <Code2 className="w-4 h-4" />
              Reload Template
            </button>
            <button
              onClick={handleResetCode}
              className="px-3 py-1 bg-orange-50 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-100 border border-orange-200 flex items-center gap-1"
              title="Reset to template and clear custom input"
            >
              <Settings className="w-4 h-4" />
              Reset All
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-2 text-sm font-medium text-gray-600">solution.{
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
              }</span>
            </div>
            <div className="text-xs text-gray-500">
              Lines: {answer ? answer.split('\n').length : 0} |
              Chars: {answer ? answer.length : 0}
              {hasUnsavedChanges && (
                <span className="ml-2 text-orange-600 font-medium">● Unsaved</span>
              )}
            </div>
          </div>

          <Editor
            height="600px"
            language={
              selectedLanguage.toLowerCase() === 'cpp' ? 'cpp' :
                selectedLanguage.toLowerCase() === 'csharp' ? 'csharp' :
                  selectedLanguage.toLowerCase() === 'typescript' ? 'typescript' :
                    selectedLanguage.toLowerCase()
            }
            value={answer || LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || ''}
            onChange={(value) => onAnswerChange(question._id, value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              tabSize: selectedLanguage === 'python' ? 4 : 2,
              autoIndent: 'full',
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              contextmenu: true,
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              cursorBlinking: 'blink',
              renderLineHighlight: 'all',
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
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
              codeLens: true,
              links: true,
              mouseWheelZoom: true,
            }}
          />
        </div>
      </div>

      {/* Judge0 Execution Results */}
      {judge0Results && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Execution Results
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg border border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(judge0Results.status)}
                <p className="text-sm font-medium text-gray-600">Status</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                judge0Results.status?.description === 'Compiled' || judge0Results.status?.description === 'Accepted' 
                  ? 'bg-blue-100 text-blue-800'
                  : judge0Results.status?.description === 'Correct'
                    ? 'bg-green-100 text-green-800'
                    : judge0Results.status?.description === 'Incorrect'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                {judge0Results.status?.description || 'Unknown'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-gray-600">Execution Time</p>
              </div>
              <span className="text-sm text-gray-800 font-mono">
                {judge0Results.time ? `${judge0Results.time}s` : 'N/A'}
              </span>
            </div>

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

          {shouldShowSampleComparison && (
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                {isSampleTestPassed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>Sample Test Case Result</span>
              </div>

              <div className="text-sm font-mono space-y-2">
                <div className="flex items-start gap-2">
                  <Download className="w-4 h-4 text-blue-500 mt-1" />
                  <div>
                    <span className="font-semibold">Expected:</span>{" "}
                    {fullDetails.sample_test_cases[0].output}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Upload className="w-4 h-4 text-indigo-500 mt-1" />
                  <div>
                    <span className="font-semibold">Your Output:</span>{" "}
                    {judge0Results.stdout}
                  </div>
                </div>

                <div
                  className={`mt-3 font-semibold flex items-center gap-1 ${isSampleTestPassed ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {isSampleTestPassed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {isSampleTestPassed ? "Passed" : "Failed"}
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

      {/* Custom Input Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-lg font-medium text-gray-800">
            <Terminal className="w-5 h-5" />
            Custom Input (stdin)
          </label>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter input for your program (one value per line)...&#10;Example:&#10;5&#10;3&#10;Hello World"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none shadow-sm font-mono"
              rows={4}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                This input will be passed to your program via stdin
              </div>
              <div className="text-xs text-gray-500">
                Characters: {customInput.length} | Lines: {customInput.split('\n').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-wrap justify-between gap-3">
          {/* Left side buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveAnswer}
              disabled={saveStatus === 'saving' || submitStatus === 'success'}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                saveStatus === 'saving'
                  ? 'bg-cyan-400 text-white cursor-not-allowed'
                  : submitStatus === 'success'
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : saveStatus === 'saved'
                      ? 'bg-green-100 text-green-800 border-2 border-green-200'
                      : saveStatus === 'error'
                        ? 'bg-red-100 text-red-800 border-2 border-red-200'
                        : 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm'
              }`}
            >
                {submitStatus === 'success' ? 'Submitted' :
                  saveStatus === 'saving' ? 'Saving...' :
                    saveStatus === 'saved' ? '✓ Saved!' :
                      saveStatus === 'error' ? '✗ Error Saving' :
                        'Save Answer'}
            </button>




          </div>

          {/* Right side buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRunWithAPI}
              disabled={isExecuting || submitStatus === 'success'}
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm flex items-center gap-2 ${
                isExecuting || submitStatus === 'success' ? 'opacity-70 cursor-not-allowed bg-gray-400' : ''
              }`}
            >
              <Play className="w-4 h-4" />
              {submitStatus === 'success' ? 'Submitted' : 
                isExecuting ? 'Executing...' : 'Run Code'}
            </button>

            <button
              type="button"
              onClick={handleRunTestCases}
              disabled={isRunningTests || submitStatus === 'success'}
              className={`px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm flex items-center gap-2 ${
                isRunningTests || submitStatus === 'success' ? 'opacity-70 cursor-not-allowed bg-gray-400' : ''
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              {submitStatus === 'success' ? 'Submitted' : 
                isRunningTests ? 'Running Tests...' : 'Run Test Cases'}
            </button>


            <button
              type="button"
              onClick={handleSubmitCode}
              disabled={isSubmitting || submitStatus === 'success'}
              className={`px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm flex items-center gap-2 ${
                isSubmitting || submitStatus === 'success' ? 'opacity-70 cursor-not-allowed bg-gray-400' : ''
              }`}
            >
              <Terminal className="w-4 h-4" />
              {submitStatus === 'success' ? 'Submitted' : 
                isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>

          </div>
        </div>
      </div>
      {submitStatus === "success" && (
        <p className="text-green-600 mt-4">Submitted successfully!</p>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Action
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                {pendingAction?.type === 'languageChange' 
                  ? `You have unsaved changes. Changing from ${pendingAction.data.oldLanguage?.toUpperCase()} to ${pendingAction.data.newLanguage?.toUpperCase()} will replace your current code with the template. Do you want to continue?`
                  : 'You have unsaved changes. Switching to a different question will lose your current work. Do you want to continue?'
                }
              </p>
              <p className="text-sm text-orange-600 mt-2 font-medium">
                This action cannot be undone. Consider saving your work first.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => handleConfirmAction(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmAction(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionSection;
