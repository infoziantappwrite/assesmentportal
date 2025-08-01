import React, { useEffect, useState } from "react";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import Loader from "../../../Components/Loader";
import { TimerIcon, UserIcon, CheckCircle2, XCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  generateUserActivityReport,
  downloadReport
} from "../../../Controllers/reportsController";

const Submissions = ({ id }) => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [selectedFormats, setSelectedFormats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getSubmissions(id, pagination.page, pagination.limit)
      .then((res) => {
        const stats = res.data.statistics || {};
        const subs = res.data.submissions || [];
        setSubmissions(subs);
        setFiltered(subs);
        setPagination((prev) => ({ ...prev, total: stats.total || 0 }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, pagination.page, pagination.limit]);

  useEffect(() => {
    if (!search) {
      setFiltered(submissions);
    } else {
      const filteredList = submissions.filter((s) =>
        s.student_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredList);
    }
  }, [search, submissions]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handleDownloadReport = async (submissionId, format = "excel") => {
    try {
      const res = await generateUserActivityReport(submissionId, format);
      const exportLogId = res.data?.exportLogId;
      if (res?.data?.exportLogId) {
        setTimeout(async () => {
          try {
            await downloadReport(exportLogId);
          } catch (err) {
            console.error("Download failed:", err.message);
            alert("Report generation started. Try downloading again in a few seconds.");
          }
        }, 3000);
      } else {
        alert("Report queued. Try again in a few seconds.");
      }
    } catch (err) {
      console.error("Report generation failed:", err.response?.data || err.message);
      alert("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-pruple-50 to-white rounded-xl border border-purple-200  shadow-l overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-2 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mr-3"></span>
          Submissions
        </h3>
        <div className="relative">
          <input
            type="text"
      placeholder="Search by name or email..."
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-80"
      value={search}
            onChange={(e) => setSearch(e.target.value)}
            
          />
          
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <XCircle className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm">No submissions found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="px-5 py-4 hover:bg-gradient-to-br from-purple-50 to-indigo-50 transition-all duration-200"
            >
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
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${s.status === "submitted"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {s.status}
                </span>
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
                        [s._id]: e.target.value,
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
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-center gap-1">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
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
                    page: i + 1,
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
    </div>
  );
};

export default Submissions;
