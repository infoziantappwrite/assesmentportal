import React from "react";
import {
  Zap,
  MemoryStick,
  Terminal,
  Upload,
  XCircle,
  Cpu,
  CheckCircle,
} from "lucide-react";

export default function ExecutionResults({ judge0Results, testResults, submitStatus, isAnswerSubmitted }) {
  // ✅ Provide fallback data (for testing)
  const results = judge0Results || {
    stdout: "",
    stderr: null,
    compile_output: null,
    message: null,
  };

  return (
    <div className="space-y-6 w-full ">
      {/* Execution Results */}
      {results && !results?.testResults && submitStatus !== "success" && isAnswerSubmitted?.isAlreadyExecuted !== true && (
        <div className="space-y-4">
          {/* <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Execution Results
          </h3> */}

          {/* Program Output */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              Program Output
            </div>
            <div className="flex items-start gap-2">
            
              <pre className="flex-1 bg-gray-900 text-gray-100 p-2 rounded-md overflow-x-auto text-sm font-mono">
                {results.stdout !== null && results.stdout !== undefined
                  ? results.stdout || "Click run to execute your code"
                  : "Click run to execute your code"}
              </pre>
            </div>
          </div>

          {/* Error Output */}
          {results.stderr && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-300">
              <div className="flex items-center gap-1 text-sm font-medium text-red-600 mb-1">
                <XCircle className="w-4 h-4" />
                Error Output
              </div>
              <pre className="bg-red-950 text-red-200 p-2 rounded-md text-sm overflow-x-auto font-mono">
                {results.stderr}
              </pre>
            </div>
          )}

          {/* Compile Output */}
          {results.compile_output && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
              <div className="flex items-center gap-1 text-sm font-medium text-yellow-700 mb-1">
                <Cpu className="w-4 h-4" />
                Compile Output
              </div>
              <pre className="bg-yellow-950 text-yellow-200 p-2 rounded-md text-sm overflow-x-auto font-mono">
                {results.compile_output}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Test Case Results */}
      {(testResults || results?.testResults) && submitStatus !== "success" &&(
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            Sample Test Case Results
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Judge0 Test Results */}
            {results?.testResults?.map((result, i) => (
              <TestCaseCard key={`judge0-${i}`} result={result} index={i} />
            ))}

            {/* External Test Results */}
            {testResults?.map((result, i) => (
              <TestCaseCard key={`test-${i}`} result={result} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TestCaseCard({ result, index }) {
  return (
    <div
      className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
        result.status === "PASSED"
          ? "border-green-300 bg-green-50"
          : "border-red-300 bg-red-50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">Test {index + 1}</span>
        <div className="flex items-center gap-1">
          {result.status === "PASSED" ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              result.status === "PASSED"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {result.status || "COMPLETED"}
          </span>
        </div>
      </div>

      {result.input && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-600 mb-1">Input:</p>
          <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800 max-h-16 overflow-y-auto">
            {result.input}
          </div>
        </div>
      )}

      {result.expected_output && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-600 mb-1">Expected:</p>
          <div className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-800 max-h-16 overflow-y-auto">
            {result.expected_output}
          </div>
        </div>
      )}

      {result.actual_output && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Your Output:</p>
          <div
            className={`px-2 py-1 rounded text-xs font-mono max-h-16 overflow-y-auto ${
              result.status === "PASSED"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {result.actual_output}
          </div>
        </div>
      )}
    </div>
  );
}
