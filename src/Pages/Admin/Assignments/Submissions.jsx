import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import Loader from "../../../Components/Loader";
import {
  TimerIcon,
  UserIcon,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import {
  generateUserActivityReport,
  downloadReport
} from "../../../Controllers/reportsController";
import BlockedSubmissions from "./BlockedSubmissions";
import { useUser } from '../../../context/UserContext';

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// Notification Modal for Success/Error
const NotificationModal = ({ title, message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="mb-5 text-gray-700">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

// Submission Item Card
const SubmissionItem = ({
  submission: s,
  navigate,
  selectedFormats,
  setSelectedFormats,
  handleDownloadReport,
  role
}) => {

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerateClick = async (submissionId, format) => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress (you'll replace this with actual progress updates)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      await handleDownloadReport(submissionId, format);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };
  return (
    <div className="px-5 py-4 hover:bg-gradient-to-br from-purple-50 to-indigo-50 transition-all duration-200">
      <div className="flex justify-between items-start mb-2">

        {/* Left Side: User Info */}
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

        {/* Right Side: Status & Proctoring Info */}
        <div className="flex items-center gap-3">


          {/* Unblock Count */}
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full shadow-sm">
            Unblocks: {s.proctoring?.unblock_count ?? 0}
          </span>

          {/* Violation Count */}
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full shadow-sm">
            Violations: {s.proctoring?.violation_count ?? 0}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${s.status === "submitted"
                ? "bg-green-100 text-green-800"
                : s.status === "blocked"
                  ? "bg-red-100 text-red-800"
                  : s.status === "auto_submitted"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }`}
          >
            Status : {s.status}
          </span>
        </div>
      </div>

      {/* Marks & Time */}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => {
              if (s.status !== "in_progress" && s.status !== "blocked") {
                navigate(`/${role}/submissions/${s._id}`);
              }
            }}
            disabled={s.status === "in_progress" || s.status === "blocked"}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors
      ${(s.status === "in_progress" || s.status === "blocked")
                ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                : "bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer"
              }`}
          >
            View Full Submission
          </button>

          <button
            onClick={() => navigate(`/${role}/proctoring_report/${s._id}`)}
            className="text-xs px-3 py-1.5 bg-white border border-red-600 text-red-600 rounded-md hover:bg-purple-50 transition-colors font-medium"
          >
            View Proctoring Details
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
            onClick={() => handleGenerateClick(s._id, selectedFormats[s._id] || "excel")}
            disabled={isGenerating}
            className={`text-xs px-3 py-1.5 ${isGenerating
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-md transition-colors font-medium relative overflow-hidden`}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
          {isGenerating && (
            <div className="mt-2 w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Generating report...</span>Select a Student
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const Submissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 1000 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: ""
  });
  const { role } = useUser();

  // Fetch Submissions
  const fetchSubmissions = () => {
    setLoading(true);
    getSubmissions(id, undefined, pagination.page, pagination.limit)
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

  // Function to manually refresh submissions
  const handleRefresh = () => {
    setRefreshing(true);
    getSubmissions(id, undefined, pagination.page, pagination.limit)
      .then((res) => {
        const stats = res.data.statistics || {};
        const subs = res.data.submissions || [];
        setSubmissions(subs);
        setPagination((prev) => ({
          ...prev,
          total: stats.total || 0
        }));
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [id, pagination.page, pagination.limit]);

  // Apply search & status filter
  useEffect(() => {
    let filtered = submissions;

    if (search) {
      filtered = filtered.filter((s) =>
        s.student_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [search, statusFilter, submissions]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Handle Report Download with Notification
  const handleDownloadReport = async (submissionId, format = "excel") => {
    try {
      const res = await generateUserActivityReport(submissionId, format);
      const exportLogId = res.data?.exportLogId;

      if (exportLogId) {
        // Poll for progress (example - you'll need to implement actual progress tracking)
        let progress = 0;
        const pollInterval = setInterval(async () => {
          try {
            // In a real implementation, you would check the actual progress from your API
            progress += 20;
            if (progress >= 100) {
              clearInterval(pollInterval);
              await downloadReport(exportLogId);
              setNotification({
                show: true,
                title: "Success",
                message: "Report downloaded successfully."
              });
            }
          } catch {
            clearInterval(pollInterval);
            setNotification({
              show: true,
              title: "Pending",
              message: "Report generation started. Try downloading again in a few seconds."
            });
          }
        }, 500);
      }
    } catch {
      setNotification({
        show: true,
        title: "Error",
        message: "Permission Denied. Please try again."
      });
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-l overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mr-3"></span>
              All Submissions
            </h3>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="all">All</option>
              <option value="submitted">Submitted</option>
              <option value="auto_submitted">Auto Submitted</option>
              <option value="blocked">Blocked</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div>
            <Loader />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <XCircle className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm">No submissions found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredSubmissions.map((s) => (
              <SubmissionItem
                key={s._id}
                submission={s}
                navigate={navigate}
                selectedFormats={selectedFormats}
                setSelectedFormats={setSelectedFormats}
                handleDownloadReport={handleDownloadReport}
                role={role}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
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
                  className={`px-3 py-1.5 rounded border text-sm font-medium ${pagination.page === i + 1
                      ? "bg-purple-600 border-purple-600 text-white"
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

        {/* Notification Modal */}
        {notification.show && (
          <NotificationModal
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
      </div>
      <BlockedSubmissions assignmentId={id} />
    </>
  );
};

export default Submissions;
