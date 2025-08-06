import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import {
  unblockStudent,
  unblockAllStudents
} from "../../../Controllers/ProctoringController";
import Loader from "../../../Components/Loader";
import {
  TimerIcon,
  UserIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  generateUserActivityReport,
  downloadReport
} from "../../../Controllers/reportsController";

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
<div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="absolute inset-0 bg-opacity-10 backdrop-blur-sm"></div>
  <div className="relative bg-white rounded-lg shadow-lg p-6 w-80 max-w-full z-10">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <p className="mb-5 text-gray-700">{message}</p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
      >
        Confirm
      </button>
    </div>
  </div>
</div>

);

const SubmissionItem = ({
  submission: s,
  navigate,
  selectedFormats,
  setSelectedFormats,
  handleDownloadReport,
  onRequestUnblock
}) => {
  // Determine styles based on status
  const isBlocked = s.status === "blocked";
  const isSubmitted = s.status === "submitted";

  const containerClasses = isBlocked
    ? "hover:bg-red-50 border-l-4 border-red-300"
    : "hover:bg-green-50 border-l-4 border-green-300";

  const userIconBg = isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";

  return (
    <div className={`px-5 py-4 transition-all duration-200 ${containerClasses}`}>
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        {/* Student Info */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userIconBg}`}>
            <UserIcon size={18} />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-800">
              {s.student_id?.name || "Unknown Student"}
            </h4>
            <p className="text-xs text-gray-500">Attempt #{s.attempt_number}</p>
          </div>
        </div>

        {/* Status + Unblock Button */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
              isSubmitted
                ? "bg-green-100 text-green-800"
                : isBlocked
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {s.status}
          </span>
          {isBlocked && (
            <button
              onClick={() => onRequestUnblock(s.student_id._id, s.assignment_id)}
              className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Unblock
            </button>
          )}
        </div>
      </div>

      {/* Score & Time */}
      <div className="ml-11 pl-1">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700 mb-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className={isBlocked ? "text-red-500" : "text-green-500"} />
            <span className="font-medium">
              {s.scores?.obtained_marks ?? 0}/{s.scores?.total_marks ?? 0} pts
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <TimerIcon size={14} className={isBlocked ? "text-red-500" : "text-blue-500"} />
            <span>{s.timing?.total_time_taken_minutes ?? "-"} min</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => navigate(`/submissions/${s._id}`)}
            className={`text-xs px-3 py-1.5 border rounded-md font-medium transition-colors ${
              isBlocked
                ? "bg-white border-red-600 text-red-600 hover:bg-red-50"
                : "bg-white border-green-600 text-green-600 hover:bg-green-50"
            }`}
          >
            View Full Submission
          </button>

          <select
            value={selectedFormats[s._id] || "excel"}
            onChange={(e) =>
              setSelectedFormats((prev) => ({
                ...prev,
                [s._id]: e.target.value
              }))
            }
            className="text-xs border border-gray-300 rounded-md px-2 py-1 text-gray-700"
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>

          <button
            onClick={() =>
              handleDownloadReport(s._id, selectedFormats[s._id] || "excel")
            }
            className={`text-xs px-3 py-1.5 text-white rounded-md font-medium transition-colors ${
              isBlocked ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};


const Submissions = () => {
  const { id } = useParams(); // assignmentId from URL
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [selectedFormats, setSelectedFormats] = useState({});
  const [blockedSubmissions, setBlockedSubmissions] = useState([]);
  const [activeSubmissions, setActiveSubmissions] = useState([]);
  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null
  });
  const navigate = useNavigate();

  const fetchSubmissions = () => {
    setLoading(true);
    getSubmissions(id, pagination.page, pagination.limit)
      .then((res) => {
        const stats = res.data.statistics || {};
        const subs = res.data.submissions || [];
        setSubmissions(subs);
        setPagination((prev) => ({
          ...prev,
          total: stats.total || 0
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [id, pagination.page, pagination.limit]);

  useEffect(() => {
    const toFilter = search
      ? submissions.filter((s) =>
          s.student_id?.name?.toLowerCase().includes(search.toLowerCase())
        )
      : submissions;

    const blocked = toFilter.filter((s) => s.status === "blocked");
    const others = toFilter.filter((s) => s.status !== "blocked");

    setBlockedSubmissions(blocked);
    setActiveSubmissions(others);
  }, [search, submissions]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handleDownloadReport = async (submissionId, format = "excel") => {
    try {
      const res = await generateUserActivityReport(submissionId, format);
      const exportLogId = res.data?.exportLogId;
      if (exportLogId) {
        setTimeout(async () => {
          try {
            await downloadReport(exportLogId);
          } catch {
            alert(
              "Report generation started. Try downloading again in a few seconds."
            );
          }
        }, 3000);
      } else {
        alert("Report queued. Try again in a few seconds.");
      }
    } catch {
      alert("Failed to generate report. Please try again.");
    }
  };

  // Show confirmation modal before unblocking a single student
  const onRequestUnblock = (studentId, assignmentId) => {
    setModalData({
      show: true,
      title: "Confirm Unblock",
      message: "Are you sure you want to unblock this student?",
      onConfirm: () => handleUnblock(studentId, assignmentId)
    });
  };

  const handleUnblock = async (studentId, assignmentId) => {
    setModalData({ ...modalData, show: false }); // hide modal
    try {
      const res = await unblockStudent(studentId, assignmentId);
      alert(res.message || "Student unblocked successfully.");
      fetchSubmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to unblock student.");
    }
  };

  // Show confirmation modal before unblocking all
  const onRequestUnblockAll = () => {
    setModalData({
      show: true,
      title: "Confirm Unblock All",
      message: "Are you sure you want to unblock ALL blocked students?",
      onConfirm: () => handleUnblockAll()
    });
  };

  const handleUnblockAll = async () => {
    setModalData({ ...modalData, show: false }); // hide modal
    try {
      const res = await unblockAllStudents(id);
      alert(res.message || "All students unblocked successfully.");
      fetchSubmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to unblock all students.");
    }
  };

  return (
    <div className="space-y-6">
  {/* Search Bar */}
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-l overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-800 flex items-center">
        <span className="w-2 h-6 bg-gradient-to-r from-gray-500 to-black rounded-full mr-3"></span>
        Submissions
      </h3>
      <input
        type="text"
        placeholder="Search by name or email..."
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-80"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  {/* Loader or Empty State */}
  {loading ? (
    <div className="p-8 flex justify-center">
      <Loader />
    </div>
  ) : activeSubmissions.length === 0 && blockedSubmissions.length === 0 ? (
    <div className="p-6 text-center bg-white rounded-xl border border-gray-200 shadow">
      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <XCircle className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-gray-600 text-sm">No submissions found</p>
    </div>
  ) : (
    <>
      {/* Active Submissions Card */}
      <div className="bg-green-50 border border-green-300 rounded-xl shadow overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b border-green-200">
          <h4 className="text-lg font-semibold text-green-700">
            Active Submissions ({activeSubmissions.length})
          </h4>
        </div>
        <div className="divide-y divide-green-100 max-h-[500px] overflow-y-auto">
          {activeSubmissions.map((s) => (
            <SubmissionItem
              key={s._id}
              submission={s}
              navigate={navigate}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
              handleDownloadReport={handleDownloadReport}
              onRequestUnblock={onRequestUnblock}
            />
          ))}
        </div>
      </div>

      {/* Blocked Submissions Card */}
      {blockedSubmissions.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl shadow overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3 border-b border-red-200">
            <h4 className="text-lg font-semibold text-red-700">
              Blocked Submissions ({blockedSubmissions.length})
            </h4>
            <button
              onClick={onRequestUnblockAll}
              className="text-sm px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Unblock All
            </button>
          </div>
          <div className="divide-y divide-red-100 max-h-[500px] overflow-y-auto">
            {blockedSubmissions.map((s) => (
              <SubmissionItem
                key={s._id}
                submission={s}
                navigate={navigate}
                selectedFormats={selectedFormats}
                setSelectedFormats={setSelectedFormats}
                handleDownloadReport={handleDownloadReport}
                onRequestUnblock={onRequestUnblock}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )}

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-xl shadow">
      <div className="flex justify-center gap-1">
        <button
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
          }
          disabled={pagination.page === 1}
          className="px-3 py-1.5 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
            className={`px-3 py-1.5 rounded border text-sm font-medium ${
              pagination.page === i + 1
                ? 'bg-gray-600 border-gray-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(totalPages, prev.page + 1),
            }))
          }
          disabled={pagination.page === totalPages}
          className="px-3 py-1.5 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )}

  {/* Confirmation Modal */}
  {modalData.show && (
    <ConfirmationModal
      title={modalData.title}
      message={modalData.message}
      onConfirm={modalData.onConfirm}
      onCancel={() => setModalData({ ...modalData, show: false })}
    />
  )}
</div>

  );
};

export default Submissions;
