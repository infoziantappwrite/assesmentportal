import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { calculateResultsForSubmission } from "../../../Controllers/AssignmentControllers";
import Loader from "../../../Components/Loader";
import { FileText, Award, BarChart3, CheckCircle, Clock, User, Target, TrendingUp } from "lucide-react";

const ViewFullSubmission = () => {
  const { submissionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await calculateResultsForSubmission(submissionId);
        if (res.success) {
          setResult(res.data);
        } else {
          setError("Could not fetch submission result.");
        }
      } catch (err) {
        setError("Error fetching result.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [submissionId]);

  if (loading) return <Loader />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md border border-gray-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  const submission = result?.submission;
  const scores = submission?.scores;

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (percentage >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getStatusColor = (status) => {
    if (status === "submitted") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "in_progress") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-left ml-2 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-3">
            Submission Results
          </h2>
          <p className="text-gray-600">Comprehensive analysis of your performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Submission Overview Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Submission Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-800">Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission?.status)}`}>
                    {submission?.status?.charAt(0)?.toUpperCase() + submission?.status?.slice(1)}
                  </span>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-800">Evaluation</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
                    {submission?.evaluation_status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Section-wise Scores */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Section-wise Performance</h3>
              </div>

              <div className="grid gap-4">
                {scores?.section_wise_scores?.map((section, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-gray-800">{section.section_title}</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-blue-600">{section.total_marks}</p>
                        <p className="text-xs text-blue-800">Total Marks</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-emerald-600">{section.obtained_marks}</p>
                        <p className="text-xs text-emerald-800">Obtained</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-purple-600">{section.attempted_questions}</p>
                        <p className="text-xs text-purple-800">Attempted</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <CheckCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-amber-600">{section.correct_answers}</p>
                        <p className="text-xs text-amber-800">Correct</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submitted Answers */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Submitted Answers</h3>
                </div>

                <div className="space-y-6">
                  {Array.isArray(submission?.answers) && submission.answers.map((ans, index) => {
                    const question = ans.question_id;
                    const selectedOptionIds = ans.selected_options || [];
                    const isCorrect = ans.evaluation?.is_correct;
                    const marksObtained = ans.evaluation?.marks_obtained ?? 0;
                    const totalMarks = ans.evaluation?.total_marks ?? question?.marks ?? 0;
                    const isCoding = ans.question_type === "coding";

                    return (
                      <div
                        key={ans._id}
                        className="border rounded-xl p-5 bg-white border-gray-200 shadow-sm"
                      >
                        {/* Question Header */}
                        <div className="mb-2">
                          <h4 className="text-md font-semibold text-indigo-700">
                            Q{index + 1}. {question?.content?.question_text}
                          </h4>
                          <p className="text-xs text-gray-500 italic mb-1">
                            Marks: {marksObtained}/{totalMarks}
                          </p>
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded font-medium ${isCorrect ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
                              }`}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        </div>

                        {/* CODING QUESTION */}
                        {isCoding ? (
                          <div className="space-y-4 mt-3">
                            <div className="text-sm text-gray-600">
                              <strong>Language:</strong> {ans.programming_language?.toUpperCase() || "N/A"}
                            </div>

                            {ans.code_solution ? (
                              <div className="bg-gray-100 border border-gray-300 rounded-md p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap text-gray-800">
                                {ans.code_solution}
                              </div>
                            ) : (
                              <p className="text-sm text-red-500">No code submitted.</p>
                            )}

                            {question?.explanation && (
                              <div className="text-sm text-gray-600">
                                <strong>Explanation:</strong> {question.explanation}
                              </div>
                            )}

                            <div className="text-xs text-gray-500">
                              <p>Time Taken: {ans.timing?.time_taken_seconds || 0}s</p>
                              <p>Attempts: {ans.timing?.attempt_count || 1}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* NON-CODING OPTIONS */}
                            <ul className="space-y-2 mt-3">
                              {question?.options.map((opt) => {
                                const isSelected = selectedOptionIds.includes(opt.option_id);
                                const isCorrectOption = opt.is_correct;

                                let bgColor = "bg-white border-gray-200 text-gray-700";
                                let label = null;

                                if (isCorrectOption && isSelected) {
                                  bgColor = "bg-green-50 border-green-200 text-green-700";
                                  label = "Correct & Selected";
                                } else if (isCorrectOption) {
                                  bgColor = "bg-green-50 border-green-200 text-green-700";
                                  label = "Correct";
                                } else if (isSelected) {
                                  bgColor = "bg-rose-50 border-rose-200 text-rose-700";
                                  label = "Your Answer";
                                }

                                return (
                                  <li
                                    key={opt.option_id}
                                    className={`p-2 rounded border text-sm ${bgColor}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span>{opt.text}</span>
                                      {label && (
                                        <span className="text-xs font-medium">{label}</span>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>

                            {/* Explanation for non-coding */}
                            {question?.explanation && (
                              <div className="mt-4 text-sm text-gray-600">
                                <strong>Explanation:</strong> {question.explanation}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

          </div>

          {/* Score Summary - Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 sticky top-6">
              <div className="text-center mb-5">
                <div className="w-16 h-16 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Overall Score</h3>
              </div>

              <div className="space-y-5">
                <div className="text-center">
                  <div className={`inline-flex items-center px-5 py-3 rounded-xl text-3xl font-bold border ${getPercentageColor(scores?.percentage)}`}>
                    {scores?.percentage?.toFixed(2)}%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Total Questions</span>
                      <span className="text-md font-bold text-yellow-600">{result?.total_questions}</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Answered</span>
                      <span className="text-md font-bold text-indigo-600">{result?.answered_questions}</span>
                    </div>
                  </div>

                  <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Unanswered</span>
                      <span className="text-md font-bold text-rose-600">{result?.unanswered_questions}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Total Marks</span>
                      <span className="text-xl font-bold text-blue-600">{scores?.total_marks}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Obtained</span>
                      <span className="text-xl font-bold text-emerald-600">{scores?.obtained_marks}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${scores?.percentage || 0}%` }}
                  ></div>
                </div>

                <div className="text-center text-xs text-gray-500">
                  Performance Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFullSubmission;