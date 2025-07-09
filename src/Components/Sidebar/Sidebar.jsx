import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  Users2,
  ClipboardList,
  FileSignature,
  Inbox,
  BarChart2,
  FileBarChart,
  UserCircle,
  UserSquare 
} from 'lucide-react';


const Sidebar = ({ isOpen, onClose }) => {
  const { role, user } = useUser();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!role || role === 'student') return null;

  const navItems = {
    admin: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, gradient: 'from-purple-200 to-pink-100' },
      { label: 'Manage Colleges', to: '/admin/colleges', icon: School, gradient: 'from-blue-200 to-cyan-100' },
      { label: 'Manage Users', to: '/admin/users', icon: Users, gradient: 'from-green-200 to-emerald-100' },
      { label: 'Manage Group', to: '/admin/group', icon: UserSquare, gradient: 'from-yellow-200 to-amber-100', },
      { label: 'Reports', to: '/admin/reports', icon: FileText, gradient: 'from-orange-200 to-red-100' },
      { label: 'Settings', to: '/admin/settings', icon: UserCheck, gradient: 'from-indigo-200 to-purple-100' },
    ],
    college: [
      { label: 'Dashboard', to: '/college/dashboard', icon: LayoutDashboard, gradient: 'from-purple-200 to-pink-100' },
      { label: 'Manage Students', to: '/college/students', icon: GraduationCap, gradient: 'from-orange-200 to-red-100' },
      { label: 'Assessments', to: '/college/assessments', icon: ClipboardList, gradient: 'from-green-200 to-emerald-100' },
      { label: 'Submissions', to: '/college/submissions', icon: Inbox, gradient: 'from-teal-200 to-lime-100' },
      { label: 'Groups', to: '/college/groups', icon: Users2, gradient: 'from-indigo-200 to-purple-100' },
      { label: 'Analytics', to: '/college/analytics', icon: BarChart2, gradient: 'from-teal-200 to-green-100' },
      { label: 'Reports', to: '/college/reports', icon: FileBarChart, gradient: 'from-indigo-200 to-purple-100' },
     
    ],
    trainer: [
      { label: 'Dashboard', to: '/trainer/dashboard', icon: LayoutDashboard, gradient: 'from-purple-200 to-pink-100' },
      { label: 'My Groups', to: '/trainer/groups', icon: Users2, gradient: 'from-blue-200 to-cyan-100' },
      { label: 'Assessments', to: '/trainer/assessments', icon: ClipboardList, gradient: 'from-green-200 to-emerald-100' },
      { label: 'Assignments', to: '/trainer/assignments', icon: FileSignature, gradient: 'from-indigo-200 to-purple-100' },
      { label: 'Submissions', to: '/trainer/submissions', icon: Inbox, gradient: 'from-teal-200 to-lime-100' },
      { label: 'Students', to: '/trainer/students', icon: GraduationCap, gradient: 'from-orange-200 to-red-100' },
      { label: 'Analytics', to: '/trainer/analytics', icon: BarChart2, gradient: 'from-teal-200 to-green-100' },
      { label: 'Reports', to: '/trainer/reports', icon: FileBarChart, gradient: 'from-indigo-200 to-purple-100' },
      
    ]
  };

  const roleColors = {
    admin: 'text-purple-700',
    college: 'text-blue-700',
    trainer: 'text-green-700',
  };

  const firstInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose} />
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 md:w-64 bg-white border-r border-gray-300 shadow-md
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}`}
      >

        {/* User Info */}
        <div className="p-5 bg-gradient-to-tl from-blue-300 via-gray-300 to-teal-300">
          <div className="flex items-start justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 text-white font-bold text-lg flex items-center justify-center shadow-inner">
                {firstInitial}
              </div>
              <div>
                <p className="font-semibold text-gray-800 truncate max-w-[130px]">{user?.name || 'User'}</p>
                <p className={`text-xs ${roleColors[role] || 'text-gray-500'} capitalize`}>{role}</p>
              </div>
            </div>
            {isMobile && (
              <button onClick={onClose} className="text-gray-500 hover:text-red-500 ml-2">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

         
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems[role]?.map(({ label, to, icon: Icon, gradient }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                to={to}
                key={to}
                onClick={onClose}
                onMouseEnter={() => setHoveredItem(to)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative group flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200
                ${isActive
                    ? `bg-gradient-to-r ${gradient} text-gray-900 font-semibold shadow`
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center
                ${isActive ? 'bg-white/30' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  {Icon && <Icon className="w-4 h-4" />}
                </div>
                <span className="text-sm flex-1">{label}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-200 ${hoveredItem === to ? 'opacity-100 translate-x-1' : 'opacity-0'}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
       
      </div>
    </>
  );
};

export default Sidebar;
