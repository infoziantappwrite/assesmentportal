import { Play, RotateCcw, Save, Loader2, CheckCircle, XCircle, FileCheck2, FileCode } from "lucide-react";

function CodeEditorHeader({
  selectedLanguage,
  handleLanguageChange,
  availableLanguages,
  handleRunWithAPI,
  handleResetCode,
  handleSaveAnswer,
  executionState,
  saveStatus,
  submitStatus,
  editorCode,
}) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-2">
      <div className="flex items-center justify-between">

        {/* Left side: Language Selector */}
        <div className="flex items-center gap-4">
          {/* Mac-style circles */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>

          {/* Language Dropdown */}
          <div className="w-48">
            
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full border border-gray-600 rounded-md px-2 py-1.5 text-xs bg-slate-800 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableLanguages.length > 0 ? (
                availableLanguages.map((lang) => (
                  <option key={lang.language} value={lang.language}>
                    {lang.language.toUpperCase()} - {
                      lang.name || (
                        lang.language === "javascript" ? "JavaScript" :
                        lang.language === "python" ? "Python 3" :
                        lang.language === "java" ? "Java 11+" :
                        lang.language === "cpp" ? "C++ (GCC)" :
                        lang.language === "c" ? "C (GCC)" :
                        lang.language === "csharp" ? "C# (.NET)" :
                        lang.language === "php" ? "PHP 8+" :
                        lang.language === "ruby" ? "Ruby 3+" :
                        lang.language === "go" ? "Go 1.19+" :
                        lang.language === "rust" ? "Rust 1.60+" :
                        lang.language === "swift" ? "Swift 5+" :
                        lang.language === "kotlin" ? "Kotlin 1.7+" :
                        lang.language === "typescript" ? "TypeScript 4+" :
                        lang.language.charAt(0).toUpperCase() + lang.language.slice(1)
                      )
                    }
                  </option>
                ))
              ) : (
                <option value="javascript">No languages available - using JavaScript</option>
              )}
            </select>
          </div>
        </div>

        {/* Right side: Run / Reset / Save + Stats */}
        <div className="flex items-center gap-4">
  {/* Stats */}
  <div className="flex items-center gap-3 text-white/80 text-xs font-mono">
    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md">
      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
      <span>{editorCode ? editorCode.split("\n").length : 0} lines</span>
    </div>
    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md">
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      <span>{editorCode ? editorCode.length : 0} chars</span>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex gap-1 z-10">
    {/* Run */}
    <button
      onClick={handleRunWithAPI}
      disabled={executionState.isRunning || submitStatus === "success"}
      className={`relative group p-1 rounded-md border flex items-center justify-center
        ${executionState.isRunning
          ? "bg-blue-500 text-white border-blue-600 animate-pulse"
          : submitStatus === "success"
          ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
          : "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"}
      `}
    >
      {executionState.isRunning ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      {/* Tooltip - white theme, below */}
      <span className="absolute z-50 top-full mt-1 hidden group-hover:block text-xs bg-white text-gray-800 border border-gray-200 px-2 py-1 rounded shadow">
        {executionState.isRunning ? "Running..." : "Run Code"}
      </span>
    </button>

    {/* Reset */}
    <button
      onClick={handleResetCode}
      className="relative group z-50 p-1 rounded-md flex items-center justify-center bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100"
    >
      <RotateCcw className="w-4 h-4" />
      <span className="absolute top-full mt-1 hidden group-hover:block text-xs bg-white text-gray-800 border border-gray-200 px-2 py-1 rounded shadow">
        Reset Code
      </span>
    </button>

    {/* Save */}
    <button
      onClick={handleSaveAnswer}
      disabled={saveStatus === "saving" || submitStatus === "success"}
      className={`relative group z-50 p-1 rounded-md border flex items-center justify-center
        ${submitStatus === "success"
          ? "bg-gray-300 text-gray-600 border-gray-400"
          : saveStatus === "saving"
          ? "bg-cyan-400 text-white border-cyan-500"
          : saveStatus === "saved"
          ? "bg-green-100 text-green-700 border-green-300"
          : saveStatus === "error"
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100"}
      `}
    >
      {submitStatus === "success" ? (
        <FileCheck2 className="w-4 h-4" />
      ) : saveStatus === "saving" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saveStatus === "saved" ? (
        <CheckCircle className="w-4 h-4" />
      ) : saveStatus === "error" ? (
        <XCircle className="w-4 h-4" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      <span className="absolute top-full mt-1 hidden group-hover:block text-xs bg-white text-gray-800 border border-gray-200 px-2 py-1 rounded shadow">
        {submitStatus === "success"
          ? "Submitted"
          : saveStatus === "saving"
          ? "Saving..."
          : saveStatus === "saved"
          ? "Saved!"
          : saveStatus === "error"
          ? "Error Saving"
          : "Save"}
      </span>
    </button>
  </div>
</div>

      </div>
    </div>
  );
}

export default CodeEditorHeader;
