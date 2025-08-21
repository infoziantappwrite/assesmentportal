// src/pages/SuperAdmin/ManageColleges.jsx
import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table";
import CreateCollege from "../Buttons/CreateCollege";
import ViewCollege from "../Buttons/ViewCollege";
import { useNavigate } from "react-router-dom";
import { getAllColleges } from "../../../Controllers/CollegeController";
import Loader from "../../../Components/Loader";
import { Search, School, PlusCircle, ChevronDown, ToggleRight } from "lucide-react";
import { useDebounce } from "use-debounce"; // install: npm i use-debounce

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [total, setTotal] = useState(0);
  



  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
    limit: 10,
  });
  const [debouncedSearch] = useDebounce(filters.search, 1000);

  const navigate = useNavigate();

  // Fetch data from backend with params
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          search: debouncedSearch.trim() || "",
        };

         if (filters.status === "active") {
      params.isActive = "true";
    } else if (filters.status === "inactive") {
      params.isActive = "false";
    }

        const data = await getAllColleges(params);
        setColleges(data.colleges);
        setTotal(data.pagination.total);
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, [filters.page, filters.limit, debouncedSearch, filters.status]);

  const totalPages = Math.ceil(total / filters.limit);

  const columns = [
    {
      label: "S.No",
      render: (_, index) => (filters.page - 1) * filters.limit + index + 1,
    },
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
          onClick={() => navigate(`/admin/colleges/${row._id}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen ">
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6">
          {/* Header & Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 flex-wrap">
            <h1 className="text-lg font-semibold flex items-center gap-2 text-blue-500">
              <School className="w-5 h-5 text-blue-500" />
              Manage Colleges
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto flex-wrap">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                  }
                  placeholder="Search by college name or code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 shadow-xl bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-48">
                <ToggleRight className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                  }
                  className="w-full pl-9 pr-10 py-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-xl bg-green-600 text-white hover:bg-green-700 text-sm whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                Create College
              </button>
            </div>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            data={colleges}
            noDataText="No colleges found."
          />
        </div>
      )}

      {/* Pagination */}
      {!filters.search.trim() && totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center flex-wrap gap-2 px-4 py-2">
          {/* First */}
          <button
            className="px-3 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() => setFilters((prev) => ({ ...prev, page: 1 }))}
            disabled={filters.page === 1}
          >
            « First
          </button>

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
          <div className="flex items-center gap-1">
            {(() => {
              const isMobile = window.innerWidth < 640;
              const maxButtons = isMobile ? 3 : 5;

              let start = Math.max(filters.page - Math.floor(maxButtons / 2), 1);
              let end = start + maxButtons - 1;

              if (end > totalPages) {
                end = totalPages;
                start = Math.max(end - maxButtons + 1, 1);
              }

              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      filters.page === pageNum
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
              );
            })()}
          </div>

          {/* Next */}
          <button
            className="px-3 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.min(prev.page + 1, totalPages),
              }))
            }
            disabled={filters.page >= totalPages}
          >
            Next →
          </button>

          {/* Last */}
          <button
            className="px-3 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            onClick={() => setFilters((prev) => ({ ...prev, page: totalPages }))}
            disabled={filters.page === totalPages}
          >
            Last »
          </button>
        </div>
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
