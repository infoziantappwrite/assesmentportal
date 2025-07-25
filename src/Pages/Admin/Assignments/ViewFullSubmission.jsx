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
    if (status === "completed") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "in_progress") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
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
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-indigo-600 mr-2" />
                    <span className="text-sm font-medium text-indigo-800">Submission ID</span>
                  </div>
                  <p className="font-mono text-sm text-gray-700">
                    {submission?._id}
                  </p>
                </div>
                
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
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {section.section_id}
                      </span>
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Submitted Answers</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {submission?.answers?.map((ansId, i) => (
                  <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center mr-2 font-medium">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 font-mono text-xs truncate">{ansId}</span>
                    </div>
                  </div>
                ))}
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