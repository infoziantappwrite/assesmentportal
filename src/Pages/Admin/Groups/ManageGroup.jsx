import React, { useEffect, useState } from "react";
import {
  Eye,
  PlusCircle,
  Trash2,
  Users,
  Search,
  GraduationCap,
  Calendar,
  ToggleRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllGroups, deleteGroupById } from "../../../Controllers/groupController";
import { getAllColleges } from "../../../Controllers/CollegeController";
import CreateGroupModal from "./CreateGroupModal";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";

const ManageGroup = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    collegeId: "all",
    batchYear: "all",
    status: "all",
  });

  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const [groupRes, collegeRes] = await Promise.all([
        getAllGroups(),
        getAllColleges(),
      ]);
      const groupList = groupRes?.data?.groups || [];
      const collegeList = collegeRes || [];

      setGroups(groupList);
      setFilteredGroups(groupList);
      setColleges(collegeList);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteGroupById(id);
      alert("Group deleted successfully!");
      fetchGroups();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete group");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    let data = [...groups];

    if (search.trim()) {
      data = data.filter((g) =>
        g.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (filters.collegeId !== "all") {
      data = data.filter((g) => g.college_id === filters.collegeId);
    }

    if (filters.batchYear !== "all") {
      data = data.filter((g) => String(g.batch_year) === filters.batchYear);
    }

    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      data = data.filter((g) => g.is_active === isActive);
    }

    setFilteredGroups(data);
  }, [search, filters, groups]);

  const columns = [
    { label: "Group Name", accessor: "name" },
    {
      label: "College",
      render: (row) =>
        colleges.find((c) => c._id === row.college_id)?.name || "—",
    },
    { label: "Department", accessor: "department" },
    { label: "Batch Year", accessor: "batch_year" },
    {
      label: "Students",
      render: (row) => <span>{row.student_count || 0}</span>,
    },
    {
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            onClick={() => navigate(`/admin/groups/${row._id}`)}
          >
            <Eye size={16} />
            View
          </button>
          <button
            className="text-red-600 hover:underline text-sm flex items-center gap-1"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const batchYears = [...new Set(groups.map((g) => g.batch_year))];

  return (
    <div className="p-6">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-600">
              <Users className="w-5 h-5 text-indigo-500" />
              Manage Groups
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              <PlusCircle size={16} />
              Create Group
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto mb-6">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search group name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white rounded-lg shadow border"
              />
            </div>

            {/* College */}
            <div className="relative w-full sm:w-48">
              <GraduationCap className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <select
                value={filters.collegeId}
                onChange={(e) => setFilters({ ...filters, collegeId: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg shadow border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Year */}
            <div className="relative w-full sm:w-40">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <select
                value={filters.batchYear}
                onChange={(e) => setFilters({ ...filters, batchYear: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg shadow border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Batches</option>
                {batchYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="relative w-full sm:w-40">
              <ToggleRight className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg shadow border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <Table columns={columns} data={filteredGroups} noDataText="No groups found." />

          {/* Modal */}
          {showCreateModal && (
            <CreateGroupModal
              onClose={() => setShowCreateModal(false)}
              onCreated={fetchGroups}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageGroup;
