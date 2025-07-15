import React, { useEffect, useState } from 'react';
import { XCircle, Users, Search, LoaderCircle } from 'lucide-react';
import { getAllGroups } from "../../../Controllers/groupController"; // Make sure this exists

const SelectGroupModal = ({ onSelect, onClose }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllGroups()
      .then((res) => {
        const data = res.data?.groups || [];
        setGroups(data);
        //console.log(data);
        setFilteredGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching groups:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = groups.filter((g) =>
      g.name.toLowerCase().includes(keyword)
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  const handleSelect = () => {
    if (selectedId) {
      const selectedGroup = groups.find((g) => g._id === selectedId);
      onSelect({ id: selectedGroup._id, name: selectedGroup.name });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative border border-pink-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-bold mb-4 text-pink-700 flex items-center gap-2">
          <Users className="w-5 h-5 text-pink-600" />
          Select a Group
        </h2>

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
          <div className="flex justify-center py-6">
            <LoaderCircle className="w-6 h-6 animate-spin text-pink-500" />
          </div>
        ) : (
          <div className="space-y-2 max-h-44 overflow-y-auto custom-scroll pr-1">
            {filteredGroups.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                No groups found.
              </div>
            ) : (
              filteredGroups.map((group) => (
                <label
                  key={group._id}
                  className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition text-sm"
                >
                  <input
                    type="radio"
                    name="group"
                    value={group._id}
                    checked={selectedId === group._id}
                    onChange={() => setSelectedId(group._id)}
                    className="accent-pink-600"
                  />
                  <span className="text-gray-800">
                    {group.name} {group.department && `(${group.department})`}
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
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectGroupModal;
