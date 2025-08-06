import React, { useEffect, useState } from "react";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import { unblockStudent, unblockAllStudents } from "../../../Controllers/ProctoringController";

const BlockedSubmissions = ({ assignmentId }) => {
    const [blockedSubmissions, setBlockedSubmissions] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0 });
    const [modalData, setModalData] = useState({
        show: false,
        title: "",
        message: "",
        onConfirm: null,
    });

    // Fetch blocked submissions
    const fetchBlocked = async () => {
        try {
            setLoading(true);
            const response = await getSubmissions(
                assignmentId,
                "blocked",
                pagination.page,
                pagination.limit
            );
            const data = response.data || response; // Adjust for your API
            setBlockedSubmissions(data.submissions || []);
            setPagination(prev => ({
                ...prev,
                total: data.statistics?.total || 0,
            }));
        } catch (error) {
            console.error("Error fetching blocked submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (assignmentId) fetchBlocked();
    }, [assignmentId, pagination.page]);

    // Filter based on search
    const filteredResults = blockedSubmissions.filter((res) => {
        const name = res.student_id?.name?.toLowerCase() || "";
        const email = res.student_id?.email?.toLowerCase() || "";
        const query = search.toLowerCase();
        return name.includes(query) || email.includes(query);
    });

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

    // --- Unblock Logic ---
    const onRequestUnblock = (studentId) => {
        setModalData({
            show: true,
            title: "Confirm Unblock",
            message: "Are you sure you want to unblock this student?",
            onConfirm: () => handleUnblock(studentId),
        });
    };

    const handleUnblock = async (studentId) => {
        setModalData({ ...modalData, show: false });
        try {
            const res = await unblockStudent(studentId, assignmentId);
            alert(res.message || "Student unblocked successfully.");
            fetchBlocked();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to unblock student.");
        }
    };

    const onRequestUnblockAll = () => {
        setModalData({
            show: true,
            title: "Confirm Unblock All",
            message: "Are you sure you want to unblock ALL blocked students?",
            onConfirm: () => handleUnblockAll(),
        });
    };

    const handleUnblockAll = async () => {
        setModalData({ ...modalData, show: false });
        try {
            const res = await unblockAllStudents(assignmentId);
            alert(res.message || "All students unblocked successfully.");
            fetchBlocked();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to unblock all students.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-lg">
            {/* Header */}
            <div className="w-full border-b border-gray-300 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <div className="w-2 h-5 rounded-full bg-red-600"></div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Blocked Submissions
                    </h2>
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
                        onClick={onRequestUnblockAll}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Unblock All
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-6">Loading...</div>
            ) : filteredResults.length === 0 ? (
                <div className="text-gray-500 text-center py-8 px-4">
                    No blocked submissions.
                </div>
            ) : (
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-red-200 text-left text-sm table-fixed">
                            <thead className="bg-red-100 text-gray-700 text-xs uppercase">
                                <tr>
                                    <th className="border border-red-200 p-2 w-8">#</th>
                                    <th className="border border-red-200 p-2 w-32 truncate">Name</th>
                                    <th className="border border-red-200 p-2 w-48 truncate">Email</th>
                                    <th className="border border-red-200 p-2 w-40 truncate">Reason</th>
                                    <th className="border border-red-200 p-2 w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((res, index) => (
                                    <tr
                                        key={res._id}
                                        className="hover:bg-red-50 transition-colors duration-200 text-gray-700"
                                    >
                                        <td className="border border-red-200 p-2 text-center font-semibold text-red-700">
                                            {index + 1 + (pagination.page - 1) * pagination.limit}
                                        </td>
                                        <td
                                            className="border border-red-200 p-2 truncate font-medium text-red-800"
                                            title={res.student_id?.name}
                                        >
                                            {res.student_id?.name || "N/A"}
                                        </td>
                                        <td
                                            className="border border-red-200 p-2 truncate text-blue-600"
                                            title={res.student_id?.email}
                                        >
                                            {res.student_id?.email || "N/A"}
                                        </td>
                                        <td
                                            className="border border-red-200 p-2 truncate text-gray-600"
                                            title={res.block_reason || "Not provided"}
                                        >
                                            {res.block_reason || "Not provided"}
                                        </td>
                                        <td className="border border-red-200 p-2">
                                            <button
                                                onClick={() => onRequestUnblock(res.student_id?._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                            >
                                                Unblock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-4 text-sm">
                            <button
                                onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border rounded-lg hover:bg-red-100 disabled:opacity-50"
                            >
                                First
                            </button>
                            <button
                                onClick={() =>
                                    setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
                                }
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border rounded-lg hover:bg-red-100 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {visiblePages.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setPagination((prev) => ({ ...prev, page }))}
                                    className={`px-3 py-1 border rounded-lg ${
                                        pagination.page === page
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
                                className="px-3 py-1 border rounded-lg hover:bg-red-100 disabled:opacity-50"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => setPagination((prev) => ({ ...prev, page: totalPages }))}
                                disabled={pagination.page === totalPages}
                                className="px-3 py-1 border rounded-lg hover:bg-red-100 disabled:opacity-50"
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {modalData.show && (
    <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm bg-white/50">
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-300 w-96">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">{modalData.title}</h3>
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
