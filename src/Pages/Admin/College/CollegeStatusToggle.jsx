// Components/Admin/College/CollegeStatusToggle.jsx
import React, { useEffect, useState } from 'react';
import { deleteCollege } from '../../../Controllers/CollegeController';

const CollegeStatusToggle = ({ collegeId, isActiveInitial, fetchCollege }) => {
  const [status, setStatus] = useState(isActiveInitial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(isActiveInitial);
  }, [isActiveInitial]);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      await deleteCollege(collegeId, !status);
      await fetchCollege();
    } catch (err) {
      console.error('Failed to toggle college status', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-gray-700">Status</span>
      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
          status ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            status ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default CollegeStatusToggle;
