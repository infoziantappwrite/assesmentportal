import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissions, submitAllSubmissions } from "../../../Controllers/AssignmentControllers";
import {
  unblockStudent,
  unblockAllStudents
} from "../../../Controllers/ProctoringController";
import Loader from "../../../Components/Loader";
import NotificationMessage from "../../../Components/NotificationMessage";
import {
  TimerIcon,
  UserIcon,
  CheckCircle2,
  XCircle,
  Send,
  RefreshCw
} from "lucide-react";
import {
  generateUserActivityReport,
  downloadReport
} from "../../../Controllers/reportsController";

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmButtonColor = "red" }) => (
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
        className={`px-4 py-2 rounded text-white transition ${
          confirmButtonColor === "green" 
            ? "bg-green-600 hover:bg-green-700" 
            : "bg-red-600 hover:bg-red-700"
        }`}
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
}) => (
  <div className="px-5 py-4 hover:bg-gradient-to-br from-purple-50 to-indigo-50 transition-all duration-200">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <UserIcon size={18} className="text-purple-700" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-800">
            {s.student_id?.name || "Unknown Student"}
          </h4>
          <p className="text-xs text-gray-500">Attempt #{s.attempt_number}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
            s.status === "submitted"
              ? "bg-green-100 text-green-800"
              : s.status === "blocked"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {s.status}
        </span>
        {s.status === "blocked" && (
          <button
            onClick={() => onRequestUnblock(s.student_id._id, s.assignment_id)}
            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Unblock
          </button>
        )}
      </div>
    </div>

    <div className="ml-11 pl-1">
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700 mb-3">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-green-500" />
          <span className="font-medium">
            {s.scores?.obtained_marks ?? 0}/{s.scores?.total_marks ?? 0} pts
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TimerIcon size={14} className="text-blue-500" />
          <span>{s.timing?.total_time_taken_minutes ?? "-"} min</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => navigate(`/submissions/${s._id}`)}
          className="text-xs px-3 py-1.5 bg-white border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors font-medium"
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
          className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Generate Report
        </button>
      </div>
    </div>
  </div>
);

// Active Submissions Component
const ActiveSubmissions = ({ 
  assignmentId, 
  search, 
  selectedFormats, 
  setSelectedFormats, 
  handleDownloadReport, 
  onRequestUnblock,
  onRequestSubmitAll
}) => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActiveSubmissions = () => {
    setLoading(true);
    getSubmissions(assignmentId, pagination.page, pagination.limit, 'active')
      .then((res) => {
        const stats = res.data.statistics || {};
        const subs = res.data.submissions || [];
        
        // Filter active submissions and apply search
        const activeOnly = subs.filter((s) => s.status !== "blocked");
        const filtered = search
          ? activeOnly.filter((s) =>
              s.student_id?.name?.toLowerCase().includes(search.toLowerCase())
            )
          : activeOnly;
        
        setSubmissions(filtered);
        setPagination((prev) => ({
          ...prev,
          total: filtered.length
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchActiveSubmissions();
  }, [assignmentId, pagination.page, pagination.limit, search]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Submissions</h3>
        <p className="text-gray-600 text-sm">There are no active submissions for this assignment yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Submit All Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-green-700">
            Active Submissions ({submissions.length})
          </h4>
        </div>
        <button
          onClick={onRequestSubmitAll}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit All
        </button>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {submissions.map((s) => (
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
        
        {/* Active Submissions Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-green-50">
            <div className="flex justify-center gap-1">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1)
                  }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: i + 1
                    }))
                  }
                  className={`px-3 py-1.5 rounded border text-sm font-medium ${
                    pagination.page === i + 1
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(totalPages, prev.page + 1)
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
      </div>
    </div>
  );
};

// Blocked Submissions Component
const BlockedSubmissions = ({ 
  assignmentId, 
  search, 
  selectedFormats, 
  setSelectedFormats, 
  handleDownloadReport, 
  onRequestUnblock,
  onRequestUnblockAll,
  refreshTrigger
}) => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlockedSubmissions = () => {
    setLoading(true);
    getSubmissions(assignmentId, pagination.page, pagination.limit, 'blocked')
      .then((res) => {
        const stats = res.data.statistics || {};
        const subs = res.data.submissions || [];
        
        // Filter blocked submissions and apply search
        const blockedOnly = subs.filter((s) => s.status === "blocked");
        const filtered = search
          ? blockedOnly.filter((s) =>
              s.student_id?.name?.toLowerCase().includes(search.toLowerCase())
            )
          : blockedOnly;
        
        setSubmissions(filtered);
        setPagination((prev) => ({
          ...prev,
          total: filtered.length
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlockedSubmissions();
  }, [assignmentId, pagination.page, pagination.limit, search, refreshTrigger]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Blocked Submissions</h3>
        <p className="text-gray-600 text-sm">There are no blocked submissions for this assignment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Unblock All Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-red-700">
            Blocked Submissions ({submissions.length})
          </h4>
        </div>
        <button
          onClick={onRequestUnblockAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Unblock All
        </button>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {submissions.map((s) => (
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
        
        {/* Blocked Submissions Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-red-50">
            <div className="flex justify-center gap-1">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1)
                  }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: i + 1
                    }))
                  }
                  className={`px-3 py-1.5 rounded border text-sm font-medium ${
                    pagination.page === i + 1
                      ? "bg-red-600 border-red-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(totalPages, prev.page + 1)
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
      </div>
    </div>
  );
};

const Submissions = () => {
  const { id } = useParams(); // assignmentId from URL
  const [search, setSearch] = useState("");
  const [selectedFormats, setSelectedFormats] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "blocked"
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null
  });
  const navigate = useNavigate();

  // Helper function to show notifications
  const showNotification = (type, message) => {
    setNotification({ 
      show: true, 
      type, 
      message 
    });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Function to manually refresh submissions
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    showNotification('info', 'Refreshing submissions...');
  };

  const handleDownloadReport = async (submissionId, format = "excel") => {
    try {
      const res = await generateUserActivityReport(submissionId, format);
      const exportLogId = res.data?.exportLogId;
      if (exportLogId) {
        setTimeout(async () => {
          try {
            await downloadReport(exportLogId);
          } catch {
            showNotification('warning', 'Report generation started. Try downloading again in a few seconds.');
          }
        }, 3000);
      } else {
        showNotification('info', 'Report queued. Try again in a few seconds.');
      }
    } catch {
      showNotification('error', 'Failed to generate report. Please try again.');
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
      showNotification('success', res.message || 'Student unblocked successfully.');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh for both components
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to unblock student.');
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
      showNotification('success', res.message || 'All students unblocked successfully.');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh for both components
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to unblock all students.');
    }
  };

  // Show confirmation modal before submitting all
  const onRequestSubmitAll = () => {
    setModalData({
      show: true,
      title: "Confirm Submit All",
      message: "Are you sure you want to submit ALL active submissions? This action cannot be undone.",
      onConfirm: () => handleSubmitAll(),
      confirmButtonColor: "green"
    });
  };

  const handleSubmitAll = async () => {
    setModalData({ ...modalData, show: false }); // hide modal
    try {
      const res = await submitAllSubmissions(id);
      showNotification('success', res.message || 'All submissions have been submitted successfully.');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh for both components
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to submit all submissions.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-l overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mr-3"></span>
            Submissions
          </h3>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Refresh submissions"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "active"
                ? "bg-white text-green-700 border-b-2 border-green-500 shadow-sm"
                : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Active Submissions</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("blocked")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "blocked"
                ? "bg-white text-red-700 border-b-2 border-red-500 shadow-sm"
                : "text-gray-600 hover:text-red-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Blocked Submissions</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === "active" && (
          <div className="p-6">
            <ActiveSubmissions 
              assignmentId={id}
              search={search}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
              handleDownloadReport={handleDownloadReport}
              onRequestUnblock={onRequestUnblock}
              onRequestSubmitAll={onRequestSubmitAll}
            />
          </div>
        )}

        {activeTab === "blocked" && (
          <div className="p-6">
            <BlockedSubmissions 
              assignmentId={id}
              search={search}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
              handleDownloadReport={handleDownloadReport}
              onRequestUnblock={onRequestUnblock}
              onRequestUnblockAll={onRequestUnblockAll}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalData.show && (
        <ConfirmationModal
          title={modalData.title}
          message={modalData.message}
          onConfirm={modalData.onConfirm}
          onCancel={() => setModalData({ ...modalData, show: false })}
          confirmButtonColor={modalData.confirmButtonColor}
        />
      )}

      {/* Notification Message */}
      {notification.show && notification.message && (
        <NotificationMessage
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </div>
  );
};

export default Submissions;
