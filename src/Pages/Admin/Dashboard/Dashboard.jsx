import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiClipboard, 
  FiFileText, 
  FiSettings, 
  FiBarChart2, 
  FiLayers,
  FiSearch,
  FiBell,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';

const AdminDashboard = () => {
  // Static data for demonstration
  const stats = [
    { title: 'Total Users', value: '1,248', change: '+12%', trend: 'up', icon: <FiUsers className="text-blue-400" /> },
    { title: 'Colleges', value: '48', change: '+3%', trend: 'up', icon: <FiBook className="text-green-400" /> },
    { title: 'Active Assessments', value: '24', change: '-2%', trend: 'down', icon: <FiClipboard className="text-purple-400" /> },
    { title: 'Pending Assignments', value: '56', change: '+5%', trend: 'up', icon: <FiFileText className="text-yellow-400" /> },
  ];

  const recentActivities = [
    { id: 1, action: 'Created new assessment', user: 'Dr. Smith', time: '2 mins ago' },
    { id: 2, action: 'Updated college information', user: 'Admin', time: '15 mins ago' },
    { id: 3, action: 'Added new user', user: 'Jane Doe', time: '1 hour ago' },
    { id: 4, action: 'Generated report', user: 'System', time: '3 hours ago' },
  ];

  const quickLinks = [
    { path: '/admin/users/create', icon: <FiUsers size={20} className="text-indigo-400" />, label: 'Add User' },
    { path: '/admin/colleges', icon: <FiBook size={20} className="text-indigo-400" />, label: 'Manage Colleges' },
    { path: '/admin/assessments/create', icon: <FiClipboard size={20} className="text-indigo-400" />, label: 'Create Assessment' },
    { path: '/admin/reports', icon: <FiBarChart2 size={20} className="text-indigo-400" />, label: 'View Reports' },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="opacity-90">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50">
                  {stat.icon}
                </div>
              </div>
              <div className={`mt-4 text-sm flex items-center ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? (
                  <FiChevronUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiChevronDown className="w-4 h-4 mr-1" />
                )}
                {stat.change} from yesterday
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="mr-3 p-2 rounded-md bg-indigo-50">
                      {link.icon}
                    </span>
                    <span className="font-medium text-gray-700">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-600">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400">
                        <FiUsers size={16} />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{activity.user}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Review new assessment submissions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-700">Medium</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tomorrow</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-700">In Progress</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-400 hover:text-indigo-600">View</a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Add new college information</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-700">High</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-400 hover:text-indigo-600">Complete</a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Generate monthly reports</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-700">Low</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Next Week</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">Not Started</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-400 hover:text-indigo-600">Start</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;