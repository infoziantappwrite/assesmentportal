import React, { useEffect, useState } from 'react';
import { XCircle, Search, UserRoundCheck, LoaderCircle } from 'lucide-react';
import { getAllUsers } from "../../../Controllers/userControllers"; // Ensure this exists

const SelectStudentModal = ({ onSelect, onClose }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const data = res.data?.users || [];
        const candidates = data.filter(user => user.role === "candidate");
        setStudents(candidates);
        setFilteredStudents(candidates);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = students.filter((user) =>
      user.name.toLowerCase().includes(keyword)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleSelect = () => {
    if (selectedId) {
      const selectedStudent = students.find((u) => u._id === selectedId);
      onSelect({ id: selectedStudent._id, name: selectedStudent.name });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative border border-green-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
          <UserRoundCheck className="w-5 h-5 text-green-600" />
          Select a Student (Candidate)
        </h2>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* User List */}
        {loading ? (
          <div className="flex justify-center py-6">
            <LoaderCircle className="w-6 h-6 animate-spin text-green-500" />
          </div>
        ) : (
          <div className="space-y-2 max-h-44 overflow-y-auto custom-scroll pr-1">
            {filteredStudents.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                No students found.
              </div>
            ) : (
              filteredStudents.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition text-sm"
                >
                  <input
                    type="radio"
                    name="student"
                    value={user._id}
                    checked={selectedId === user._id}
                    onChange={() => setSelectedId(user._id)}
                    className="accent-green-600"
                  />
                  <span className="text-gray-800">
                    {user.name} {user.email && `(${user.email})`}
                  </span>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectStudentModal;
