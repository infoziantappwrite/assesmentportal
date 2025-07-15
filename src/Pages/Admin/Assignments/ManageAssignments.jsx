import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignments } from "../../../Controllers/AssignmentControllers";
import { getAllColleges } from "../../../Controllers/CollegeController";
import { getAllGroups } from "../../../Controllers/groupController";
import { getAllUsers } from "../../../Controllers/userControllers";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import {
  Search,
  FileSignature,
  PlusCircle,
  Filter,
  XCircle,
} from "lucide-react";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    collegeId: "",
    groupId: "",
    studentId: "",
    assignedBy: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [assignedByUsers, setAssignedByUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllColleges().then((res) => setColleges(res || []));
    getAllGroups().then((res) => setGroups(res.data?.groups || []));
    getAllUsers().then((res) =>
      setStudents((res.data?.users || []).filter((u) => u.role === "candidate"))
    );
  }, []);

useEffect(() => {
  getAllAssignments(filters)
    .then((res) => {
      const fetchedAssignments = res.message.assignments || [];
      setAssignments(fetchedAssignments);
      setPagination(res.message.pagination || {});
      setError("");

      // 🔹 Extract unique assigned_by users
      const uniqueAssignedBy = Array.from(
        new Map(
          fetchedAssignments
            .filter((a) => a.assigned_by) // ensure it's present
            .map((a) => [a.assigned_by._id, a.assigned_by])
        ).values()
      );
      console.log(uniqueAssignedBy)
      setAssignedByUsers(uniqueAssignedBy); // 👈 add this state

      setLoading(false);
    })
    .catch((err) => {
      setError("Failed to fetch assignments.");
      console.error(err);
      setLoading(false);
    });
}, [filters.page, filters.status, filters.collegeId, filters.groupId, filters.studentId, filters.assignedBy]);


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

  const handleClearFilters = () => {
    setFilters({
      ...filters,
      status: "",
      collegeId: "",
      groupId: "",
      studentId: "",
      assignedBy: "",
    });
  };

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
          onClick={() => navigate(`/admin/assignments/${row._id}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>
      ),
    },
  ];

  if (loading){
return (<Loader />);
  } 

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        {/* Left Heading */}
        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
          <FileSignature className="w-5 h-5" />
          Manage Assignments
        </h2>

        {/* Right Controls */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input - full width on mobile */}
          <div className="relative w-full">
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

          {/* Button Row - buttons take half width on mobile */}
          <div className="w-full flex gap-3 sm:w-auto">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 rounded-lg shadow text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Create Button */}
            <button
              onClick={() => navigate("/admin/assignments/create")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>
      </div>


      {/* Filter Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">
          {/* College Filter */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">College</label>
            <select
              value={filters.collegeId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, collegeId: e.target.value }))
              }
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">All Colleges</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Group Filter */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">Group</label>
            <select
              value={filters.groupId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, groupId: e.target.value }))
              }
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">All Groups</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Filter */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">Student</label>
            <select
              value={filters.studentId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, studentId: e.target.value }))
              }
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">All Students</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>


          {/* AssignedBy Filter */}
          <div>
  <label className="block text-sm mb-1 text-gray-600">Assigned By</label>
  <select
    value={filters.assignedBy}
    onChange={(e) =>
      setFilters((prev) => ({ ...prev, assignedBy: e.target.value }))
    }
    className="w-full border border-gray-300 p-2 rounded-lg"
  >
    <option value="">All</option>
    {assignedByUsers.map((user) => (
      <option key={user._id} value={user._id}>
        {user.name} ({user.email})
      </option>
    ))}
  </select>
</div>


          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="flex items-center w-full gap-2 px-4 py-2 bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 rounded-lg text-sm"
            >
              <XCircle className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
      )}


      {/* Table or Error */}
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
