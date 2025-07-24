import React, { useEffect, useState } from "react";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import Loader from "../../../Components/Loader";
import { TimerIcon, UserIcon, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Submissions = ({ id }) => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getSubmissions(id, pagination.page, pagination.limit)
      .then((res) => {
        const stats = res.data.statistics || {};
        const subs = res.data.submissions || [];

        setSubmissions(subs);
        setStatistics(stats);
        setPagination((prev) => ({ ...prev, total: stats.total || 0 }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, pagination.page, pagination.limit]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="w-2 h-5 bg-purple-600 rounded-full mr-3"></span>
          Submissions
        </h3>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <Loader />
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <XCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-600">No submissions found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {submissions.map((s) => (
            <div
              key={s._id}
              className="px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserIcon size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {s.student_id?.name || "Unknown Student"}
                    </h4>
                    <p className="text-xs text-gray-500">Attempt #{s.attempt_number}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === "submitted"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="ml-11 pl-1">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>
                      {s.scores?.obtained_marks ?? 0}/{s.scores?.total_marks ?? 0} points
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TimerIcon size={14} className="text-blue-500" />
                    <span>{s.timing?.total_time_taken_minutes ?? "-"} min</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/submissions/${s._id}`)}
                  className="text-xs px-3 py-1.5 bg-white border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors font-medium"
                >
                  View Full Submission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-gray-200">
          <div className="flex justify-center gap-1">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                className={`px-3 py-1.5 rounded border text-sm font-medium ${pagination.page === i + 1
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
              disabled={pagination.page === totalPages}
              className="px-3 py-1.5 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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