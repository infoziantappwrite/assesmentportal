import React, { useEffect, useState } from "react";
import {
  XCircle,
  Search,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllUsers } from "../../../Controllers/userControllers";
import { addStudentsToGroup } from "../../../Controllers/groupController";

const AddStudentsToGroup = ({
  groupId,
  existingStudentIds = [],
  onClose,
  onSuccess,
}) => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20,
  });

  const fetchStudents = async (page = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.pageSize,
        role: "candidate",
        search: searchTerm.trim() || undefined,
      };

      const res = await getAllUsers(params);
      const data = res?.data?.users || [];
      const paginationData = res?.data?.pagination || {};

      // filter out already assigned
      const filtered = data.filter((stu) => !existingStudentIds.includes(stu._id));

      setStudents(filtered);
      setPagination({
        currentPage: paginationData.currentPage || 1,
        totalPages: paginationData.totalPages || 1,
        totalCount: paginationData.totalCount || 0,
        pageSize: paginationData.pageSize || 10,
      });
    } catch (err) {
      console.error("Error fetching students", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1, "");
  }, [existingStudentIds]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents(1, search);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchStudents(newPage, search);
    }
  };

  const handleSubmit = async () => {
    try {
      await addStudentsToGroup(groupId, selected);
      onSuccess(selected);
      onClose();
    } catch (err) {
      console.error("Error adding students to group", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative border border-indigo-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Add Students to Group
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Student list */}
        {loading ? (
          <div className="flex justify-center py-8">
            <LoaderCircle className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            No students available to add.
          </p>
        ) : (
          <div className="max-h-80  overflow-y-auto border-gray-300 space-y-2 border p-3 rounded-md">
            {students.map((stu) => (
              <label
                key={stu._id}
                className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(stu._id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelected((prev) =>
                      checked
                        ? [...prev, stu._id]
                        : prev.filter((id) => id !== stu._id)
                    );
                  }}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm">
                  {stu.name}{" "}
                  <span className="text-xs text-gray-500">({stu.email})</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Footer row with pagination (left) and buttons (right) */}
<div className="flex justify-between items-center mt-4">
  {/* Pagination (left side) */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => handlePageChange(pagination.currentPage - 1)}
      disabled={pagination.currentPage === 1}
      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
    <span className="text-sm text-gray-600">
      {pagination.currentPage} / {pagination.totalPages}
    </span>
    <button
      onClick={() => handlePageChange(pagination.currentPage + 1)}
      disabled={pagination.currentPage >= pagination.totalPages}
      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>

  {/* Footer buttons (right side) */}
  <div className="flex gap-2">
    <button
      onClick={onClose}
      className="px-4 py-2 bg-white border border-gray-300 text-sm rounded-md hover:bg-gray-100"
    >
      Cancel
    </button>
    <button
      onClick={handleSubmit}
      disabled={selected.length === 0}
      className={`px-4 py-2 text-sm rounded-md text-white ${
        selected.length > 0
          ? "bg-indigo-600 hover:bg-indigo-700"
          : "bg-indigo-300 cursor-not-allowed"
      }`}
    >
      Add Selected ({selected.length})
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default AddStudentsToGroup;
