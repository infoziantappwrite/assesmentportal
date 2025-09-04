import React from "react";
import {
  Target,
  Hash,
  Info,
  Tag,
  Download,
  Upload,
  AlertCircle,
  Timer,
  MemoryStick,
  FlaskConical,
} from "lucide-react";

const QuestionPanel = ({ question, questionIndex, fullDetails }) => {
  return (
    <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-2">
      <div className="h-[90vh] overflow-y-auto p-3 space-y-4">
        {/* Header Section */}
        <div>
          <h2 className="mb-2 font-semibold text-base text-gray-800">
            Q{questionIndex + 1}. {question.content.question_text}
          </h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
              <Target className="w-3 h-3 mr-1" /> {fullDetails.difficulty_level}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-800">
              <Hash className="w-3 h-3 mr-1" /> {question.marks} marks
            </span>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="border-t border-gray-300 pt-3 space-y-3">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Problem Statement
          </h2>
          <div className="prose prose-xs max-w-none text-gray-700">
            <p className="text-sm">{fullDetails.problem_statement}</p>
            {fullDetails.problem_description && (
              <p className="mt-1 text-sm">{fullDetails.problem_description}</p>
            )}
          </div>
          {fullDetails.algorithm_tags?.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                <Tag className="w-3 h-3 text-gray-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {fullDetails.algorithm_tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800"
                  >
                    {tag.replace(/"/g, "")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input / Output Section */}
        <div className="grid md:grid-cols-2 gap-4 border-t border-gray-300 pt-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-1">
              <Download className="w-4 h-4 text-indigo-500" />
              Input Format
            </h2>
            <pre className="bg-gray-50 text-gray-700 p-2 text-xs rounded whitespace-pre-wrap overflow-x-auto">
              {fullDetails.input_format}
            </pre>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-indigo-500" />
              Output Format
            </h2>
            <pre className="bg-gray-50 text-gray-700 p-2 text-xs rounded whitespace-pre-wrap overflow-x-auto">
              {fullDetails.output_format}
            </pre>
          </div>
        </div>

        {/* Constraints Section */}
        <div className="border-t border-gray-300 pt-3 space-y-3">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
            Constraints
          </h2>
          <pre className="bg-gray-50 text-gray-700 p-2 text-xs rounded whitespace-pre-wrap overflow-x-auto">
            {fullDetails.constraints}
          </pre>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-2 rounded">
              <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                <Timer className="w-3 h-3" /> Time Complexity
              </h3>
              <p className="text-xs text-gray-800 font-mono">
                {fullDetails.time_complexity_expected || <em>Not specified</em>}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <h3 className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                <MemoryStick className="w-3 h-3" /> Space Complexity
              </h3>
              <p className="text-xs text-gray-800 font-mono">
                {fullDetails.space_complexity_expected || <em>Not specified</em>}
              </p>
            </div>
          </div>
        </div>

        {/* Sample Test Cases */}
        <div className="border-t border-gray-300 pt-3 space-y-3">
          <div className="flex items-center gap-2 text-gray-800 font-medium text-sm">
            <FlaskConical className="w-4 h-4 text-yellow-500" />
            Sample Test Cases
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
              {fullDetails.sample_test_cases?.length || 0} cases
            </span>
          </div>
          {fullDetails.sample_test_cases?.map((tc, index) => (
            <div
              key={index}
              className="space-y-2 border border-gray-200 rounded-lg p-3"
            >
              <h4 className="font-medium text-gray-700 text-sm">
                Sample Case {index + 1}
              </h4>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5">
                  Input
                </p>
                <pre className="bg-gray-800 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {tc.input}
                </pre>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5">
                  Output
                </p>
                <pre className="bg-gray-800 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {tc.output}
                </pre>
              </div>
              {tc.explanation && (
                <div>
                  <p className="text-[11px] font-medium text-gray-500 mb-0.5">
                    Explanation
                  </p>
                  <p className="text-xs text-gray-700">{tc.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
