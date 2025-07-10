import React, { useState, useEffect } from 'react';
import { activateUserById } from '../../../Controllers/userControllers';

const UserStatusToggle = ({ userId, isActiveInitial, fetchUser }) => {
  const [status, setStatus] = useState(isActiveInitial);
  const [loading, setLoading] = useState(false);

  // ✅ Sync with parent whenever isActiveInitial changes
  useEffect(() => {
    setStatus(isActiveInitial);
  }, [isActiveInitial]);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const res = await activateUserById(userId, !status);
      console.log('User status updated:', res);
      await fetchUser(); // ensures latest data is loaded
    } catch (err) {
      console.error('Failed to update user status', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4 px-2">
      <span className="text-sm font-medium text-gray-700">Account Status</span>

      <button
        onClick={toggleStatus}
        disabled={loading}
        aria-label="Toggle account status"
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

export default UserStatusToggle;
