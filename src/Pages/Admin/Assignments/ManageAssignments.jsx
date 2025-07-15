import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignments } from "../../../Controllers/AssignmentControllers";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import { Search, FileSignature, PlusCircle } from "lucide-react";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllAssignments(filters)
      .then((res) => {
        setAssignments(res.message.assignments || []);
        setPagination(res.message.pagination || {});
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch assignments.");
        console.error(err);
        setLoading(false);
      });
  }, [filters.page, filters.status]);

  useEffect(() => {
    let result = [...assignments];

    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(keyword)
      );
    }

    setFilteredAssignments(result);
  }, [assignments, filters.search]);

  const columns = [
    { label: "Title", accessor: "title" },
    {
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      label: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      label: "Action",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/assignments/${row._id}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
          <FileSignature className="w-5 h-5" />
          Manage Assignments
        </h2>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white rounded-lg shadow-lg border border-gray-200"
            />
          </div>

          {/* Create Assignment Button */}
          <button
            onClick={() => navigate("/admin/assignments/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-green-600 text-white hover:bg-green-700 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Table / Error */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center shadow">
          <h2 className="text-md font-semibold">Something went wrong</h2>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <Table columns={columns} data={filteredAssignments} />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center flex-wrap gap-2">
          {/* Prev */}
          <button
            className="px-3 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            disabled={filters.page <= 1}
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded-lg border text-sm ${
                  filters.page === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: pageNum,
                  }))
                }
              >
                {pageNum}
              </button>
            )
          )}

          {/* Next */}
          <button
            className="px-3 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            disabled={filters.page >= pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageAssignments;
