// components/ThankYou.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-50 to-teal-50 text-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
        <p className="text-gray-700 mb-6">You have successfully completed your test.</p>
        <button
          onClick={handleDashboard}
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-2 rounded text-sm font-medium transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
