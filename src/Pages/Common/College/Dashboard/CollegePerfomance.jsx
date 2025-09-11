import React, { useEffect, useState } from "react";
import { getCollegePerformanceAnalytics, getDashboardData } from "../../../../Controllers/AnalyticsController";
import { useUser } from "../../../../context/UserContext";
import OverAlldata from "./OverAlldata";
import Loader from "../../../../Components/Loader";
import {
    Users,
    FileText,
    BarChart3,
    Building2,
    GraduationCap,
    LayoutDashboard,
    Filter,
    Check,
    X,
    Trash,
    ClipboardList,
    CheckCircle,
    Clock,
} from "lucide-react";

const CollegePerformance = () => {
    const { user } = useUser();
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        fromDate: undefined,
        toDate: undefined,
        departmentId: undefined,
        batchYear: undefined,
    });
    const [showFilter, setShowFilter] = useState(false);

    const fetchPerformance = async (appliedFilters = filters) => {
        const collegeId = user?.assigned_colleges?.[0]?._id;
        if (!collegeId) return;

        setLoading(true);
        try {
            const res = await getCollegePerformanceAnalytics(collegeId, appliedFilters);
            setPerformanceData(res?.data);
        } catch (err) {
            console.error("❌ Error fetching college performance:", err);
            setPerformanceData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, [user?.assigned_colleges,]);


    const [dashboardData, setDashboardData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboardData();
                setDashboardData(res.data);
            } catch (error) {
                console.error('❌ Error fetching dashboard data:', error);
            }
        };
        fetchData();
    }, [user?.assigned_colleges,]);

    const handleClearFilters = () => {
        const clearedFilters = {
            fromDate: undefined,
            toDate: undefined,
            departmentId: undefined,
            batchYear: undefined,
        };
        setFilters(clearedFilters);
        fetchPerformance(clearedFilters);
    };

    const { overallStats, departmentWise, groupWise } = performanceData || {};

    return (
        <div>
            {/* Welcome Header */}
            {/* Stats Section */}
            {loading ? (
                <Loader />
            ) : !performanceData ? (
                <div className="flex justify-center items-center h-60">
                    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 flex flex-col items-center text-center">

                        <h3 className="text-lg font-semibold text-gray-800">No Data Available</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            We couldn’t fetch the performance data at the moment.
                            Please try refreshing or check back later.
                        </p>
                    </div>
                </div>
            ) : (
                < div className="p-4 md:p-8 space-y-8">
                    {/* Performance Stats */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl border border-blue-400 shadow">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="w-8 h-8 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-800">
                                Welcome, <span className="text-blue-700">{user?.name || "User"}</span>
                            </h1>
                        </div>
                        <span className="text-sm text-gray-600">
                            Role: <span className="font-medium">{user?.role || "N/A"}</span> | College:{" "}
                            <span className="font-medium">{dashboardData?.collegeName || "N/A"}</span>
                        </span>
                    </div>

                    {/* Dashboard Title + Filter Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        {/* Title + Subtitle */}
                        <div>
                            <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-800">
                                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                                College Performance Dashboard
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                A combined overview of students, submissions, scores, and assignments in the college.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm"
                            >
                                <Trash className="w-4 h-4" /> Clear Filters
                            </button>
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm"
                            >
                                <Filter className="w-5 h-5" /> Filter
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Students"
                            value={overallStats.totalStudents}
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                            bg="bg-blue-50"
                            border="border-blue-300"
                        />
                        <StatCard
                            title="Total Submissions"
                            value={overallStats.totalSubmissions}
                            icon={<FileText className="w-6 h-6 text-green-600" />}
                            bg="bg-green-50"
                            border="border-green-300"
                        />
                        <StatCard
                            title="Average Score"
                            value={overallStats.avgScore.toFixed(2)}
                            icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
                            bg="bg-purple-50"
                            border="border-purple-300"
                        />
                    </div>

                    {/* Assignments Stats */}
                    {dashboardData?.assignments && (
                        <>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard
                                    title="Total Assignments"
                                    value={dashboardData.assignments.total}
                                    icon={<ClipboardList className="w-6 h-6 text-indigo-600" />}
                                    bg="bg-indigo-50"
                                    border="border-indigo-300"
                                />
                                <StatCard
                                    title="Active Assignments"
                                    value={dashboardData.assignments.active}
                                    icon={<Clock className="w-6 h-6 text-orange-600" />}
                                    bg="bg-orange-50"
                                    border="border-orange-300"
                                />
                                <StatCard
                                    title="Completed Assignments"
                                    value={dashboardData.assignments.completed}
                                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                                    bg="bg-green-50"
                                    border="border-green-300"
                                />
                            </div>
                        </>
                    )}
                    {/* Filter Panel */}
                    {showFilter && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 min-h-screen p-4">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-300 w-full max-w-2xl">
                                <h3 className="text-lg font-semibold mb-5 text-gray-700 flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-indigo-600" /> Apply Filters
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <label className="text-gray-600 text-sm mb-1 block">From Date</label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.fromDate || ""}
                                            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-600 text-sm mb-1 block">To Date</label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.toDate || ""}
                                            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-600 text-sm mb-1 block">Department</label>
                                        <input
                                            type="text"
                                            placeholder="CSE, ECE..."
                                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.departmentId || ""}
                                            onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-600 text-sm mb-1 block">Batch Year</label>
                                        <input
                                            type="number"
                                            placeholder="2025"
                                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={filters.batchYear || ""}
                                            onChange={(e) => setFilters({ ...filters, batchYear: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowFilter(false)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            fetchPerformance();
                                            setShowFilter(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                    >
                                        <Check className="w-4 h-4" /> Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Department & Group Section */}
                    <div className="mt-8">
                        <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-800 mb-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            Student Distribution
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Breakdown of students across departments and groups.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Department-wise */}
                            <div className="bg-gradient-to-br from-red-50 to-white shadow-md rounded-2xl p-4 border border-red-200">
                                <SectionTitle
                                    title="Department-wise Students"
                                    icon={<Building2 className="w-5 h-5 text-red-600" />}
                                />
                                <div className="h-14 overflow-y-auto space-y-3 pr-2">
                                    {Object.entries(departmentWise).map(([dept, stats], index) => (
                                        <div
                                            key={dept}
                                            className="flex justify-between items-center bg-red-50 border border-red-200 p-3 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-700">
                                                {dept}
                                            </span>
                                            <span className="text-red-700 font-semibold">
                                                {stats.students} students
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Group-wise */}
                            <div className="bg-gradient-to-br from-yellow-50 to-white shadow-md rounded-2xl p-4 border border-yellow-200">
                                <SectionTitle
                                    title="Group-wise Students"
                                    icon={<Users className="w-5 h-5 text-yellow-600" />}
                                />
                                <div className="h-14 overflow-y-auto space-y-3 pr-2">
                                    {Object.entries(groupWise).map(([groupId, stats], index) => (
                                        <div
                                            key={groupId}
                                            className="flex justify-between items-center bg-yellow-50 border border-yellow-200 p-3 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-700">
                                                {stats?.name || "N/A"}
                                            </span>
                                            <span className="text-yellow-700 font-semibold">
                                                {stats.students} students
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <OverAlldata dashboarddata={dashboardData} />

                </div>
            )}
        </div>

    );
};


/* Reusable Components */
const StatCard = ({ title, value, icon, bg, border }) => (
    <div className={`shadow-md rounded-2xl p-6 flex items-center gap-4 ${bg} border ${border}`}>
        <div className="p-3 bg-white rounded-full shadow">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const SectionTitle = ({ title, icon }) => (
    <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-800">
        {icon} {title}
    </h3>
);

export default CollegePerformance;
