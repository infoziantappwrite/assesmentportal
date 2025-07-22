import React from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Terminal,
  FlaskConical,
} from 'lucide-react';

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
  return (
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
  );
};

export default SolutionSection;