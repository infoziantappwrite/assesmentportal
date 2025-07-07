import React from 'react';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg ring-1 ring-blue-300 border border-gray-200 p-10 rounded-2xl max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full">
            <ShieldOff className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-blue-800 mb-2">Access Denied</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">You are not authorized to view this page.</h2>
        <p className="text-gray-600 mb-6">
          Please contact your administrator if you believe this is a mistake.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-medium px-5 py-2 rounded-lg hover:opacity-90 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
