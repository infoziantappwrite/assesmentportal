import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Trainer = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('trainerAuth');
  const trainerEmail = localStorage.getItem('trainerEmail');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/trainer/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('trainerAuth');
    localStorage.removeItem('trainerEmail');
    navigate('/trainer/login');
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-slate text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-lg flex flex-col p-4">
        <div className="flex flex-col items-center mb-8">
          <img src="/Logo.png" alt="Logo" className="h-12 w-auto mb-2" />
          <h2 className="text-xl font-bold text-blue-800">Trainer Panel</h2>
          <p className="text-xs text-gray-500">{trainerEmail}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            to="dashboard"
            className="px-4 py-2 rounded hover:bg-blue-100 transition"
          >
            Dashboard
          </Link>
          <Link
            to="create-test"
            className="px-4 py-2 rounded hover:bg-blue-100 transition"
          >
            Create Test
          </Link>
          <Link
            to="view-test"
            className="px-4 py-2 rounded hover:bg-blue-100 transition"
          >
            View Test
          </Link>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Trainer;
