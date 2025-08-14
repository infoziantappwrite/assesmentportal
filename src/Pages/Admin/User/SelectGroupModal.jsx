import React, { useEffect, useState } from 'react';
import { XCircle, Users, Search, LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllGroups } from "../../../Controllers/groupController"; // Make sure this exists

const SelectGroupModal = ({ onSelect, onClose }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  const fetchGroups = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.pageSize
      };
      
      // Add search parameter if search term exists
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await getAllGroups(params);
      const data = res.data?.groups || [];
      const paginationData = res.data?.pagination || {};
      
      setGroups(data);
      setFilteredGroups(data);
      setPagination({
        currentPage: paginationData.page || 1,
        totalPages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / pagination.pageSize),
        totalCount: paginationData.total || 0,
        pageSize: pagination.pageSize
      });
    } catch (err) {
      console.error('Error fetching groups:', err);
      setGroups([]);
      setFilteredGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(1, ''); // Initial load
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchGroups(1, searchTerm); // Reset to page 1 when searching
      } else {
        fetchGroups(1, ''); // Fetch all when search is cleared
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchGroups(newPage, searchTerm);
    }
  };

  const handleSelect = () => {
    if (selectedId) {
      const selectedGroup = groups.find((g) => g._id === selectedId);
      onSelect({ id: selectedGroup._id, name: selectedGroup.name });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative border border-pink-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Heading with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pink-700 flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-600" />
            Select a Group
          </h2>
          
          {/* Simple Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              {!loading && `${pagination.currentPage} / ${pagination.totalPages}`}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-gray-600 mb-3">
            Showing {filteredGroups.length} of {pagination.totalCount} groups
          </p>
        )}

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Group List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <LoaderCircle className="w-6 h-6 animate-spin text-pink-500" />
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll pr-1 mb-4">
            {filteredGroups.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                {searchTerm ? 'No groups found matching your search.' : 'No groups found.'}
              </div>
            ) : (
              filteredGroups.map((group) => (
                <label
                  key={group._id}
                  className="flex items-center gap-3 px-3 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition text-sm"
                >
                  <input
                    type="radio"
                    name="group"
                    value={group._id}
                    checked={selectedId === group._id}
                    onChange={() => setSelectedId(group._id)}
                    className="accent-pink-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{group.name}</div>
                    <div className="text-xs text-gray-500">
                      {group.department && `${group.department}`}
                      {group.batch_year && ` • ${group.batch_year}`}
                      {group.student_ids && ` • ${group.student_ids.length} students`}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedId}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectGroupModal;
