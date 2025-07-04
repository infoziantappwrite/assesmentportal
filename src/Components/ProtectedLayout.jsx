import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header';
import { Menu } from 'lucide-react';
import { useUser } from '../context/UserContext';

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, user } = useUser();
  const isStudent = role === 'student';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile Header for toggling Sidebar */}
      {!isStudent && <Header />}
      {!isStudent && (
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white shadow z-30">
          <div className="text-sm font-medium text-gray-700">
            Welcome, <span className="font-semibold text-gray-900">{user?.name || 'User'}</span>
          </div>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Body layout with sidebar + content */}
      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Sidebar for non-students */}
        {!isStudent && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-4">
            <Outlet />
          </main>

          <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
            © {new Date().getFullYear()} Infoziant. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
