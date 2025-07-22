import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Terminal,
  FlaskConical,
  Play,
  Settings,
  ExternalLink,
  Zap,
  Monitor,
  FileCode,
  Cpu,
  Clock,
  MemoryStick,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useJudge0 } from '../../../../hooks/useJudge0';

// Language mapping for Judge0
const JUDGE0_LANGUAGE_MAP = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54,
  'c': 50,
  'csharp': 51,
  'php': 68,
  'ruby': 72,
  'go': 60,
  'rust': 73,
  'swift': 83,
  'kotlin': 78,
  'typescript': 74,
};

const SolutionSection = ({
  question,
  answer,
  onAnswerChange,
  selectedLanguage,
  setSelectedLanguage,
  fullDetails,
  testResults,
  isRunningTests,
  isSubmitting,
  saveStatus,
  handleSaveAnswer,
  resetCode,
  handleRunTestCases,
  handleSubmitCode
}) => {
  const [editorMode, setEditorMode] = useState('judge0'); // 'monaco' or 'judge0'
  const [judge0Results, setJudge0Results] = useState(null);
  const iframeRef = useRef(null);
  const [judge0Initialized, setJudge0Initialized] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
  const { isExecuting, executeCode, executeWithTestCases } = useJudge0();

  const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY || '';

  // Handle Judge0 iframe messages
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;
      
      if (e.data.event === 'initialised') {
        setJudge0Initialized(true);
        console.log('Judge0 iframe initialized');
        // Set initial language only, no code prefilling
        if (iframeRef.current) {
          setTimeout(() => {
            iframeRef.current.contentWindow.postMessage({
              action: 'set',
              api_key: JUDGE0_API_KEY,
              language_id: JUDGE0_LANGUAGE_MAP[selectedLanguage.toLowerCase()] || 71,
              flavor: 'CE',
              stdin: '',
              stdout: '',
              compiler_options: '',
              command_line_arguments: '',
            }, '*');
          }, 500);
        }
      }
      
      if (e.data.event === 'run-completed') {
        setJudge0Results(e.data.data);
      }

      if (e.data.event === 'get-completed') {
        // Update the answer when code is retrieved from Judge0
        if (e.data.data && e.data.data.source_code) {
          onAnswerChange(question._id, e.data.data.source_code);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [answer, selectedLanguage, JUDGE0_API_KEY, customInput, onAnswerChange, question._id]);

  // Update Judge0 IDE when language changes
  useEffect(() => {
    if (judge0Initialized && iframeRef.current && editorMode === 'judge0') {
      iframeRef.current.contentWindow.postMessage({
        action: 'set',
        language_id: JUDGE0_LANGUAGE_MAP[selectedLanguage.toLowerCase()] || 63,
      }, '*');
    }
  }, [selectedLanguage, judge0Initialized, editorMode]);

  const handleRunInJudge0 = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ action: 'run' }, '*');
    }
  };

  const handleGetCodeFromJudge0 = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ action: 'get' }, '*');
    }
  };

  const syncCodeToJudge0 = () => {
    if (iframeRef.current && judge0Initialized) {
      iframeRef.current.contentWindow.postMessage({
        action: 'set',
        source_code: answer,
        language_id: JUDGE0_LANGUAGE_MAP[selectedLanguage.toLowerCase()] || 63,
        stdin: customInput,
      }, '*');
    }
  };

  const handleRunWithAPI = async () => {
    try {
      const result = await executeCode(answer, selectedLanguage, customInput);
      setJudge0Results(result);
    } catch (error) {
      console.error('Error running code with API:', error);
    }
  };

  const handleRunTestCasesWithAPI = async () => {
    if (!fullDetails.test_cases || fullDetails.test_cases.length === 0) {
      alert('No test cases available');
      return;
    }

    try {
      const results = await executeWithTestCases(
        answer, 
        selectedLanguage, 
        fullDetails.test_cases
      );
      // You can update the parent component's test results here
      console.log('Test case results:', results);
    } catch (error) {
      console.error('Error running test cases:', error);
    }
  };

  const getStatusIcon = (status) => {
    if (status?.description === 'Accepted') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (status?.description?.includes('Error') || status?.description?.includes('Failed')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          <Code2 className="w-6 h-6 text-indigo-500" />
          Code Editor & Execution Environment
        </h2>
        
        {/* Editor Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setEditorMode('judge0')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              editorMode === 'judge0'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Monitor className="w-4 h-4 inline mr-1" />
            Live IDE
          </button>
        </div>

      </div>

      {/* Language Selection and Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Programming Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            {fullDetails.supported_languages?.map((lang) => (
              <option key={lang.language} value={lang.language}>
                {lang.language.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
        </div>

        {editorMode === 'monaco' ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <Editor
              height="500px"
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
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                },
                contextmenu: true,
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: true,
              }}
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <iframe
              ref={iframeRef}
              src={`https://ide.judge0.com?judge0.style=minimal&judge0.theme=dark&judge0.styleOptions.showNavigation=false&judge0.styleOptions.showFooter=false`}
              frameBorder="0"
              className="w-full h-[500px]"
              title="Judge0 IDE"
            />
          </div>
        )}
      </div>

      {/* Judge0 Execution Results */}
      {judge0Results && (
        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Execution Results
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(judge0Results.status)}
                <p className="text-sm font-medium text-gray-600">Status</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                judge0Results.status?.description === 'Accepted' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {judge0Results.status?.description || 'Unknown'}
              </span>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-gray-600">Execution Time</p>
              </div>
              <span className="text-sm text-gray-800 font-mono">
                {judge0Results.time ? `${judge0Results.time}s` : 'N/A'}
              </span>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <MemoryStick className="w-4 h-4 text-purple-500" />
                <p className="text-sm font-medium text-gray-600">Memory Used</p>
              </div>
              <span className="text-sm text-gray-800 font-mono">
                {judge0Results.memory ? `${judge0Results.memory} KB` : 'N/A'}
              </span>
            </div>
          </div>
          
          {judge0Results.stdout && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                <Terminal className="w-4 h-4" />
                Output
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border font-mono">
                {judge0Results.stdout}
              </pre>
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
      {testResults && (
        <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-green-50 to-blue-50">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-yellow-500" />
            Test Case Results
          </h3>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 bg-white ${
                result.status === 'PASSED' 
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.status === 'PASSED' 
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
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-wrap justify-between gap-3">
          {/* Left side buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveAnswer}
              disabled={saveStatus === 'saving'}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                saveStatus === 'saving'
                  ? 'bg-cyan-400 text-white cursor-not-allowed'
                  : saveStatus === 'saved'
                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                    : saveStatus === 'error'
                      ? 'bg-red-100 text-red-800 border-2 border-red-200'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' :
                saveStatus === 'saved' ? '✓ Saved!' :
                  saveStatus === 'error' ? '✗ Error Saving' : 'Save Answer'}
            </button>

            <button
              type="button"
              onClick={resetCode}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all shadow-sm"
            >
              Reset Code
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-3">
            {editorMode === 'monaco' && (
              <button
                type="button"
                onClick={handleRunWithAPI}
                disabled={isExecuting}
                className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm flex items-center gap-2 ${
                  isExecuting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executing...' : 'Run Code'}
              </button>
            )}

            {editorMode === 'judge0' && (
              <button
                type="button"
                onClick={handleRunInJudge0}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run in IDE
              </button>
            )}

            <button
              type="button"
              onClick={handleRunTestCases}
              disabled={isRunningTests}
              className={`px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm flex items-center gap-2 ${
                isRunningTests ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              {isRunningTests ? 'Running Tests...' : 'Run Test Cases'}
            </button>

            <button
              type="button"
              onClick={handleSubmitCode}
              disabled={isSubmitting}
              className={`px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm flex items-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Terminal className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSection;
