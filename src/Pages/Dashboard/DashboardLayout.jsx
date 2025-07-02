import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiMenu,
  FiX,
  FiSettings,
  FiCheckCircle,
  FiUserCheck,
} from 'react-icons/fi';
import { FaUserCheck } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { Layers3 } from 'lucide-react';


const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Commented out user & role logic
  /*
  const { user, loading } = useUser();

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 font-semibold">
        Loading user data...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Please log in to access the dashboard.
      </p>
    );
  }

  const role = user?.userType?.toLowerCase();
  */

  // Define menus for each role
  const roleSpecificMenu = {
    candidate: [
      { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 />, path: '/candidate/dashboard' },
      { key: 'assessments', label: 'My Assessments', icon: <FiFileText />, path: '/candidate/assessments' },
      { key: 'results', label: 'Results', icon: <FiBarChart2 />, path: '/candidate/results' },
      { key: 'courses', label: 'Courses', icon: <FiFileText />, path: '/candidate/courses' },
    ],
    admin: [
      { key: 'dashboard', label: 'Admin Dashboard', icon: <FiBarChart2 />, path: '/admin/dashboard' },
      { key: 'manageCandidates', label: 'Manage Candidates', icon: <FiUsers />, path: '/admin/manage-candidates' },
      { key: 'manageAssessments', label: 'Manage Assessments', icon: <HiOutlineDocumentText />, path: '/admin/manage-assessments' },
      { key: 'reports', label: 'Reports', icon: <FiBarChart2 />, path: '/admin/reports' },
      { key: 'settings', label: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
    ],
    trainer: [
      { key: 'dashboard', label: 'Trainer Dashboard', icon: <FiBarChart2 />, path: '/trainer/dashboard' },
      { key: 'create-test', label: 'Create Test', icon: <FiFileText />, path: '/trainer/create-test' },
      { key: 'view-test', label: 'View Test', icon: <FiCheckCircle />, path: '/trainer/view-test' },
      { key: 'students', label: 'Manage Students', icon: <FiUsers />, path: '/trainer/students' },
    ],
    college: [
      { key: 'dashboard', label: 'College Dashboard', icon: <FiBarChart2 />, path: '/college/dashboard' },
      { key: 'departments', label: 'Departments', icon: <Layers3 />, path: '/college/departments' },
      { key: 'trainers', label: 'Manage Trainers', icon: <FaUserCheck />, path: '/college/trainers' },
      { key: 'students', label: 'Manage Students', icon: <FiUsers />, path: '/college/students' },
    ],
  };

  // Determine role from URL path like /dashboard/candidate/...
  const pathParts = location.pathname.split('/');
  // pathParts[1] = 'dashboard', pathParts[2] = role
  const currentRole = pathParts[1] || 'candidate'; // default candidate if none

  // Select menu based on currentRole from path
  const menu = roleSpecificMenu[currentRole] || [];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-jost">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow border-b px-4 py-3 flex items-center justify-between z-10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-lg font-semibold text-gray-900 ml-2 truncate">
          Welcome, User
        </h1>
        <div className="w-8"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg w-72 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:w-64 lg:w-72 md:shadow-md flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gradient-to-r from-teal-500 to-indigo-600 shadow-md font-jost">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-bold capitalize">Welcome, User</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white hover:bg-white/20 p-1 rounded transition"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-1 capitalize">{currentRole}</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-4">
            {menu.map(({ key, label, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <li key={key}>
                  <button
                    onClick={() => {
                      navigate(path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150
                      ${
                        isActive
                          ? 'bg-blue-100 text-blue-800'
                          : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'
                      }
                    `}
                  >
                    <span className={`text-lg ${isActive ? 'text-blue-700' : ''}`}>
                      {icon}
                    </span>
                    <span className="font-medium text-sm truncate">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto">
              <div className="rounded-lg">
                {/* Outlet for nested routes */}
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
