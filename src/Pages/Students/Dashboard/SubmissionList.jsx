import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MinusCircle, ArrowLeft } from 'lucide-react';
import Header from '../../../Components/Header/Header';
import {
  getSubmissions,
  getSubmissionReport,
  getSectionWiseStatus,
} from '../../../Controllers/SubmissionController';

import {
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  XCircle,
} from 'lucide-react';


const statusStyles = {
  correct: {
    icon: <CheckCircle className="text-green-600 w-6 h-6" />,
    text: 'Correct',
    bg: 'bg-gradient-to-br from-green-100 to-green-50',
    textColor: 'text-green-600',
    border: 'border-green-500',
  },
  incorrect: {
    icon: <XCircle className="text-red-600 w-6 h-6" />,
    text: 'Incorrect',
    bg: 'bg-gradient-to-br from-red-100 to-red-50',
    textColor: 'text-red-600',
    border: 'border-red-500',
  },
  not_answered: {
    icon: <MinusCircle className="text-yellow-600 w-6 h-6" />,
    text: 'Not Answered',
    bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50',
    textColor: 'text-yellow-600',
    border: 'border-yellow-500',
  },
};

const performanceBadge = {
  Excellent: 'bg-green-600',
  Good: 'bg-blue-600',
  Average: 'bg-yellow-500',
  Poor: 'bg-red-600',
};

const ReportAndSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [sectionWiseStatus, setSectionWiseStatus] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions();
        setSubmissions(data.data);
      } catch (error) {
        setError('Error fetching submissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const fetchReportData = async (submissionID) => {
    try {
      setLoading(true);
      const [reportRes, statusRes] = await Promise.all([
        getSubmissionReport(submissionID),
        getSectionWiseStatus(submissionID),
      ]);
      setReportData(reportRes.data);
      setSectionWiseStatus(statusRes);
      setExpandedSections({}); // Reset expanded sections
    } catch (error) {
      setError('Error fetching report or section-wise status.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8 text-gray-800">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">My Submissions</h1>

        {/* Submissions List */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {submissions.map((submission) => (
    <div
      key={submission._id}
      className="p-4 rounded-xl shadow-sm border bg-white space-y-3 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          {submission.assignment_id?.title || 'Assignment Title'}
        </h3>
        <CheckCircle className="w-4 h-4 text-blue-600" />
      </div>

      <p className="text-sm text-gray-700">
        {submission.assignment_id?.description || 'No description available'}
      </p>

      <div className="text-sm flex flex-col gap-1 text-gray-800">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(submission.timing.started_at).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Attempt: {submission.attempt_number}
        </div>

        <div className="flex items-center gap-1 text-green-700">
          <PlayCircle className="w-4 h-4" />
          Started:{' '}
          {new Date(submission.timing.started_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        <div className="flex items-center gap-1 text-red-700">
          <XCircle className="w-4 h-4" />
          Last Activity:{' '}
          {new Date(submission.timing.last_activity_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <button
        onClick={() => fetchReportData(submission._id)}
        className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded text-sm hover:from-blue-700 hover:to-teal-600 transition"
      >
        <CheckCircle className="w-4 h-4" />
        View Report
      </button>
    </div>
  ))}
</div>


        {/* Report View */}
        {reportData && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-blue-700">Test Report</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>

            <div className="mb-8 border rounded-md p-4 flex justify-between items-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div>
                <p className="text-lg"><strong>Total Marks:</strong> {reportData.total_marks}</p>
                <p className="text-lg"><strong>Scored:</strong> {reportData.obtained_marks}</p>
                <p className="text-lg"><strong>Percentage:</strong> {reportData.percentage}%</p>
              </div>
              <span
                className={`px-4 py-2 rounded text-white text-sm font-semibold ${performanceBadge[
                  reportData.obtained_marks >= reportData.total_marks * 0.75
                    ? 'Excellent'
                    : reportData.obtained_marks >= reportData.total_marks * 0.5
                    ? 'Good'
                    : 'Poor'
                ]}`}
              >
                {reportData.obtained_marks >= reportData.total_marks * 0.75
                  ? 'Excellent'
                  : reportData.obtained_marks >= reportData.total_marks * 0.5
                  ? 'Good'
                  : 'Poor'}
              </span>
            </div>

            {/* Section Details */}
            <div className="space-y-6">
              {reportData.section_wise_scores.map((section, index) => {
                const style =
                  section.correct_answers > 0
                    ? statusStyles.correct
                    : section.attempted_questions === 0
                    ? statusStyles.not_answered
                    : statusStyles.incorrect;

                const sectionId = section.section_id;
                const answers = sectionWiseStatus[sectionId] || [];
                const isExpanded = expandedSections[sectionId] || false;

                return (
                  <div key={index} className={`border-l-4 ${style.bg} border ${style.bg} rounded-md p-4`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">{section.section_title}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        {style.icon}
                        <span className={`font-medium ${style.textColor}`}>{style.text}</span>
                      </div>
                    </div>

                    <div className="text-sm mb-2">
                      <strong>Marks Obtained:</strong> {section.obtained_marks}/{section.total_marks}
                    </div>

                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {isExpanded ? 'Hide Section Answers' : 'View Section Answers'}
                    </button>

                    {isExpanded && answers.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {answers.map((ans, i) => {
                          const answerStyle = ans.is_skipped
                            ? statusStyles.not_answered
                            : ans.is_correct
                            ? statusStyles.correct
                            : statusStyles.incorrect;

                          return (
                            <div
                              key={ans.question_id}
                              className={`p-4 border rounded ${answerStyle.bg} ${answerStyle.textColor} text-sm`}
                            >
                              <p><strong>Q{i + 1} ID:</strong> {ans.question_id}</p>
                              {ans.selected_options.length > 0 && (
                                <p><strong>Selected:</strong> {ans.selected_options.join(', ')}</p>
                              )}
                              {ans.text_answer && (
                                <p><strong>Text Answer:</strong> {ans.text_answer}</p>
                              )}
                              {ans.code_solution && (
                                <div>
                                  <strong>Code:</strong>
                                  <pre className="bg-gray-100 p-2 mt-1 whitespace-pre-wrap">
                                    {ans.code_solution}
                                  </pre>
                                </div>
                              )}
                              <p><strong>Status:</strong> {ans.is_skipped ? 'Skipped' : ans.is_correct ? 'Correct' : 'Incorrect'}</p>
                              {ans.is_marked_for_review && (
                                <p className="text-yellow-600">Marked for Review</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAndSubmissions;
