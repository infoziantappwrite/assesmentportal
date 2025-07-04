import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Sidebar from '../Components/Sidebar/Sidebar';
import { useUser } from '../context/UserContext';

const ProtectedLayout = () => {
  const { role } = useUser();
  const isStudent = role === 'student';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Full-width fixed Header */}
      <header className="w-full z-30 bg-white border-b border-gray-200 shadow">
        <Header />
      </header>

      {/* Body layout with sidebar + content */}
      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Sidebar on the left (below header) */}
        {!isStudent && (
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
            <Sidebar />
          </aside>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-4">
            <Outlet />
          </main>

          {/* Footer after content scroll */}
          <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
            © {new Date().getFullYear()} Infoziant. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
