import { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Loader2,
  Terminal,
  FileText,
} from "lucide-react";

export default function SubmissionControls({
  submitStatus,
  answerSubmit,
  executionState,
  handleRunTestCases,
  handleSubmitCode,
  fullDetails,
  customInput,
  setCustomInput,
}) {
  const customInputRef = useRef(null);

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {submitStatus === "success"  ? (
        // ✅ Already Submitted State
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            disabled
            className="px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            You have already submitted your answer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Row */}
          <div className="flex items-center justify-end">
            {/* Run + Submit Buttons */}
            <div className="flex gap-3">
              {/* Run Test Cases */}
              <button
                type="button"
                onClick={handleRunTestCases}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all
                  ${
                    executionState.isRunning && executionState.phase === "testing"
                      ? "bg-purple-500 text-white cursor-not-allowed animate-pulse"
                      : submitStatus === "success"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
              >
                {executionState.isRunning && executionState.phase === "testing" ? (
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

              {/* Submit Answer */}
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all
                  ${
                    executionState.isRunning && executionState.phase === "submitting"
                      ? "bg-emerald-500 text-white cursor-not-allowed animate-pulse"
                      : submitStatus === "success"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
              >
                {executionState.isRunning && executionState.phase === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Custom Input Section */}
          <div ref={customInputRef} className="w-full">
              {/* Header */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-t-lg">
                <div className="flex items-center gap-4">
                  {/* Label */}
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    Custom Input (stdin)
                  </label>

                  {/* Inline info */}
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {customInput.split("\n").length} lines | {customInput.length} chars
                  </span>
                </div>

                {/* Reset button */}
                {fullDetails?.sample_test_cases?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomInput(fullDetails.sample_test_cases[0].input)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                    title="Reset to sample test case"
                  >
                    Reset to Sample
                  </button>
                )}
              </div>

              {/* Textarea */}
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input for your program..."
                rows={1}
                className="w-full border border-gray-200 border-t-0 rounded-b-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono resize-y bg-white min-h-[80px]"
              />
            </div>
        </div>
      )}
    </div>
  );
}