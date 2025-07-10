import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../Controllers/userControllers';
import { useNavigate } from 'react-router-dom';
import Table from '../../../Components/Table';
import Loader from '../../../Components/Loader';

import { Search, ShieldPlus, UserPlus, Users } from 'lucide-react';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,Setloading]=useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    role: '',
  });

  useEffect(() => {
    getAllUsers({
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
      .then((res) => {
        const data = res.data.users || [];
        setUsers(data);
        setPagination(res.data.pagination || {});
        Setloading(false);
         setError('');
      })
      .catch((err) => {
         setError('Something went wrong while fetching users.');
         Setloading(false);
        console.error('Failed to fetch users:', err);
      });
  }, [filters.page]);

  useEffect(() => {
    let result = [...users];

    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }

    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword)
      );
    }

    setFilteredUsers(result);
  }, [users, filters.role, filters.search]);

 const roleLabels = {
  admin: 'Admin',
  trainer: 'Trainer',
  college_rep: 'College Rep',
  candidate: 'Candidate',
};

const columns = [
  { label: 'Name', accessor: 'name' },
  { label: 'Email', accessor: 'email' },
  {
    label: 'Role',
    render: (row) => roleLabels[row.role] || 'Unknown',
  },
  {
    label: 'Status',
    render: (row) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {row.is_active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    label: 'Created',
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    label: 'Action',
    render: (row) => (
      <button
        onClick={() => navigate(`/admin/users/${row._id}`)}
        className="text-blue-600 hover:underline text-sm"
      >
        View
      </button>
    ),
  },
];

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="p-6">
      {/* Header + Filters + Button Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">

        {/* Title Section */}
        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-500">
          <Users className="w-5 h-5 text-blue-500" />
          Manage Users

        </h2>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name or email"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white rounded-lg shadow-lg border border-gray-200"
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative w-full sm:w-40">
            <ShieldPlus className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
              <option value="college_rep">College Rep</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => navigate('/admin/users/create')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-green-600 text-white hover:bg-green-700 text-sm whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>




      {/* Table */}

      {error ? (
  <div className="p-4 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center shadow">
    <h2 className="text-md font-semibold">Something went wrong</h2>
    <p className="text-sm">{error}</p>
  </div>
) : (
  <Table columns={columns} data={filteredUsers} />
)}



      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center  items-center flex-wrap gap-2  px-4 py-2">

          {/* Previous */}
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
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded-lg border text-sm ${filters.page === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-blue-50'
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
            ))}
          </div>

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

export default AllUsers;
