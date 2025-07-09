import React, { useEffect, useState } from 'react';
import { XCircle, School, Search, LoaderCircle } from 'lucide-react';
import { getAllColleges } from '../../../Controllers/CollegeController';

const SelectCollegeModal = ({ onSelect, onClose }) => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllColleges()
      .then((res) => {
        const data = res || [];
        setColleges(data);
        setFilteredColleges(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching colleges:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = colleges.filter((c) =>
      c.name.toLowerCase().includes(keyword)
    );
    setFilteredColleges(filtered);
  }, [searchTerm, colleges]);

  const handleSelect = () => {
    if (selectedId) {
      const selectedCollege = colleges.find((c) => c._id === selectedId);
      onSelect({ id: selectedCollege._id, name: selectedCollege.name });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative border border-blue-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <School className="w-5 h-5 text-blue-600" />
          Select a College
        </h2>

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
          <div className="flex justify-center py-6">
            <LoaderCircle className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-2 max-h-44 overflow-y-auto custom-scroll pr-1">
            {filteredColleges.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                No colleges found.
              </div>
            ) : (
              filteredColleges.map((college) => (
                <label
                  key={college._id}
                  className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition text-sm"
                >
                  <input
                    type="radio"
                    name="college"
                    value={college._id}
                    checked={selectedId === college._id}
                    onChange={() => setSelectedId(college._id)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-800">{college.name}</span>
                </label>
              ))
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCollegeModal;
