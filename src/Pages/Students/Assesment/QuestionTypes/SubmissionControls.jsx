import { useState, useRef } from "react";
import {
  CheckCircle,
  FlaskConical,
  Loader2,
  Terminal,
  ChevronDown,
  ChevronRight,
  Play,
} from "lucide-react";

export default function SubmissionControls({
  submitStatus,
  executionState,
  handleRunWithAPI,
  handleRunTestCases,
  handleSubmitCode,
  fullDetails,
  customInput,
  setCustomInput,
  isAnswerSubmitted
}) {
  const [showCustomInput, setShowCustomInput] = useState(true);
  const customInputRef = useRef(null);

  const toggleCustomInput = () => setShowCustomInput(!showCustomInput);

  const onRunTestCases = () => {
    setShowCustomInput(false);
    handleRunTestCases?.();
  };
  //console.log("----------------------------------------------------------1")
  //console.log("isAnswerSubmitted in SubmissionControls:", isAnswerSubmitted);
  //console.log("submitStatus in SubmissionControls:", submitStatus);
  // Unified button style (like sample test case)
  const buttonBaseClass = "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium shadow-sm";
  return (
    <div className="space-y-4 py-4">
      {submitStatus === "success" || isAnswerSubmitted?.isAlreadyExecuted ? (
        <div className="w-full flex items-center justify-center">
          <button
            disabled
            className={`${buttonBaseClass} bg-green-600 text-white cursor-not-allowed`}
          >
            <CheckCircle className="w-4 h-4" />
            Already Submitted
          </button>
        </div>
      ) : (
        <>
          {/* Top Controls Row */}
          <div className="flex items-center justify-between">
            {/* Left Dropdown Toggle */}
            <button
              onClick={toggleCustomInput}
              className={`${buttonBaseClass} bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200`}
            >
              {showCustomInput ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {showCustomInput ? "Hide Custom Input" : "Show Custom Input - Click here to type your input"}
            </button>

            {/* Right Buttons: Run Code / Run Test Cases / Submit */}
            <div className="flex gap-2">
              {/* Run Code */}
              <button
                onClick={handleRunWithAPI}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`${buttonBaseClass} bg-blue-600 text-white ${executionState.isRunning ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {executionState.isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run Code
              </button>

              {/* Run Test Cases */}
              <button
                onClick={onRunTestCases}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`${buttonBaseClass} bg-purple-600 text-white ${executionState.isRunning ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {executionState.isRunning && executionState.phase === "testing" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FlaskConical className="w-4 h-4" />
                )}
                Run Test Cases
              </button>

              {/* Submit */}
              <button
                onClick={handleSubmitCode}
                disabled={executionState.isRunning || submitStatus === "success"}
                className={`${buttonBaseClass} bg-emerald-600 text-white ${executionState.isRunning ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {executionState.isRunning && executionState.phase === "submitting" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Terminal className="w-4 h-4" />
                )}
                Submit
              </button>
            </div>
          </div>

          {/* Custom Input Section */}
          {showCustomInput && (
            <div ref={customInputRef} className="w-full mt-3">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-t-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-800">
                    Custom Input (stdin) - <b>Type your input here...</b>
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {customInput.split("\n").length} lines | {customInput.length} chars
                  </span>
                </div>

                {fullDetails?.sample_test_cases?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomInput(fullDetails.sample_test_cases[0].input)}
                    className="text-xs text-indigo-600 px-2 py-1 rounded"
                    title="Reset to sample test case"
                  >
                    Reset
                  </button>
                )}
              </div>

              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input for your program..."
                rows={1}
                className="w-full border border-gray-200 border-t-0 rounded-b-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-y bg-white min-h-[80px]"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
