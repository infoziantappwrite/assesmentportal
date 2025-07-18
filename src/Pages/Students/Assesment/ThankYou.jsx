import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRightCircle } from 'lucide-react';

const ThankYou = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    localStorage.clear();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>

        {/* Title & Message */}
        <h1 className="text-3xl font-extrabold text-green-700 mb-2">Thank You!</h1>
        <p className="text-gray-700 mb-4 text-sm">
          You have successfully submitted your assessment.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You can now safely exit and return to your dashboard.
        </p>

        {/* Dashboard Button */}
        <button
          onClick={handleGoToDashboard}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
        >
          <ArrowRightCircle className="w-4 h-4" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
