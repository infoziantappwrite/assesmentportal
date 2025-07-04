import React from 'react';
import { useUser } from '../../context/UserContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  UserCheck,
  School,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { role, user } = useUser();
  const location = useLocation();

  if (!role || role === 'student') return null;

  const navItems = {
    admin: [
      { label: 'Dashboard', to: '/superadmin/dashboard', icon: LayoutDashboard },
      { label: 'Manage Colleges', to: '/superadmin/colleges', icon: School },
      { label: 'Manage Users', to: '/superadmin/users', icon: Users },
      { label: 'Reports', to: '/superadmin/reports', icon: FileText },
      { label: 'Settings', to: '/superadmin/settings', icon: UserCheck },
    ],
    college: [
      { label: 'Dashboard', to: '/college/dashboard', icon: LayoutDashboard },
      { label: 'Courses', to: '/college/courses', icon: BookOpen },
      { label: 'Trainers', to: '/college/trainers', icon: UserCheck },
      { label: 'Students', to: '/college/students', icon: GraduationCap },
      { label: 'Assessments', to: '/college/assessments', icon: FileText },
    ],
    trainer: [
      { label: 'Dashboard', to: '/trainer/dashboard', icon: LayoutDashboard },
      { label: 'My Courses', to: '/trainer/courses', icon: BookOpen },
      { label: 'Assessments', to: '/trainer/assessments', icon: FileText },
      { label: 'Students', to: '/trainer/students', icon: GraduationCap },
    ],
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
      `}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <p className="text-sm text-gray-500">Welcome,</p>
          <p className="text-base font-semibold text-gray-800 truncate w-44">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-400 capitalize">Role: {role}</p>
        </div>
        {isMobile && (
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {navItems[role]?.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                 {Icon && <Icon className="w-5 h-5" />}
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
