import React, { useEffect, useState } from "react";
import { getEligibleStudents } from "../../../Controllers/AssignmentControllers";
import Loader from "../../../Components/Loader";

const EligibleStudents = ({ id }) => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEligibleStudents(id, pagination.page, pagination.limit)
      .then((res) => {
        setStudents(res.message.students);
        setPagination((prev) => ({ ...prev, total: res.message.total }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, pagination.page, pagination.limit]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : students.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No eligible students found.</p>
      ) : (
        <div className="border-purple-300 bg-purple-50 rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2 select-none">
            Eligible Students
          </h3>

          <ul className="space-y-3 text-sm text-gray-800">
            {students.map((s) => (
              <li
                key={s._id}
                className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg select-text">
                  {s.email}
                </span>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                  className={`px-4 py-2 rounded-full transition-all text-sm font-medium border focus:outline-none ${
                    pagination.page === i + 1
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibleStudents;
