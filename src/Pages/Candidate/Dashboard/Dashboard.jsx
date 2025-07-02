import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    Hourglass,
    XCircle,
    PlayCircle,
} from 'lucide-react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import StartTestButton from './StartTestButton';

const TABS = ['upcoming', 'active', 'completed'];

const testData = [
    {
        _id: '1',
        title: 'React Fundamentals',
        description: 'Covers components, props, and hooks.',
        date: '2025-07-10',
        duration: 60,
        status: 'upcoming',
        startTime: '2025-07-10T10:00:00Z',
        endTime: '2025-07-10T11:00:00Z',
    },
    {
        _id: '2',
        title: 'JavaScript Core',
        description: 'Test your JS ES6+ skills.',
        date: '2025-06-30',
        duration: 90,
        status: 'active',
        startTime: '2025-06-30T08:30:00Z',
        endTime: '2025-06-30T10:00:00Z',
    },
    {
        _id: '3',
        title: 'HTML & CSS Mastery',
        description: 'Final test for frontend certification.',
        date: '2025-06-20',
        duration: 45,
        status: 'completed',
        startTime: '2025-06-20T09:00:00Z',
        endTime: '2025-06-20T09:45:00Z',
    },
    {
        _id: '4',
        title: 'Git & GitHub Basics',
        description: 'Version control system essentials.',
        date: '2025-06-15',
        duration: 30,
        status: 'expired',
        startTime: '2025-06-15T14:00:00Z',
        endTime: '2025-06-15T14:30:00Z',
    },
    {
        _id: '5',
        title: 'Node.js API Testing',
        description: 'Hands-on test for API routes and Express.',
        date: '2025-07-05',
        duration: 50,
        status: 'upcoming',
        startTime: '2025-07-05T12:00:00Z',
        endTime: '2025-07-05T12:50:00Z',
    },
    {
        _id: '6',
        title: 'Docker Deployment',
        description: 'Test your knowledge of containers.',
        date: '2025-06-29',
        duration: 40,
        status: 'active',
        startTime: '2025-06-29T07:00:00Z',
        endTime: '2025-06-29T07:40:00Z',
    },
    {
        _id: '7',
        title: 'MongoDB Operations',
        description: 'Query writing and indexing test.',
        date: '2025-06-18',
        duration: 70,
        status: 'completed',
        startTime: '2025-06-18T13:00:00Z',
        endTime: '2025-06-18T14:10:00Z',
    },
    {
        _id: '8',
        title: 'System Design Basics',
        description: 'High-level architecture understanding.',
        date: '2025-06-10',
        duration: 80,
        status: 'expired',
        startTime: '2025-06-10T15:00:00Z',
        endTime: '2025-06-10T16:20:00Z',
    },
];


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
    const navigate = useNavigate();

    const filteredTests = testData.filter((test) => test.status === activeTab);



    return (
        <div className=' bg-gradient-to-br from-blue-50 to-teal-50'>
            <Header />
            <div className="max-w-6xl mx-auto p-8 border-b min-h-screen ">
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
                {filteredTests.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTests.map((test) => (
                            <div
                                key={test._id}
                                className={`p-4 rounded-xl shadow-sm border bg-gradient-to-br ${statusColors[test.status]} space-y-3`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">{test.title}</h3>
                                    {statusIcon[test.status]}
                                </div>
                                <p className="text-sm text-gray-700">{test.description}</p>

                                <div className="text-sm flex flex-col gap-1 text-gray-800">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(test.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {test.duration} min
                                    </div>

                                    {test.startTime && (
                                        <div className="flex items-center gap-1 text-green-700">
                                            <PlayCircle className="w-4 h-4" />
                                            Starts: {new Date(test.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}

                                    {test.endTime && (
                                        <div className="flex items-center gap-1 text-red-700">
                                            <XCircle className="w-4 h-4" />
                                            Ends: {new Date(test.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
