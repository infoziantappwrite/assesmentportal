import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
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
  PencilLine,
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
import {
  saveCodingAnswer,
  runSampleTestCases,
  submitCodeForEvaluation
} from '../../../../Controllers/SubmissionController';

const CodingQuestion = ({
  question,
  answer = '',
  onAnswerChange,
  submissionId,
  onSubmissionComplete
}) => {
  const [fullDetails, setFullDetails] = useState(null);
  const [activeSection, setActiveSection] = useState('problem');
  const [expandedTestCases, setExpandedTestCases] = useState({
    sample: true,
    hidden: false
  });
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [testResults, setTestResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getCodingQuestionById(question._id);
        setFullDetails(res.data?.codingQuestion);
        // Set default language if available
        if (res.data?.codingQuestion?.supported_languages?.length) {
          setSelectedLanguage(res.data.codingQuestion.supported_languages[0].language);
        }
      } catch (error) {
        console.error('Failed to fetch coding question details:', error);
      }
    };

    fetchDetails();
  }, [question._id]);
  const toggleTestCase = (type) => {
    setExpandedTestCases(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };


  const handleSaveAnswer = async () => {
    try {
      setSaveStatus('saving');
      const saveData = {
        sectionId: question.section_id,
        questionId: question._id,
        type: 'coding',
        codeSolution: answer,
        programmingLanguage: selectedLanguage,
        isMarkedForReview: false
      };
      console.log(submissionId);


      console.log('Saving data:', saveData); // Add this line
      await saveCodingAnswer(submissionId, saveData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Failed to save answer:', error);
      console.error('Error details:', error.response?.data); // Add this to see server response
      setSaveStatus('error');
    }
  };

  const handleRunTestCases = async () => {
    if (!answer.trim()) {
      alert('Please write some code before running tests');
      return;
    }

    console.log('Payload sent:', {
      code: answer,
      language_id: getLanguageId(selectedLanguage)
    });


    try {
      setIsRunningTests(true);
      const response = await runSampleTestCases(question._id, {
        code: answer,
        language_id: getLanguageId(selectedLanguage)
      });
      setTestResults(response.sample_results);
    } catch (error) {
      console.error('Failed to run test cases:', error);
      alert(error.message || 'Failed to run test cases');
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!answer.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    if (!window.confirm('Are you sure you want to submit? You cannot change your answer after submission.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitCodeForEvaluation(submissionId, {
        question_id: question._id,
        code: answer,
        language: selectedLanguage,
        language_id: getLanguageId(selectedLanguage),
        answer_id: question.answer_id // This should be passed from parent if exists
      });

      if (onSubmissionComplete) {
        onSubmissionComplete(response);
      }
    } catch (error) {
      console.error('Failed to submit code:', error);
      alert(error.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageId = (language) => {
    // Map language names to Judge0 language IDs
    const languageMap = {
      'python': 71,
      'javascript': 63,
      'java': 62,
      'c': 50,
      'cpp': 54,
      // Add more languages as needed
    };
    return languageMap[language.toLowerCase()] || 71; // Default to Python
  };

  const resetCode = () => {
    if (window.confirm('Are you sure you want to reset your code?')) {
      onAnswerChange(question._id, '');
    }
  };


  const sections = [
    { id: 'problem', title: 'Problem', icon: FileText },
    { id: 'io', title: 'Input/Output', icon: Terminal },
    { id: 'constraints', title: 'Constraints', icon: Cpu },
    { id: 'testcases', title: 'Test Cases', icon: FlaskConical },
    { id: 'solution', title: 'Your Solution', icon: Code2 }
  ];

  if (!fullDetails) return <div className="text-center py-10">Loading question details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{question.content?.question_text}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Target className="w-3 h-3 mr-1" /> {fullDetails.difficulty_level}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <Hash className="w-3 h-3 mr-1" /> {question.marks} marks
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${activeSection === section.id
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <section.icon className="w-4 h-4" />
            {section.title}
          </button>
        ))}
      </div>

      {/* Problem Section */}
      {activeSection === 'problem' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              Problem Statement
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{fullDetails.problem_statement}</p>
              {fullDetails.problem_description && (
                <p className="mt-2">{fullDetails.problem_description}</p>
              )}
            </div>
          </div>

          {fullDetails.algorithm_tags?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {fullDetails.algorithm_tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {tag.replace(/"/g, '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input/Output Section */}
      {activeSection === 'io' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-indigo-500" />
              Input Format
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{fullDetails.input_format}</pre>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-indigo-500" />
              Output Format
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{fullDetails.output_format}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Constraints Section */}
      {activeSection === 'constraints' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              Constraints
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{fullDetails.constraints}</pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4" />
                Time Complexity
              </h3>
              <p className="text-gray-800 font-mono">
                {fullDetails.time_complexity_expected || 'Not specified'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <MemoryStick className="w-4 h-4" />
                Space Complexity
              </h3>
              <p className="text-gray-800 font-mono">
                {fullDetails.space_complexity_expected || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Section */}
      {activeSection === 'testcases' && (
        <div className="space-y-6">
          {/* Sample Test Cases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleTestCase('sample')}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="w-5 h-5 text-yellow-500" />
                <span>Sample Test Cases</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {fullDetails.sample_test_cases?.length || 0} cases
                </span>
              </div>
              {expandedTestCases.sample ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedTestCases.sample && (
              <div className="px-6 pb-6 space-y-4">
                {fullDetails.sample_test_cases?.map((tc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700">Sample Case {index + 1}</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Input</p>
                        <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Output</p>
                        <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {tc.output}
                        </pre>
                      </div>
                      {tc.explanation && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Explanation</p>
                          <p className="text-sm text-gray-700">{tc.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hidden Test Cases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleTestCase('hidden')}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldQuestion className="w-5 h-5 text-red-500" />
                <span>Hidden Test Cases</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {fullDetails.hidden_test_cases?.length || 0} cases
                </span>
              </div>
              {expandedTestCases.hidden ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedTestCases.hidden && (
              <div className="px-6 pb-6 space-y-4">
                {fullDetails.hidden_test_cases?.map((tc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Hidden Case {index + 1}</h4>
                      <span className="text-xs font-mono text-gray-500">ID: {tc.test_case_id}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Input</p>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Expected Output</p>
                          <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                            {tc.expected_output}
                          </pre>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 pt-2">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500">Time Limit</p>
                          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4" /> {tc.time_limit_ms}ms
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500">Memory Limit</p>
                          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-1">
                            <HardDrive className="w-4 h-4" /> {tc.memory_limit_mb}MB
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500">Weightage</p>
                          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-1">
                            <Award className="w-4 h-4" /> {tc.marks_weightage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Solution Section */}
      {activeSection === 'solution' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-500" />
            Your Solution
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {fullDetails.supported_languages?.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.language.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Write your code below:
              </label>
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Terminal className="w-4 h-4" /> Show Starter Code
              </button>
            </div>
            <Editor
              height="400px"
              language={selectedLanguage.toLowerCase()}
              value={answer}
              onChange={(value) => onAnswerChange(question._id, value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                tabSize: 2,
                autoIndent: 'full',
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Test Results Display */}
          {testResults && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-yellow-500" />
                Test Results
              </h3>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded border ${result.status === 'PASSED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Test Case {index + 1}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${result.status === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Input</p>
                        <pre className="bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto">
                          {result.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Output</p>
                        <pre className="bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto">
                          {result.actual_output}
                        </pre>
                      </div>
                    </div>
                    {result.expected_output && (
                      <div className="mt-2">
                        <p className="text-gray-500 text-xs">Expected</p>
                        <pre className="bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto">
                          {result.expected_output}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveAnswer}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 ${saveStatus === 'saving'
                  ? 'bg-cyan-400 text-white cursor-not-allowed'
                  : saveStatus === 'saved'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : saveStatus === 'error'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500'
                }`}
            >
              {saveStatus === 'saving' ? 'Saving...' :
                saveStatus === 'saved' ? 'Saved!' :
                  saveStatus === 'error' ? 'Error Saving' : 'Save Answer'}
            </button>

            <button
              type="button"
              onClick={resetCode}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Reset Code
            </button>

            <button
              type="button"
              onClick={handleRunTestCases}
              disabled={isRunningTests}
              className={`px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isRunningTests ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isRunningTests ? 'Running...' : 'Run Test Cases'}
            </button>

            <button
              type="button"
              onClick={handleSubmitCode}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingQuestion;