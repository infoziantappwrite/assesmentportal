import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  RotateCcw,
  Search,
  ChevronsLeft,
  ChevronsRight,
  Users,
} from "lucide-react";

const mockGroups = Array.from({ length: 45 }, (_, i) => ({
  _id: i + 1,
  name: `Group ${i + 1}`,
  department: ["CSE", "ECE", "MECH", "EEE"][i % 4],
  batchYear: 2020 + (i % 4),
  studentCount: Math.floor(Math.random() * 50) + 10,
  collegeName: `College ${String.fromCharCode(65 + i % 5)}`,
}));

const Groups = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filteredGroups = mockGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.department.toLowerCase().includes(search.toLowerCase()) ||
      group.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      group.batchYear.toString().includes(search)
  );

  const totalPages = Math.ceil(filteredGroups.length / limit);
  const paginatedGroups = filteredGroups.slice((page - 1) * limit, page * limit);

  const handleReset = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <div className="p-6 bg-[#f9fcff] min-h-screen flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
            <Users size={24} /> Groups
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/create-group")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-md shadow-sm"
            >
              <Plus size={16} /> Create Group
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md shadow-sm">
              <Filter size={16} /> Filters
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-md shadow-sm"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, department, batch or college"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Group Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm bg-white border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm">
              <tr>
                <th className="px-5 py-3 font-medium">Group Name</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Batch</th>
                <th className="px-5 py-3 font-medium">Students</th>
                <th className="px-5 py-3 font-medium">College</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.length > 0 ? (
                paginatedGroups.map((group) => (
                  <tr
                    key={group._id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition"
                  >
                    <td className="px-5 py-3">{group.name}</td>
                    <td className="px-5 py-3">{group.department}</td>
                    <td className="px-5 py-3">{group.batchYear}</td>
                    <td className="px-5 py-3">{group.studentCount}</td>
                    <td className="px-5 py-3">{group.collegeName}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {/* View */}
                        <button
                          onClick={() => navigate("/view-group", { state: group })}
                          className="p-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/edit-group`)}
                          className="p-2 rounded-full border border-green-500 text-green-600 hover:bg-green-100 transition"
                        >
                          <Edit size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => console.log("Delete group", group._id)}
                          className="p-2 rounded-full border border-red-500 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-gray-500">
                    No groups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-sm px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
          >
            <ChevronsLeft size={16} /> Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-sm px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
          >
            Next <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Groups;
