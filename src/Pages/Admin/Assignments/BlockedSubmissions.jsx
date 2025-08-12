import React, { useEffect, useState } from "react";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import { unblockStudent, unblockAllStudents } from "../../../Controllers/ProctoringController";
import NotificationMessage from "../../../Components/NotificationMessage";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react"; 
import { toast } from "react-toastify";


const BlockedSubmissions = ({ assignmentId }) => {
    const [blockedSubmissions, setBlockedSubmissions] = useState([]);
    const [search, setSearch] = useState("");
  
    const [refreshing, setRefreshing] = useState(false);

    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0 });
    const [modalData, setModalData] = useState({
        show: false,
        title: "",
        message: "",
        onConfirm: null,
    });
    const navigate = useNavigate();
    const [notification, setNotification] = useState({
        show: false,
        type: "success",
        message: "",
    });

    // Fetch blocked submissions
    const fetchBlocked = async () => {
        try {
            
            const response = await getSubmissions(
                assignmentId,
                "blocked",
                pagination.page,
                pagination.limit
            );
            const data = response.data || response;
            setBlockedSubmissions(data.submissions || []);
            setPagination((prev) => ({
                ...prev,
                total: data.statistics?.total || 0,
            }));
        } catch {
            toast.error("Failed to fetch blocked submissions.");
        }
    };

    useEffect(() => {
        if (assignmentId) fetchBlocked();
    }, [assignmentId, pagination.page]);

    // Search filter
    const filteredResults = blockedSubmissions.filter((res) => {
        const name = res.student_id?.name?.toLowerCase() || "";
        const email = res.student_id?.email?.toLowerCase() || "";
        const query = search.toLowerCase();
        return name.includes(query) || email.includes(query);
    });

    // --- Unblock Logic ---
    const handleUnblock = async (studentId) => {
        setModalData({ ...modalData, show: false });
        try {
            const res = await unblockStudent(studentId, assignmentId);
            toast.success(res.message || "Student unblocked successfully.");
            fetchBlocked();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unblock student.");
        }
    };
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchBlocked();
        } finally {
            setRefreshing(false);
        }
    };


    const handleUnblockAll = async () => {
        setModalData({ ...modalData, show: false });
        try {
            const res = await unblockAllStudents(assignmentId);
            toast.success(res.message || "All students unblocked successfully.");
            fetchBlocked();
        } 
        catch (error) {
            toast.error(error.response?.data?.message || "Failed to unblock all students.");
        }
    };

    // Pagination
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    let visiblePages = [];
    if (totalPages <= 3) {
        visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        if (pagination.page === 1) visiblePages = [1, 2, 3];
        else if (pagination.page === totalPages)
            visiblePages = [totalPages - 2, totalPages - 1, totalPages];
        else visiblePages = [pagination.page, pagination.page + 1, pagination.page + 2];
    }

    return (
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-lg">
            {/* Header */}
            <div className="w-full border-b border-gray-300 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <div className="w-2 h-5 rounded-full bg-red-600"></div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Blocked Submissions
                    </h2>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh submissions"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>

                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 w-full sm:w-80"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                    />
                    <button
                        onClick={() =>
                            setModalData({
                                show: true,
                                title: "Confirm Unblock All",
                                message: "Are you sure you want to unblock ALL blocked students?",
                                onConfirm: handleUnblockAll,
                            })
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Unblock All
                    </button>
                </div>
            </div>

            {/* List */}
            { filteredResults.length === 0 ? (
                <div className="text-gray-500 text-center py-8 px-4">
                    No blocked submissions.
                </div>
            ) : (
                <div className=" divide-y divide-red-200">
                    {filteredResults.map((res, index) => (
                        <div
                            key={res._id}
                            className="flex justify-between items-center p-4 hover:bg-red-50 rounded-xl  transition"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {index + 1 + (pagination.page - 1) * pagination.limit}.{" "}
                                    {res.student_id?.name || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">{res.student_id?.email || "N/A"}</p>
                                <p className="text-xs text-gray-400 italic">
                                    {res.block_reason || "No reason provided"}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/admin/proctoring_report/${res._id}`)}
                                    className="text-xs px-3 py-1.5 bg-white-500 font-semibold text-blue-600 rounded-md hover:bg-blue-100 border border-blue-600"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() =>
                                        setModalData({
                                            show: true,
                                            title: "Confirm Unblock",
                                            message: "Are you sure you want to unblock this student?",
                                            onConfirm: () => handleUnblock(res.student_id?._id),
                                        })
                                    }
                                    className="text-xs px-3 py-1.5 font-semibold bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Unblock
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4 text-sm">
                    <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                        First
                    </button>
                    <button
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
                        }
                        disabled={pagination.page === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            onClick={() => setPagination((prev) => ({ ...prev, page }))}
                            className={`px-3 py-1 border border-gray-300 rounded-lg ${pagination.page === page
                                    ? "bg-red-500 text-white"
                                    : "hover:bg-red-100"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                page: Math.min(prev.page + 1, totalPages),
                            }))
                        }
                        disabled={pagination.page === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: totalPages }))}
                        disabled={pagination.page === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                        Last
                    </button>
                </div>
            )}

            {/* Confirmation Modal */}
            {modalData.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/50">
                    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-300 w-96">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                            {modalData.title}
                        </h3>
                        <p className="text-gray-700 mb-4">{modalData.message}</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setModalData({ ...modalData, show: false })}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={modalData.onConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockedSubmissions;
