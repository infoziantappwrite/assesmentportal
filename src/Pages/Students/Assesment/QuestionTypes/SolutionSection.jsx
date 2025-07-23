import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Terminal,
  FlaskConical,
  Play,
  Settings,
  ExternalLink,
  Zap,
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

// Startup code templates for each language
const LANGUAGE_TEMPLATES = {
  'javascript': `// JavaScript Solution
function solution() {
    // Write your code here
    console.log("Hello World!");
}

solution();`,
  'python': `# Python Solution
def solution():
    # Write your code here
    print("Hello World!")

if __name__ == "__main__":
    solution()`,
  'java': `// Java Solution
public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello World!");
    }
}`,
  'cpp': `// C++ Solution
#include <iostream>
using namespace std;

int main() {
    // Write your code here
    cout << "Hello World!" << endl;
    return 0;
}`,
  'c': `// C Solution
#include <stdio.h>

int main() {
    // Write your code here
    printf("Hello World!\\n");
    return 0;
}`,
  'csharp': `// C# Solution
using System;

class Program {
    static void Main() {
        // Write your code here
        Console.WriteLine("Hello World!");
    }
}`,
  'php': `<?php
// PHP Solution
function solution() {
    // Write your code here
    echo "Hello World!\\n";
}

solution();
?>`,
  'ruby': `# Ruby Solution
def solution
    # Write your code here
    puts "Hello World!"
end

solution()`,
  'go': `// Go Solution
package main

import "fmt"

func main() {
    // Write your code here
    fmt.Println("Hello World!")
}`,
  'rust': `// Rust Solution
fn main() {
    // Write your code here
    println!("Hello World!");
}`,
  'swift': `// Swift Solution
import Foundation

func solution() {
    // Write your code here
    print("Hello World!")
}

solution()`,
  'kotlin': `// Kotlin Solution
fun main() {
    // Write your code here
    println("Hello World!")
}`,
  'typescript': `// TypeScript Solution
function solution(): void {
    // Write your code here
    console.log("Hello World!");
}

solution();`
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
  const [judge0Results, setJudge0Results] = useState(null);
  const [customInput, setCustomInput] = useState('');
  
  const { isExecuting, executeCode, executeWithTestCases } = useJudge0();

  const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY || '';

  // Initialize code with language template when language changes
  useEffect(() => {
    if (!answer || answer.trim() === '') {
      const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
      onAnswerChange(question._id, template);
    }
  }, [selectedLanguage, question._id, onAnswerChange]);

  // Reset code to language template
  const handleResetCode = () => {
    const template = LANGUAGE_TEMPLATES[selectedLanguage.toLowerCase()] || LANGUAGE_TEMPLATES['javascript'];
    onAnswerChange(question._id, template);
    setCustomInput('');
    setJudge0Results(null);
  };

  const handleRunWithAPI = async () => {
    if (!answer || answer.trim() === '') {
      alert('Please write some code before running!');
      return;
    }

    try {
      console.log('Executing code with RapidAPI...', {
        language: selectedLanguage,
        codeLength: answer?.length || 0,
        hasCustomInput: !!customInput
      });
      
      const result = await executeCode(answer, selectedLanguage, customInput);
      console.log('API execution result:', result);
      setJudge0Results(result);
    } catch (error) {
      console.error('Error running code with API:', error);
      setJudge0Results({
        status: { description: 'Error' },
        stderr: error.message || 'Failed to execute code. Please check your code and try again.'
      });
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
          Enhanced Code Editor & Execution Environment
        </h2>
        
        {/* API Status Indicator */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">RapidAPI Ready</span>
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileCode className="w-4 h-4" />
          Programming Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
        >
          {fullDetails.supported_languages?.map((lang) => (
            <option key={lang.language} value={lang.language}>
              {lang.language.toUpperCase()} - {
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
              }
            </option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          Language ID: {JUDGE0_LANGUAGE_MAP[selectedLanguage.toLowerCase()] || 'Unknown'}
        </div>
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
              onClick={async () => {
                try {
                  console.log('Testing RapidAPI connection...');
                  const testResult = await executeCode('console.log("✅ RapidAPI Connection Test Successful!");', 'javascript', '');
                  console.log('RapidAPI test successful:', testResult);
                  alert('✅ RapidAPI connection working! Check console for details.');
                } catch (error) {
                  console.error('RapidAPI test failed:', error);
                  alert(`❌ RapidAPI test failed: ${error.message}`);
                }
              }}
              className="px-3 py-1 bg-purple-50 text-purple-600 rounded-md text-sm font-medium hover:bg-purple-100 border border-purple-200 flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              Test API
            </button>
            <button
              onClick={handleResetCode}
              className="px-3 py-1 bg-orange-50 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-100 border border-orange-200 flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Reset to Template
            </button>
            <a
              href="https://judge0.com/#statuses-and-languages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Language Docs
            </a>
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
              onClick={handleResetCode}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all shadow-sm flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Reset to Template
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-3">
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
    </div>
  );
};

export default SolutionSection;
