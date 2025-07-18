import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    Hourglass,
    XCircle,
    PlayCircle,
    RotateCcw,
} from 'lucide-react';
import Header from '../../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import StartTestButton from './StartTestButton';
import { getMyAssignments } from '../../../Controllers/SubmissionController';

const TABS = ['upcoming', 'active', 'completed'];

const statusColors = {
    upcoming: 'from-blue-100 to-blue-50 border-blue-200 text-blue-800',
    active: 'from-green-100 to-green-50 border-green-200 text-green-800',
    completed: 'from-purple-100 to-purple-50 border-purple-200 text-purple-800',
};

const statusIcon = {
    upcoming: <Calendar className="w-4 h-4 text-blue-600" />,
    active: <Hourglass className="w-4 h-4 text-green-600" />,
    completed: <CheckCircle className="w-4 h-4 text-purple-600" />,
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

                // Convert submission status into display_status for UI
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
            <div className="max-w-6xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">Your Test Dashboard</h1>

                {/* Tabs */}
                <div className="flex gap-3 border-b mb-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize pb-2 px-4 text-sm font-semibold border-b-2 transition ${activeTab === tab
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-blue-600'
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTests.map((test) => (
                            <div
                                key={test._id}
                                className={`p-4 rounded-xl shadow-sm border bg-gradient-to-br ${statusColors[test.display_status] || ''
                                    } space-y-3`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        {test.assessment_id?.title || test.title}
                                    </h3>
                                    {statusIcon[test.display_status]}
                                </div>
                                <p className="text-sm text-gray-700 truncate" title={test.assessment_id?.description}>
                                    {test.assessment_id?.description || 'No description'}
                                </p>


                                <div className="text-sm flex flex-col gap-1 text-gray-800">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(test.schedule?.start_time).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {test.settings?.duration || test.duration || 0} min
                                    </div>

                                    {test.schedule?.start_time && (
                                        <div className="flex items-center gap-1 text-green-700">
                                            <PlayCircle className="w-4 h-4" />
                                            Starts:{' '}
                                            <span>
                                                {new Date(test.schedule.start_time).getUTCHours().toString().padStart(2, '0')}:
                                                {new Date(test.schedule.start_time).getUTCMinutes().toString().padStart(2, '0')} UTC
                                            </span>

                                        </div>
                                    )}

                                    {test.schedule?.end_time && (
                                        <div className="flex items-center gap-1 text-red-700">
                                            <XCircle className="w-4 h-4" />
                                            Ends:{' '}
                                            <span>
                                                {new Date(test.schedule.end_time).getUTCHours().toString().padStart(2, '0')}:
                                                {new Date(test.schedule.end_time).getUTCMinutes().toString().padStart(2, '0')} UTC
                                            </span>

                                        </div>
                                    )}
                                </div>

                                {/* CTA Buttons */}
                                {test.display_status === 'active' && (
                                    <StartTestButton
                                        test={test}
                                        label={
                                            test.submission_status === 'in_progress'
                                                ? 'Resume Test'
                                                : 'Start Test'
                                        }
                                    />
                                )}

                                {test.display_status === 'completed' && (
                                    <button
                                        onClick={() => navigate('/report', { state: { test } })}
                                        className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded text-sm hover:from-purple-600 hover:to-indigo-600 transition"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        View Submissions
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No tests in this category.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
