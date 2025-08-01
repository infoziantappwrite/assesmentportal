import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignments } from "../../../Controllers/AssignmentControllers";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import { Search, FileCheck2 } from "lucide-react";
import { useUser } from '../../../context/UserContext';

const Results = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { role } = useUser();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError("");

      try {
        let fetchedAssignments = [];

        if (!filters.status) {
          // If no status, fetch both active and completed
          const [activeRes, completedRes] = await Promise.all([
            getAllAssignments({ ...filters, status: "active" }),
            getAllAssignments({ ...filters, status: "completed" }),
          ]);

          fetchedAssignments = [
            ...(activeRes.data?.assignments || []),
            ...(completedRes.data?.assignments || []),
          ];

          setPagination({
            totalPages: 1,
            totalItems: fetchedAssignments.length,
          });
        } else {
          const res = await getAllAssignments(filters);
          fetchedAssignments = res.data?.assignments || [];
          setPagination(res.data.pagination || {});
        }

        setAssignments(fetchedAssignments);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
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
      label: "Assigned By",
      render: (row) => {
        const assignedBy = row.assigned_by;
        if (!assignedBy) return "—";
        return (
          <div className="text-sm text-gray-700">
            <span className="font-medium">{assignedBy.name}</span>
          </div>
        );
      },
    },
    {
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${row.status === "active"
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
          onClick={() => navigate(`/${role}/result/${row._id}`)}
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
  {/* Left: Title */}
  <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
    <FileCheck2 className="w-5 h-5" />
    All Results
  </h2>

  {/* Right: Search + Status Filter */}
  <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-3">
    {/* Search Bar */}
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search by title"
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg shadow-lg bg-white border border-gray-300"
      />
    </div>

    {/* Status Dropdown */}
    <select
      value={filters.status}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
      }
      className="w-full sm:w-auto border border-gray-300 px-4 py-2 text-sm rounded-lg shadow-lg bg-white text-gray-700 focus:outline-none"
    >
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
    </select>
  </div>
</div>


      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center shadow">
          <h2 className="text-md font-semibold">Something went wrong</h2>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <Table columns={columns} data={filteredAssignments} />
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center flex-wrap gap-2">
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

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded-lg border text-sm ${filters.page === pageNum
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-blue-50"
                  }`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: pageNum }))
                }
              >
                {pageNum}
              </button>
            )
          )}

          <button
            className="px-3 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))}
            disabled={filters.page >= pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Results;
