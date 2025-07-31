import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../../Components/Table';
import Loader from '../../../Components/Loader';
import GenerateReportButton from './GenerateReportButton';
import { FiFilter, FiSearch, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllAssignments } from '../../../Controllers/AssignmentControllers';
import { getAllUsers } from '../../../Controllers/userControllers';
import { getAllColleges } from '../../../Controllers/CollegeController';

const reportTypes = Object.freeze({
    USER_ACTIVITY: 'user_activity',
    PERFORMANCE_SUMMARY: 'performance_summary',
    REVIEW_REPORT: 'review_report',
    ASSIGNMENT_REPORT: 'assignment_report',
    COLLEGE_REPORT: 'college_report',
    PROCTORING_REPORT: 'proctoring_report',
    CUSTOM_REPORT: 'custom_report',
});

const ReportsPage = () => {
    const [selectedReport, setSelectedReport] = useState('user_activity');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (selectedReport === reportTypes.ASSIGNMENT_REPORT) {
                    const response = await getAllAssignments({
                        page: currentPage,
                        limit: pageSize,
                        search: searchTerm
                    });

                    const formattedData = response.data.assignments.map((a) => ({
                        _id: a._id,
                        title: a.title,
                        assessmentTitle: a.assessment_id?.title || '-',
                        assignedBy: `${a.assigned_by?.name || 'Admin'} (${a.assigned_by?.email || ''})`,
                        status: a.status,
                        startTime: new Date(a.schedule?.start_time).toLocaleString(),
                        full: a,
                    }));

                    setData(formattedData);
                    setTotalItems(response.data.pagination.total);
                    setTotalPages(response.data.pagination.totalPages);
                    setColumns([
                        { label: 'Title', accessor: 'title', className: 'font-medium text-blue-600' },
                        { label: 'Assessment', accessor: 'assessmentTitle' },
                        { label: 'Assigned By', accessor: 'assignedBy' },
                        { label: 'Start Time', accessor: 'startTime', className: 'whitespace-nowrap' },
                        {
                            label: 'Status',
                            accessor: 'status',
                            render: (row) => (
                                <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {row.status}
                                </span>
                            )
                        },
                        {
                            label: 'Action',
                            accessor: 'action',
                            className: 'text-right',
                            render: (row) => (
                                <div className="flex justify-end">
                                    <GenerateReportButton
                                        reportType={reportTypes.ASSIGNMENT_REPORT}
                                        payload={row.full}
                                    />
                                </div>
                            ),
                        },
                    ]);
                } else if (selectedReport === reportTypes.USER_ACTIVITY) {
                    const response = await getAllUsers({
                        page: currentPage,
                        limit: pageSize,
                        search: searchTerm
                    });

                    const formattedUsers = response.data.users.map((u) => ({
                        ...u,
                        is_active_text: u.is_active ? 'Yes' : 'No',
                        assigned_colleges_count: u.assigned_colleges?.length || 0,
                        assigned_groups_count: u.assigned_groups?.length || 0,
                    }));

                    setData(formattedUsers);
                    setTotalItems(response.data.pagination.total);
                    setTotalPages(response.data.pagination.totalPages);
                    setColumns([
                        { label: 'Name', accessor: 'name', className: 'font-medium' },
                        { label: 'Email', accessor: 'email' },
                        { label: 'Role', accessor: 'role' },
                        {
                            label: 'Active',
                            accessor: 'is_active_text',
                            render: (row) => (
                                <span className={`px-2 py-1 rounded-full text-xs ${row.is_active_text === 'Yes'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {row.is_active_text}
                                </span>
                            )
                        },
                        { label: 'Colleges', accessor: 'assigned_colleges_count', className: 'text-center' },
                        { label: 'Groups', accessor: 'assigned_groups_count', className: 'text-center' },
                        {
                            label: 'Action',
                            accessor: 'action',
                            className: 'text-right',
                            render: (row) => (
                                <div className="flex justify-end">
                                    <GenerateReportButton
                                        reportType={reportTypes.USER_ACTIVITY}
                                        payload={row}
                                    />
                                </div>
                            ),
                        },
                    ]);
                } else if (selectedReport === reportTypes.COLLEGE_REPORT) {
                    const response = await getAllColleges();
                    const collegesData = Array.isArray(response) ? response : [];

                    const formattedColleges = collegesData.map((c) => ({
                        ...c,
                        city: c.address?.city || 'N/A',
                        state: c.address?.state || 'N/A',
                        email: c.contact?.email || 'N/A',
                    }));

                    setData(formattedColleges);
                    setTotalItems(collegesData.length);
                    setTotalPages(Math.ceil(collegesData.length / pageSize));
                    setColumns([
                        { label: 'College Name', accessor: 'name', className: 'font-medium text-blue-600' },
                        { label: 'Code', accessor: 'code', className: 'font-mono' },
                        { label: 'Location', accessor: 'city', render: (row) => `${row.city}, ${row.state}` },
                        {
                            label: 'Students',
                            accessor: 'total_students',
                            className: 'text-center',
                            render: (row) => (
                                <span className="font-medium">{row.total_students}</span>
                            )
                        },
                        { label: 'Email', accessor: 'email', className: 'whitespace-nowrap' },
                        {
                            label: 'Action',
                            accessor: 'action',
                            className: 'text-right',
                            render: (row) => (
                                <div className="flex justify-end">
                                    <GenerateReportButton
                                        reportType={reportTypes.COLLEGE_REPORT}
                                        payload={row}
                                    />
                                </div>
                            ),
                        },
                    ]);
                } else {
                    setData([]);
                    setColumns([]);
                    setTotalItems(0);
                    setTotalPages(1);
                }
            } catch (err) {
                console.error('Error loading report data:', err);
                setData([]);
                setTotalItems(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        if (selectedReport) {
            fetchData();
        }
    }, [selectedReport, currentPage, searchTerm]);

    const paginatedData = useMemo(() => {
        if (selectedReport === reportTypes.COLLEGE_REPORT) {
            const startIndex = (currentPage - 1) * pageSize;
            return data.slice(startIndex, startIndex + pageSize);
        }
        return data;
    }, [data, currentPage, selectedReport]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Generate and analyze various system reports
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => navigate("/reports/history")}
                                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Clock className="mr-2" />
                                    History
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Type
                                </label>
                                <div className="relative">
                                    <select
                                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        value={selectedReport}
                                        onChange={(e) => {
                                            setSelectedReport(e.target.value);
                                            setCurrentPage(1);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <option value="">Select a report type</option>
                                        {Object.entries(reportTypes).map(([key, value]) => (
                                            <option key={value} value={value}>
                                                {value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search reports..."
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="px-6 py-4">
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <div className="overflow-hidden">
                                    <Table
                                        columns={columns}
                                        data={selectedReport === reportTypes.COLLEGE_REPORT ? paginatedData : data}
                                        noDataText={
                                            <div className="text-center py-12">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        vectorEffect="non-scaling-stroke"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                                    No reports found
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Select a report type to view data
                                                </p>
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 rounded-b-lg">
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                                    <span className="font-medium">
                                                        {Math.min(currentPage * pageSize, totalItems)}
                                                    </span>{' '}
                                                    of <span className="font-medium">{totalItems}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <button
                                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;