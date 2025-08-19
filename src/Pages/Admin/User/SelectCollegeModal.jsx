import React, { useEffect, useState } from 'react';
import { XCircle, School, Search, LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllColleges } from '../../../Controllers/CollegeController';

const SelectCollegeModal = ({ onSelect, onClose }) => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  const fetchColleges = async (page = 1, search = '') => {
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

      const res = await getAllColleges(params);
      const data = res.colleges || [];
      const paginationData = res.pagination || {};
      
      setColleges(data);
      setFilteredColleges(data);
      setPagination({
        currentPage: paginationData.page || 1,
        totalPages: Math.ceil((paginationData.total || 0) / paginationData.limit) || 1,
        totalCount: paginationData.total || 0,
        pageSize: paginationData.limit || 10
      });
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setColleges([]);
      setFilteredColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges(1, ''); // Initial load
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchColleges(1, searchTerm); // Reset to page 1 when searching
      } else {
        fetchColleges(1, ''); // Fetch all when search is cleared
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchColleges(newPage, searchTerm);
    }
  };

  const handleSelect = () => {
    if (selectedId) {
      const selectedCollege = colleges.find((c) => c._id === selectedId);
      onSelect({ id: selectedCollege._id, name: selectedCollege.name });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative border border-blue-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Heading with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            Select a College
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
            Showing {filteredColleges.length} of {pagination.totalCount} colleges
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
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* College List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <LoaderCircle className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll pr-1 mb-4">
            {filteredColleges.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                {searchTerm ? 'No colleges found matching your search.' : 'No colleges found.'}
              </div>
            ) : (
              filteredColleges.map((college) => (
                <label
                  key={college._id}
                  className="flex items-center gap-3 px-3 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition text-sm"
                >
                  <input
                    type="radio"
                    name="college"
                    value={college._id}
                    checked={selectedId === college._id}
                    onChange={() => setSelectedId(college._id)}
                    className="accent-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{college.name}</div>
                    <div className="text-xs text-gray-500">
                      {college.code && `Code: ${college.code}`}
                      {college.address?.city && ` • ${college.address.city}`}
                      {college.total_students !== undefined && ` • ${college.total_students} students`}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCollegeModal;
