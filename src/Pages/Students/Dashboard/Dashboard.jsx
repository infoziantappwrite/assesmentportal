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
import { getAllAssignments } from '../../../Controllers/AssignmentControllers';

const TABS = ['upcoming', 'active', 'completed'];

const statusColors = {
    upcoming: 'from-blue-100 to-blue-50 border-blue-200 text-blue-800',
    active: 'from-green-100 to-green-50 border-green-200 text-green-800',
    completed: 'from-purple-100 to-purple-50 border-purple-200 text-purple-800',
    expired: 'from-red-100 to-red-50 border-red-200 text-red-800',
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
        const getData = async () => {
            try {
                const res = await getAllAssignments();
                console.log(res);
                setAssignments(res.data?.assignments || []);

            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const filteredTests = assignments.filter((test) => test.status === activeTab);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-teal-50">
            <Header />
            <div className="max-w-6xl mx-auto p-8 border-b min-h-screen">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">Your Test Dashboard</h1>

                {/* Tabs */}
                <div className="flex gap-3 border-b mb-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize pb-2 px-4 text-sm font-semibold border-b-2 transition ${
                                activeTab === tab
                                    ? 'border-blue-600 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:text-blue-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Loading or Test Cards */}
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading assignments...</p>
                ) : filteredTests.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTests.map((test) => (
                            <div
                                key={test._id}
                                className={`p-4 rounded-xl shadow-sm border bg-gradient-to-br ${
                                    statusColors[test.status] || ''
                                } space-y-3`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        {test.assessment_id?.title || test.title}
                                    </h3>
                                    {statusIcon[test.status]}
                                </div>
                                <p className="text-sm text-gray-700">
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
                                            {new Date(test.schedule.start_time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    )}

                                    {test.schedule?.end_time && (
                                        <div className="flex items-center gap-1 text-red-700">
                                            <XCircle className="w-4 h-4" />
                                            Ends:{' '}
                                            {new Date(test.schedule.end_time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    )}
                                </div>

                                {test.status === 'active' && <StartTestButton test={test} />}
                                {test.status === 'completed' && (
                                    <button
                                        onClick={() => navigate('/report', { state: { test } })}
                                        className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded text-sm hover:from-purple-600 hover:to-indigo-600 transition"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        View Report
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
