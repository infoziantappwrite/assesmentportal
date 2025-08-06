import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Hourglass,
  XCircle,
  PlayCircle,
  AlertTriangle
} from 'lucide-react';
import Header from '../../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import StartTestButton from './StartTestButton';
import { getMyAssignments } from '../../../Controllers/SubmissionController';

const TABS = ['upcoming', 'active', 'completed'];
const visibleTabs = [ 'active','upcoming',];



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

const formatDuration = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs} hr ` : ''}${mins} min`;
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
    const fetchAssignments = async () => {
      try {
        const res = await getMyAssignments();
        const all = res.data || [];

        const formatted = all.map((assignment) => {
          let displayStatus = assignment.status;

          if (assignment.submission_status === 'in_progress') {
            displayStatus = 'active';
          } else if (assignment.submission_status === 'submitted') {
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
  }, []);

  const filteredTests = assignments.filter(
    (test) => test.display_status === activeTab
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">🎯 Test Dashboard</h1>
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
              const durationMin = Math.floor((end - start) / 60000);

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
                      Start: {formatDateTimeIST(start)}
                    </span>
                    <span className="flex items-center gap-1 text-red-700">
                      <XCircle className="w-4 h-4" />
                      End: {formatDateTimeIST(end)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-700">
                      <Clock className="w-4 h-4" />
                      Total Duration: {formatDuration(durationMin)}
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
                    <div className="text-right pt-2">
                      <button
                        onClick={() => setShowWarning(true)}
                        className="w-full mt-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:from-red-600 hover:to-orange-600 transition flex justify-center items-cente"
                      >
                        Test Blocked
                      </button>
                    </div>
                  )}

                  {test.display_status === 'completed' && (
                    <div className="text-right pt-2">
                      <button
                        onClick={() => navigate('/submissions', { state: { test } })}
                        className="text-sm text-purple-600 underline hover:text-purple-800"
                      >
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
