// src/pages/SuperAdmin/ManageColleges.jsx
import React, { useState, useEffect } from "react";
import Table from "../../Components/Table";
import CreateCollege from "./Buttons/CreateCollege";
import ViewCollege from "./Buttons/ViewCollege";
import { useNavigate } from "react-router-dom";
import { getAllColleges } from "../../Controllers/CollegeController";
import Loader from "../../Components/Loader";
import { Search } from "lucide-react";

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await getAllColleges();
        setColleges(data);
        setFilteredColleges(data);
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    let filtered = [...colleges];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((c) => c.is_active === isActive);
    }

    setFilteredColleges(filtered);
  }, [search, statusFilter, colleges]);

  const columns = [
    { label: "S.No", accessor: "_id", render: (_, index) => index + 1 },
    { label: "College Name", accessor: "name" },
    { label: "Code", accessor: "code" },
    {
      label: "Email",
      accessor: "contact.email",
      render: (row) => row.contact?.email || "-",
    },
    { label: "Total Students", accessor: "total_students" },
    {
      label: "Status",
      accessor: "is_active",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
        <button
          onClick={() => handleViewCollege(row._id)}
          className="text-indigo-600 hover:underline text-sm font-medium"
        >
          View
        </button>
      ),
    },
  ];

  const handleViewCollege = (id) => {
    navigate(`/admin/colleges/${id}`);
  };

  return (
    <div className="relative min-h-screen p-6">
      
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Manage Colleges</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow"
          >
            + Create College
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college name or code..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <Table columns={columns} data={filteredColleges} noDataText="No colleges found." />
        )}


      {/* Modals */}
      {showCreateModal && (
        <CreateCollege onClose={() => setShowCreateModal(false)} />
      )}

      {selectedCollegeId && (
        <ViewCollege
          id={selectedCollegeId}
          onClose={() => setSelectedCollegeId(null)}
        />
      )}
    </div>
  );
};

export default ManageColleges;
