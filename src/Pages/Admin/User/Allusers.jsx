import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../Controllers/userControllers';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    role: '',
  });

  // Fetch data from backend (pagination only)
  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, [filters.page]);

  // Apply search and role filter in frontend
  useEffect(() => {
    let result = [...users];

    // Filter by role
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }

    // Filter by search keyword
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        All Users ({filteredUsers.length})
      </h2>

      {/* Filter controls */}
      <div className="flex gap-4 mb-4">
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="trainer">Trainer</option>
          <option value="college">College</option>
          <option value="candidate">Candidate</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="border p-2 rounded w-64"
        />
      </div>

      {/* User table */}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border capitalize">{user.role}</td>
                  <td className="p-2 border">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-between text-sm">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
            }
            disabled={filters.page <= 1}
          >
            Previous
          </button>
          <div>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={filters.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
