import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  FileText,
  Download,
  Upload,
  AlertCircle,
  Target,
  Tag,
  FlaskConical,
  Timer,
  MemoryStick,
  Info,
  ShieldQuestion,
  Code2,
  ChevronDown,
  ChevronRight,
  Terminal,
  Cpu,
  Clock,
  Award,
  HardDrive,
  Hash
} from 'lucide-react';
import { getCodingQuestionById } from '../../../../Controllers/QuestionController';
import SolutionSection from './SolutionSection';
import ErrorBoundary from '../../../../Components/ErrorBoundary';
import { questionVisited } from '../../../../Controllers/SubmissionController';

const CodingQuestion = ({
  question,
  refreshSectionStatus,
  answerStatus,
  questionIndex,
  layout
}) => {
  const submissionId = localStorage.getItem('submission_id');
  
  // Combined state to reduce re-renders
  const [state, setState] = useState({
    answer: '',
    fullDetails: null,
    selectedLanguage: 'python',
    isLoading: true,
    isInitialized: false,
    error: null
  });
  
  // Refs for tracking
  const currentQuestionIdRef = useRef(null);
  const lastAnswerStatusRef = useRef(null);
  const abortControllerRef = useRef(null);
  const initializationPromiseRef = useRef(null);

  // Memoized handlers
  const handleAnswerChange = useCallback((questionId, newAnswer) => {
    if (questionId === question?._id) {
      setState(prev => ({ ...prev, answer: newAnswer }));
    }
  }, [question?._id]);

  const handleLanguageChange = useCallback((newLanguage) => {
    setState(prev => ({ ...prev, selectedLanguage: newLanguage }));
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    initializationPromiseRef.current = null;
  }, []);

  // Helper to check if answerStatus changed significantly
  const hasAnswerStatusChanged = useCallback((newAnswerStatus) => {
    const oldStatus = lastAnswerStatusRef.current;
    
    if (!oldStatus && !newAnswerStatus) return false;
    if (!oldStatus || !newAnswerStatus) return true;
    
    return (
      oldStatus.code_solution !== newAnswerStatus.code_solution ||
      oldStatus.programming_language !== newAnswerStatus.programming_language
    );
  }, []);

  // Main initialization effect - FIXED
  useEffect(() => {
    if (!question?._id) {
      setState({
        answer: '',
        fullDetails: null,
        selectedLanguage: 'python',
        isLoading: false,
        isInitialized: false,
        error: 'No question provided'
      });
      return;
    }

    // Check if we need to re-initialize
    const questionChanged = currentQuestionIdRef.current !== question._id;
    const answerStatusChanged = hasAnswerStatusChanged(answerStatus);
    
    // Only initialize if question changed OR if it's the first load
    if (!questionChanged && !answerStatusChanged && state.isInitialized) {
      return; // No need to re-initialize
    }

    // Cleanup previous request
    cleanup();

    // Update references
    currentQuestionIdRef.current = question._id;
    lastAnswerStatusRef.current = answerStatus;

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    const initializeQuestion = async (signal) => {
      try {
        console.log(`Initializing question ${question._id}`);
        
        // Set loading state
        setState(prev => ({
          ...prev,
          isLoading: true,
          error: null,
          ...(questionChanged && {
            answer: '',
            fullDetails: null,
            selectedLanguage: 'python',
            isInitialized: false
          })
        }));

        // Load question details (skip if we already have them and question didn't change)
        let details = state.fullDetails;
        if (questionChanged || !details) {
          const res = await getCodingQuestionById(question._id);
          
          // Check if request was aborted or question changed
          if (signal.aborted || currentQuestionIdRef.current !== question._id) {
            return;
          }

          details = res.data?.codingQuestion;
          if (!details) {
            throw new Error('Failed to load question details');
          }
        }

        // Determine initial values
        let initialAnswer = '';
        let initialLanguage = 'python';

        if (answerStatus && answerStatus.code_solution !== undefined) {
          // Load existing answer and language
          initialAnswer = answerStatus.code_solution || '';
          if (answerStatus.programming_language) {
            initialLanguage = answerStatus.programming_language;
          } else if (details.supported_languages?.length) {
            initialLanguage = details.supported_languages[0].language;
          }
        } else {
          // Set default language for new questions
          if (details.supported_languages?.length) {
            initialLanguage = details.supported_languages[0].language;
          }
          
          // Mark as visited for new questions (only if question changed)
          if (questionChanged) {
            try {
              await questionVisited({
                submissionID: submissionId,
                sectionID: question.section_id,
                questionID: question._id,
                type: question.type,
                isMarkedForReview: false,
                isSkipped: true,
              });
            } catch (visitError) {
              console.warn('Failed to mark question as visited:', visitError);
            }
          }
        }

        // Final check before updating state
        if (signal.aborted || currentQuestionIdRef.current !== question._id) {
          return;
        }

        // Update state in a single batch
        setState({
          answer: initialAnswer,
          fullDetails: details,
          selectedLanguage: initialLanguage,
          isLoading: false,
          isInitialized: true,
          error: null
        });

        console.log(`Question ${question._id} initialized successfully`);

      } catch (error) {
        if (!signal.aborted && currentQuestionIdRef.current === question._id) {
          console.error('Failed to initialize question:', error);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error.message || 'Failed to load question'
          }));
        }
      }
    };

    // Store the promise and start initialization
    initializationPromiseRef.current = initializeQuestion(abortControllerRef.current.signal);

    // Cleanup function
    return cleanup;
  }, [question._id, answerStatus, cleanup, hasAnswerStatusChanged, state.fullDetails, state.isInitialized]); // Added back necessary dependencies

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Error state
  if (state.error) {
    return (
      <div className="text-center py-10 text-red-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>Error loading question: {state.error}</p>
      </div>
    );
  }

  // Loading state
  if (!state.fullDetails || state.isLoading || !state.isInitialized) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p>Loading question details...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        className={`grid gap-4 ${layout === 'left-info' ? 'lg:grid-cols-2' : 'lg:grid-cols-5'
          } md:grid-cols-2`}
      >
        {/* Problem Statement Panel */}
        <div className='col-span-2 bg-white border border-gray-200 rounded-xl p-2'>
          <div className="h-[90vh] overflow-y-auto p-3 space-y-6">

            {/* Header Section */}
            <div>
              <h2 className="mb-2 font-semibold text-lg text-gray-800">
                Q{questionIndex + 1}. {question.content.question_text}
              </h2>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Target className="w-3 h-3 mr-1" /> {state.fullDetails.difficulty_level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Hash className="w-3 h-3 mr-1" /> {question.marks} marks
                </span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="border-t border-gray-300 pt-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" />
                Problem Statement
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{state.fullDetails.problem_statement}</p>
                {state.fullDetails.problem_description && <p className="mt-2">{state.fullDetails.problem_description}</p>}
              </div>
              {state.fullDetails.algorithm_tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {state.fullDetails.algorithm_tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tag.replace(/"/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input / Output Section */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-gray-300 pt-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-indigo-500" />
                  Input Format
                </h2>
                <pre className="bg-gray-50 text-gray-700 p-3 text-sm rounded whitespace-pre-wrap">
                  {state.fullDetails.input_format}
                </pre>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-indigo-500" />
                  Output Format
                </h2>
                <pre className="bg-gray-50 text-gray-700 p-3 text-sm rounded whitespace-pre-wrap">
                  {state.fullDetails.output_format}
                </pre>
              </div>
            </div>

            {/* Constraints Section */}
            <div className="border-t border-gray-300 pt-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-500" />
                Constraints
              </h2>
              <pre className="bg-gray-50 text-gray-700 p-3 text-sm rounded whitespace-pre-wrap">
                {state.fullDetails.constraints}
              </pre>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4" /> Time Complexity
                  </h3>
                  <p className="text-sm text-gray-800 font-mono">
                    {state.fullDetails.time_complexity_expected || 'Not specified'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                    <MemoryStick className="w-4 h-4" /> Space Complexity
                  </h3>
                  <p className="text-sm text-gray-800 font-mono">
                    {state.fullDetails.space_complexity_expected || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Test Cases */}
            <div className="border-t border-gray-300 pt-4 space-y-4">
              <div className="flex items-center gap-3 text-gray-800 font-medium">
                <FlaskConical className="w-5 h-5 text-yellow-500" />
                Sample Test Cases
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {state.fullDetails.sample_test_cases?.length || 0} cases
                </span>
              </div>
              {state.fullDetails.sample_test_cases?.map((tc, index) => (
                <div key={index} className="space-y-3 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700">Sample Case {index + 1}</h4>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Input</p>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">{tc.input}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Output</p>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">{tc.output}</pre>
                  </div>
                  {tc.explanation && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Explanation</p>
                      <p className="text-sm text-gray-700">{tc.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solution Section Panel */}
        <div className='col-span-3 '>
          <div >
            <ErrorBoundary>
              <SolutionSection
                question={question}
                answer={state.answer}
                onAnswerChange={handleAnswerChange}
                selectedLanguage={state.selectedLanguage}
                setSelectedLanguage={handleLanguageChange}
                fullDetails={state.fullDetails}
                submissionId={submissionId}
                refreshSectionStatus={refreshSectionStatus}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingQuestion;