import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Hourglass,
  XCircle,
  PlayCircle,
} from 'lucide-react';
import Header from '../../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import StartTestButton from './StartTestButton';
import { getMyAssignments } from '../../../Controllers/SubmissionController';

const TABS = ['upcoming', 'active', 'completed'];
const visibleTabs = ['upcoming', 'active'];

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
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
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTests.map((test) => {
              const start = new Date(test.schedule?.start_time);
              const end = new Date(test.schedule?.end_time);
              const durationMin = Math.floor((end - start) / 60000);

              return (
                <div
                  key={test._id}
                  className={`p-4 rounded-lg border shadow-sm bg-green-100 hover:shadow-md transition space-y-3 ${statusColors[test.display_status]
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-md truncate">
                      {test.assessment_id?.title || test.title}
                    </h3>
                    {statusIcon[test.display_status]}
                  </div>

                  <p className="text-sm text-gray-600 truncate" title={test.assessment_id?.description}>
                    {test.assessment_id?.description || 'No description'}
                  </p>

                  <div className="flex justify-between text-sm text-gray-800">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {start.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(durationMin)}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1 text-green-700">
                      <PlayCircle className="w-4 h-4" />
                      {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1 text-red-700">
                      <XCircle className="w-4 h-4" />
                      {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {test.display_status === 'active' && (
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
    </div>
  );
};

export default Dashboard;
