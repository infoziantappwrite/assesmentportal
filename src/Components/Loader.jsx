import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 flex items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center space-y-6">
        {/* Gradient spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin border-gradient border-blue-400 to-teal-500 bg-gradient-to-tr from-blue-400 via-teal-400 to-blue-400 shadow-xl" />

        {/* Text shimmer */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 text-lg font-semibold animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loader;
