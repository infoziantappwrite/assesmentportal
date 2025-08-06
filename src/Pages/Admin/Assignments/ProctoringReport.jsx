import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../Components/Loader";
import { AlertTriangle, Shield, Clock, Eye, History } from "lucide-react";
import {
    getViolationsBySubmission,
    getStudentHistory,
    reviewViolation,
} from "../../../Controllers/ProctoringController";

const ProctoringReport = () => {
    const { id } = useParams(); // submissionId from route
    const [violations, setViolations] = useState([]);
    const [summary, setSummary] = useState({ total: 0, bySeverity: {} });
    const [studentHistory, setStudentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalData, setModalData] = useState({
        show: false,
        violationId: null,
        action: "",
        notes: "",
    });

    // Fetch Violations + Student History
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            // Get violations for this submission
            const violationRes = await getViolationsBySubmission(id);
            const violationsData = violationRes?.data?.violations || [];
            setViolations(violationsData);
            setSummary(violationRes?.data?.summary || { total: 0, bySeverity: {} });

            // Fetch student proctoring history if violations exist
            if (violationsData.length > 0) {
                const studentId = violationsData[0].student_id;
                const historyRes = await getStudentHistory(studentId);
                setStudentHistory(historyRes?.data?.violations || []);
            } else {
                setStudentHistory([]);
            }
        } catch (err) {
            console.error("Error fetching proctoring report:", err);
            setError("Failed to load proctoring report.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    // Handle Review Action
    const handleReview = async () => {
        try {
            if (!modalData.violationId || !modalData.action) {
                alert("Please select an action before submitting.");
                return;
            }

            await reviewViolation(modalData.violationId, {
                action: modalData.action,
                notes: modalData.notes,
            });

            // Update UI without refetch
            setViolations((prev) =>
                prev.map((v) =>
                    v._id === modalData.violationId
                        ? { ...v, action_taken: modalData.action }
                        : v
                )
            );

            // Close modal
            setModalData({ show: false, violationId: null, action: "", notes: "" });
        } catch (err) {
            console.error("Error reviewing violation:", err);
            alert("Failed to review violation.");
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (


        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Shield className="text-blue-600" /> Proctoring Report
            </h1>

            {/* Summary Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg shadow bg-blue-100 text-blue-800">
                    <p className="text-lg font-bold">{summary.total || 0}</p>
                    <p className="text-sm">Total Violations</p>
                </div>
                <div className="p-4 rounded-lg shadow bg-red-100 text-red-800">
                    <p className="text-lg font-bold">{summary.bySeverity?.high || 0}</p>
                    <p className="text-sm">High Severity</p>
                </div>
                <div className="p-4 rounded-lg shadow bg-yellow-100 text-yellow-800">
                    <p className="text-lg font-bold">{summary.bySeverity?.medium || 0}</p>
                    <p className="text-sm">Medium Severity</p>
                </div>
            </div>

            {/* Violations */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <AlertTriangle className="text-orange-500 w-6 h-6" /> Violations
            </h2>

            {violations.length === 0 ? (
                <p className="text-gray-500">No violations found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {violations.map((v, index) => {
                        const severityColors = {
                            high: "border-red-500 bg-red-50",
                            medium: "border-yellow-500 bg-yellow-50",
                            low: "border-green-500 bg-green-50",
                        };

                        const badgeColors = {
                            high: "bg-red-200 text-red-800 border-red-300",
                            medium: "bg-yellow-200 text-yellow-800",
                            low: "bg-green-200 text-green-800",
                        };

                        return (
                            <div
                                key={v._id}
                                className={`relative border-l-4 ${severityColors[v.severity] || "border-gray-300 bg-gray-50"} 
                      p-5 rounded-xl shadow-sm hover:shadow-lg transition duration-200`}
                            >
                                {/* Review Button - Top Right */}


                                {/* Header Section */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="text-blue-600 w-5 h-5" />
                                        <h3 className="font-semibold text-gray-800 text-sm">
                                            {index + 1}. {v.event_type}
                                        </h3>
                                    </div>
                                    {!v.action_taken && (
                                        <button
                                            onClick={() =>
                                                setModalData({
                                                    show: true,
                                                    violationId: v._id,
                                                    action: "",
                                                    notes: "",
                                                })
                                            }
                                            className=" px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full 
                         hover:bg-blue-700 transition duration-200 shadow"
                                        >
                                            Review
                                        </button>
                                    )}
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${badgeColors[v.severity] || "bg-gray-200 text-gray-800"}`}
                                    >
                                        {v.severity}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                    {v.event_details?.description || "No details provided"}
                                </p>

                                {/* Metadata */}
                                <div className="mt-3 text-xs text-gray-600 space-y-1">
                                    <p><strong>IP:</strong> {v.session_info?.ip_address || "N/A"}</p>
                                    <p className="truncate">
                                        <strong>Page:</strong> {v.session_info?.page_url || "N/A"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {v.session_info?.timestamp
                                            ? new Date(v.session_info.timestamp).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </div>

                                {/* Action Taken */}
                                <p className="text-xs mt-3">
                                    <strong>Action Taken:</strong>{" "}
                                    {v.action_taken ? (
                                        <span className="text-green-600 font-medium">{v.action_taken}</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Pending</span>
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}



            {/* Student History */}
            <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-700">
                Student Proctoring History
            </h2>

            {studentHistory.length === 0 ? (
                <p className="text-gray-500">No history found.</p>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Event Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Severity</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {studentHistory.map((h) => {
                                const severityBadge =
                                    h.severity === "high"
                                        ? "bg-red-100 text-red-700 border border-red-300"
                                        : h.severity === "medium"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                            : "bg-green-100 text-green-700 border border-green-300";

                                return (
                                    <tr key={h._id} className="hover:bg-gray-50 transition">
                                        {/* Event Type */}
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                                            <span className="bg-blue-100 p-1 rounded">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4 text-blue-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3"
                                                    />
                                                </svg>
                                            </span>
                                            {h.event_type}
                                        </td>

                                        {/* Severity */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${severityBadge}`}
                                            >
                                                {h.severity}
                                            </span>
                                        </td>

                                        {/* Timestamp */}
                                        <td className="px-4 py-3 text-xs text-gray-600 flex items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3M12 22a10 10 0 110-20 10 10 0 010 20z"
                                                />
                                            </svg>
                                            {h.created_at
                                                ? new Date(h.created_at).toLocaleString()
                                                : "Unknown time"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}



            {/* Review Modal */}
            {modalData.show && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
                        {/* Close Button */}
                        <button
                            onClick={() =>
                                setModalData({ show: false, violationId: null, action: "", notes: "" })
                            }
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="text-orange-500 w-5 h-5" />
                            Review Violation
                        </h3>

                        {/* Action Dropdown */}
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Select Action
                        </label>
                        <select
                            value={modalData.action}
                            onChange={(e) =>
                                setModalData((prev) => ({ ...prev, action: e.target.value }))
                            }
                            className="border border-gray-300 w-full p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Choose an action...</option>
                            <option value="warning">⚠️ Warning</option>
                            <option value="test_terminated">🛑 Terminate Test</option>
                            <option value="ignore">✅ Ignore</option>
                        </select>

                        {/* Notes */}
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Notes (optional)
                        </label>
                        <textarea
                            value={modalData.notes}
                            onChange={(e) =>
                                setModalData((prev) => ({ ...prev, notes: e.target.value }))
                            }
                            className="border border-gray-300 w-full p-2 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Add notes for this action..."
                            rows={3}
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setModalData({ show: false, violationId: null, action: "", notes: "" })
                                }
                                className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReview}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
};

export default ProctoringReport;
