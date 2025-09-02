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
  executionState,
  handleRunTestCases,
  handleSubmitCode,
  fullDetails,
  customInput,
  setCustomInput,
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const customInputRef = useRef(null);

  // Auto-scroll when custom input is shown
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showCustomInput]);

  return (
    <div className="p-2">
      {submitStatus === "success" ? (
        // ✅ Already Submitted State
        <div className="w-full flex items-center justify-center mt-4">
          <button
            type="button"
            disabled
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            You have already submitted your answer
          </button>
        </div>
      ) : (
        <>
          {/* ✅ Controls Row */}
          <div className="flex items-center justify-between">
            {/* Toggle Custom Input */}
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 font-medium"
              title="Show/Hide custom test input"
            >
              <FileText className="w-4 h-4" />
              {showCustomInput ? "Hide Input" : "Custom Input"}
              {showCustomInput ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Run + Submit Buttons */}
            <div className="flex gap-2">
              {/* Run Test Cases */}
              <button
                type="button"
                onClick={handleRunTestCases}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all
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
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-3.5 h-3.5" />
                    Run  Sample Test Cases
                  </>
                )}
              </button>

              {/* Submit Answer */}
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all
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
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ✅ Collapsible Custom Input */}
          {showCustomInput && (
  <div  className="flex flex-col w-full gap-2 mt-2">
    

    {/* Textarea */}
    <textarea
      value={customInput}
      onChange={(e) => setCustomInput(e.target.value)}
      placeholder="Enter input for your program..."
      rows={2}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none font-mono"
    />
  </div>
)}

        </>
      )}
    </div>
  );
}
