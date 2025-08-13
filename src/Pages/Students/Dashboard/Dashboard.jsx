import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Hourglass,
  XCircle,
  PlayCircle,
  AlertTriangle,
  AlertCircle, FileCheck2
} from 'lucide-react';
import Header from '../../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import StartTestButton from './StartTestButton';
import { getMyAssignments } from '../../../Controllers/SubmissionController';

const TABS = ['upcoming', 'active', 'completed'];
const visibleTabs = ['active', 'upcoming', 'completed'];



const statusColors = {
  upcoming: 'border-blue-200 text-blue-800',
  active: 'border-green-200 text-green-800',
  completed: 'border-purple-200 text-purple-800',
};

const statusIcon = {
  upcoming: <Calendar className="w-4 h-4 text-blue-600" />,
  active: <Hourglass className="w-4 h-4 text-green-600" />,
  completed: <CheckCircle className="w-4 h-4 text-purple-600" />,
};


const formatDateTimeIST = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date)) return 'Invalid Date';

  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Popup Component
const WarningPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-600">Access Blocked</h2>

        {/* Message */}
        <p className="text-gray-700 mt-3">
          You have been blocked from attempting this test.
        </p>

        {/* Additional details */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4 text-left text-sm text-gray-600">
          <p><strong>Possible reasons:</strong></p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Violation of test guidelines.</li>
            <li>Technical issues detected by the system.</li>
            <li>Administrative decision by your staff.</li>
          </ul>
          <p className="mt-3">
            Please contact your respective staff for clarification and further instructions.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};;


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let retryTimeout;

    const fetchAssignments = async (isRetry = false) => {
      try {
        const res = await getMyAssignments();
        const all = res.data || [];
        console.log(all);

        if (!isRetry && (!all || all.length === 0)) {
          // Retry after 1 second if data is empty
          retryTimeout = setTimeout(() => fetchAssignments(true), 1000);
          return;
        }

        const formatted = all.map((assignment) => {
          let displayStatus = assignment.status;

          if (assignment.submission_status === 'in_progress') {
            displayStatus = 'active';
          } else if (assignment.submission_status === 'submitted' || assignment.submission_status === 'auto_submitted') {
            displayStatus = 'completed';
          } else if (assignment.status === 'scheduled') {
            displayStatus = 'upcoming';
          }

          return {
            ...assignment,
            display_status: displayStatus,
          };
        });

        setAssignments(formatted);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();

    return () => clearTimeout(retryTimeout); // Cleanup on unmount
  }, []);

  const filteredTests = assignments.filter(
    (test) => test.display_status === activeTab
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
            <svg width="32px" height="32px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="text-blue-900" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
              <path d="M31.293 41.217a6.69 6.69 0 0 1-2.705.586c-4.42 0-8.016-4.397-8.016-9.801c0-5.405 3.596-9.804 8.016-9.804a6.68 6.68 0 0 1 2.719.593c2.247 1.25 3.956 3.631 4.626 6.521h5.893l-.001-.01c-.029-.211-.047-.425-.082-.633a19.31 19.31 0 0 0-.32-1.52l-.006-.03c-1.768-7.022-7.24-12.157-13.707-12.157c-7.895 0-14.314 7.643-14.314 17.039c0 9.393 6.42 17.035 14.314 17.035c6.467 0 11.938-5.133 13.707-12.152c.006-.021.008-.044.014-.065c.121-.487.229-.981.313-1.485c.037-.214.055-.435.084-.65l.016-.121h-5.885c-.652 2.952-2.379 5.389-4.666 6.654" fill="currentColor"></path>
              <path d="M60.172 33.268c.918.004.918-2.66 0-2.664h-.359L62 19.268l-4.022 2.1l-2.845 9.237h-2.131l2.806-8.104l-4.354 2.272l-2.688 5.832h-2.09l2.726-4.939l1.505-.785C48.256 11.765 38.462 2 26.811 2C13.129 2 2 15.458 2 32s11.129 30 24.811 30c11.685 0 21.502-9.821 24.117-22.994l-1.526-.796l-2.726-4.939h2.09l2.689 5.833l4.353 2.271l-2.807-8.104h2.132l2.845 9.237l4.022 2.1l-2.188-11.338c.12 0 .241 0 .36-.002M38.643 50.28c-3.086 2.79-6.9 4.442-11.023 4.442C17.369 54.723 9.031 44.529 9.031 32c0-12.531 8.338-22.725 18.588-22.725c4.123 0 7.936 1.652 11.023 4.442c3.616 3.429 6.172 8.393 7.038 14.068l-.171.089l-2.092 2.729H31.515c-.391-1.47-1.369-2.516-2.523-2.516c-1.496 0-2.709 1.75-2.709 3.913c0 2.159 1.213 3.911 2.709 3.911c1.188 0 2.185-1.11 2.551-2.644h11.875L45.51 36l.186.097c-.849 5.721-3.413 10.731-7.053 14.183m20.371-17.624l-29.117-.001c-.879.001-.879-1.437 0-1.437h29.654c.881.002.881 1.438 0 1.437l-.537.001" fill="currentColor"></path>
            </svg>
            Test Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-blue-200">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-2 rounded-t-md font-medium text-sm transition 
                ${activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Test Cards */}
        {loading ? (
          <p className="text-gray-500 text-sm">Loading assignments...</p>
        ) : filteredTests.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => {
              const start = new Date(test.schedule?.start_time);
              const end = new Date(test.schedule?.end_time);


              return (
                <div
                  key={test._id}
                  className={`p-4 rounded-xl border-4 shadow-sm bg-white-100 hover:shadow-md transition space-y-3 ${statusColors[test.display_status]
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-md truncate">
                      {test.assessment_id?.title || test.title}
                    </h3>
                    {statusIcon[test.display_status]}
                  </div>

                  <p
                    className="text-sm text-gray-600 truncate mb-2"
                    title={test.assessment_id?.description}
                  >
                    {test.assessment_id?.description || 'No description'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
                    <span className="flex items-center gap-1 text-green-700">
                      <PlayCircle className="w-4 h-4" />
                      Start At : {formatDateTimeIST(start)}
                    </span>
                    <span className="flex items-center gap-1 text-red-700">
                      <XCircle className="w-4 h-4" />
                      Valid Till: {formatDateTimeIST(end)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-700">
                      <Clock className="w-4 h-4" />
                      Assessment Duration:&nbsp;
                      {(() => {
                        const minutes = test.assessment_id?.configuration.total_duration_minutes || 0;
                        const hrs = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        return `${hrs > 0 ? `${hrs} hr${hrs > 1 ? 's' : ''} ` : ''}${mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : ''}`;
                      })()}
                    </span>

                  </div>

                  {/* Buttons based on status */}
                  {test.display_status === 'active' && test.submission_status !== 'blocked' && (
                    <div className="text-right pt-2">
                      <StartTestButton
                        test={test}
                        label={
                          test.submission_status === 'in_progress'
                            ? 'Resume Test'
                            : 'Start Test'
                        }
                      />
                    </div>
                  )}

                  {test.display_status === 'active' && test.submission_status === 'blocked' && (
                    <div className="pt-2">
                      <button
                        onClick={() => setShowWarning(true)}
                        className="w-full mt-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:from-red-600 hover:to-orange-600 transition flex justify-center items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Test Blocked
                      </button>
                    </div>
                  )}


                  {test.display_status === 'completed' && (
                    <div className="pt-2">
                      <button
                        onClick={() => navigate('/submissions', { state: { test } })}
                        disabled
                        className=" w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        View Submission
                      </button>
                    </div>
                  )}


                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No tests in this category.</p>
        )}
      </div>

      {/* Warning Popup */}
      {showWarning && <WarningPopup onClose={() => setShowWarning(false)} />}
    </div>
  );
};

export default Dashboard;
