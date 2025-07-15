import React, { useEffect, useState } from "react";
import { getSubmissions } from "../../../Controllers/AssignmentControllers";
import Loader from "../../../Components/Loader";

const Submissions = ({ id }) => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSubmissions(id, pagination.page, pagination.limit)
      .then((res) => {
        console.log(res)
        setSubmissions(res.message.submissions);
        setStatistics(res.message.statistics);
        setPagination((prev) => ({ ...prev, total: res.message.statistics.total }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, pagination.page, pagination.limit]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-3">Submissions</h3>
      {loading ? (
        <Loader />
      ) : submissions.length === 0 ? (
        <p className="text-sm text-gray-600">No submissions found.</p>
      ) : (
        <>
          <ul className="text-sm space-y-1 text-gray-700">
            {submissions.map((s) => (
              <li key={s._id}>
                {s.student?.name || "N/A"} – Status: {s.status}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: i + 1 }))
                  }
                  className={`px-3 py-1 rounded border ${
                    pagination.page === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Submissions;
