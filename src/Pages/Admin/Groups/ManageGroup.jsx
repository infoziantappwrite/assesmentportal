import React, { useEffect, useState } from "react";
import {
  Eye,
  PlusCircle,
  Trash2,
  UserSquare,
  Search,
  ToggleRight,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAllGroups,
  deleteGroupById,
} from "../../../Controllers/groupController";
import { getAllColleges } from "../../../Controllers/CollegeController";
import CreateGroupModal from "./CreateGroupModal";
import Table from "../../../Components/Table";
import Loader from "../../../Components/Loader";
import { useUser } from '../../../context/UserContext';

const ManageGroup = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();
    const { role } = useUser();

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    try {
      await deleteGroupById(id);
      fetchGroups();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();

    const filtered = groups.filter((group) => {
      const college = colleges.find((c) => c._id === group.college_id);
      const collegeName = college?.name?.toLowerCase() || "";
      const batchYear = String(group.batch_year);

      const matchesSearch =
        group.name.toLowerCase().includes(lowerSearch) ||
        collegeName.includes(lowerSearch) ||
        batchYear.includes(lowerSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && group.is_active) ||
        (statusFilter === "inactive" && !group.is_active);

      return matchesSearch && matchesStatus;
    });

    setFilteredGroups(filtered);
    setCurrentPage(1); // reset page when filters change
  }, [search, statusFilter, groups, colleges]);

  // ✅ Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            row.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
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
            onClick={() => navigate(`/${role}/groups/${row._id}`)}
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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6">
          {/* ✅ Header + Filters Row */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-500">
              <UserSquare className="w-5 h-5 text-blue-500" />
              Manage Groups
            </h2>

            <div className="flex flex-wrap items-center gap-3 ml-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 " />
                <input
                  type="text"
                  placeholder="Search by name, college, or batch year"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white rounded-lg shadow-md border border-gray-200"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-48">
                <ToggleRight className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-green-600 text-white hover:bg-green-700 text-sm whitespace-nowrap"
              >
                <PlusCircle size={16} />
                Create Group
              </button>
            </div>
          </div>

          {/* ✅ Table */}
          <Table
            columns={columns}
            data={paginatedGroups}
            noDataText="No groups found."
          />

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2 text-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* ✅ Modal */}
          {showCreateModal && (
            <CreateGroupModal
              onClose={() => setShowCreateModal(false)}
              onCreated={fetchGroups}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageGroup;
