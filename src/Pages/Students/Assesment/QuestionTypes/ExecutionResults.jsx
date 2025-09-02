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

export default function ExecutionResults({
  judge0Results,
  testResults,
  lastActionType
}) {
  return (
    <div className="space-y-6 w-full ">
      {/* Execution Results */}
      {judge0Results && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            {/* Execution Results */}
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Execution Results
            </h3>

            {/* Memory */}
            <div className="bg-white flex items-center gap-2">
              <MemoryStick className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Memory Used:</span>
              <span className="text-sm text-gray-800 font-mono">
                {judge0Results.memory ? `${judge0Results.memory} KB` : 'N/A'}
              </span>
            </div>
          </div>


          {/* Program Output */}
          {lastActionType === 'runCode' && (
            <div className="">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                Program Output
              </div>
              <div className="flex items-start gap-2">

                <pre className="flex-1 bg-gray-900 text-gray-100 p-2 rounded-md overflow-x-auto text-sm font-mono">
                  {judge0Results.stdout || judge0Results.stdout === '' ? (
                    judge0Results.stdout.trim() === ''
                      ? "No output produced. Your program ran successfully but didn't print anything.\nTry adding print statements."
                      : judge0Results.stdout
                  ) : "No output available"}
                </pre>
              </div>
            </div>
          )}

          {/* Error Output */}
          {judge0Results.stderr && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-300">
              <div className="flex items-center gap-1 text-sm font-medium text-red-600 mb-1">
                <XCircle className="w-4 h-4" />
                Error Output
              </div>
              <pre className="bg-red-950 text-red-200 p-2 rounded-md text-sm overflow-x-auto font-mono">
                {judge0Results.stderr}
              </pre>
            </div>
          )}

          {/* Compile Output */}
          {judge0Results.compile_output && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
              <div className="flex items-center gap-1 text-sm font-medium text-yellow-700 mb-1">
                <Cpu className="w-4 h-4" />
                Compile Output
              </div>
              <pre className="bg-yellow-950 text-yellow-200 p-2 rounded-md text-sm overflow-x-auto font-mono">
                {judge0Results.compile_output}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Test Case Results */}
      {(testResults || judge0Results?.testResults) && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50 space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
            Sample Test Case Results
          </h3>

          {/* Judge0 Test Results */}
          {judge0Results?.testResults?.map((result, i) => (
            <div key={i} className={`p-2 rounded-lg border bg-white ${result.status === 'PASSED' ? 'border-green-200' : 'border-red-200'}`}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium">Test Case {i + 1}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${result.status === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {result.status || 'COMPLETED'}
                </span>
              </div>
            </div>
          ))}

          {/* Existing Test Results */}
          {testResults?.map((result, i) => (
            <div key={i} className={`p-2 rounded-lg border bg-white ${result.status === 'PASSED' ? 'border-green-200' : 'border-red-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Test Case {i + 1}</span>
                <div className="flex items-center gap-1">
                  {result.status === 'PASSED' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${result.status === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.status}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Input</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded-md overflow-x-auto font-mono">{result.input}</pre>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Your Output</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded-md overflow-x-auto font-mono">{result.actual_output}</pre>
                </div>
              </div>
              {result.expected_output && (
                <div className="mt-1">
                  <p className="text-gray-600 text-xs font-medium mb-1">Expected Output</p>
                  <pre className="bg-blue-900 text-blue-100 p-2 rounded-md overflow-x-auto font-mono">{result.expected_output}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
