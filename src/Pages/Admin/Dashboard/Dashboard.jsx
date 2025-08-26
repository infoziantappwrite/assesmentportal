import React, { useState, useEffect } from 'react';
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
  FiBell
} from 'react-icons/fi';
import { useUser } from '../../../context/UserContext';
import { getRoleBasedDashboardData } from '../../../Controllers/AnalyticsController';
import { 
  processUserAnalytics, 
  isValidAnalyticsResponse 
} from '../../../utils/analyticsHelpers';
import Loader from '../../../Components/Loader';

const AdminDashboard = () => {
  const { user, role } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data for when API fails or no data available
  const fallbackStats = [
    { title: 'Total Users', value: '1,248', icon: <FiUsers className="text-blue-500" /> },
    { title: 'Candidates', value: '1,200', icon: <FiUsers className="text-emerald-500" /> },
    { title: 'College Reps', value: '8', icon: <FiBook className="text-purple-500" /> },
    { title: 'Trainers', value: '5', icon: <FiFileText className="text-amber-500" /> },
  ];

  const fallbackActivities = [
    { id: 1, action: 'Created new assessment', user: 'Dr. Smith', time: '2 mins ago' },
    { id: 2, action: 'Updated college information', user: 'Admin', time: '15 mins ago' },
    { id: 3, action: 'Added new user', user: 'Jane Doe', time: '1 hour ago' },
    { id: 4, action: 'Generated report', user: 'System', time: '3 hours ago' },
  ];

  const quickLinks = [
    { 
      path: '/admin/users/create', 
      icon: <FiUsers size={24} className="text-blue-500" />, 
      label: 'Manage Users',
      description: 'Add and manage user accounts'
    },
    { 
      path: '/admin/colleges', 
      icon: <FiBook size={24} className="text-emerald-500" />, 
      label: 'Manage Colleges',
      description: 'Oversee college registrations'
    },
    { 
      path: '/admin/assessments/create', 
      icon: <FiClipboard size={24} className="text-purple-500" />, 
      label: 'Create Assessment',
      description: 'Build new assessments'
    },
    { 
      path: '/admin/reports', 
      icon: <FiBarChart2 size={24} className="text-amber-500" />, 
      label: 'View Reports',
      description: 'Analytics and insights'
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!role) return;
      
      try {
        setLoading(true);
        console.log('Fetching admin dashboard data for role:', role);
        const data = await getRoleBasedDashboardData(role);
        console.log('Admin dashboard API response:', data);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        if (err.response?.status === 403) {
          console.log('Access denied - using fallback data');
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  // Helper function to get stats data based on real API response structure
  const getStatsData = () => {
    if (isValidAnalyticsResponse(dashboardData)) {
      const userData = processUserAnalytics(dashboardData);
      if (userData) {
        return [
          { 
            title: 'Total Users', 
            value: userData.total.toString(), 
            icon: <FiUsers className="text-blue-500" /> 
          },
          { 
            title: 'Candidates', 
            value: userData.breakdown.candidate.toString(), 
            icon: <FiUsers className="text-emerald-500" /> 
          },
          { 
            title: 'College Reps', 
            value: userData.breakdown.college_rep.toString(), 
            icon: <FiBook className="text-purple-500" /> 
          },
          { 
            title: 'Trainers', 
            value: userData.breakdown.trainer.toString(), 
            icon: <FiFileText className="text-amber-500" /> 
          },
        ];
      }
    }
    return fallbackStats;
  };

  // Helper function to get activities data
  const getActivitiesData = () => {
    if (dashboardData?.data?.recentActivities?.length > 0) {
      return dashboardData.data.recentActivities;
    }
    return fallbackActivities;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Dashboard Content */}
      <main className="p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}!</h1>
              <p className="text-blue-100 text-lg">Manage your platform with powerful admin tools</p>
              {error && (
                <div className="mt-3 px-4 py-2 bg-blue-500/20 rounded-lg text-sm">
                  <span className="text-blue-100">⚠️ Using cached data - some information may not be current</span>
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <FiBarChart2 className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsData().map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-inner">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <FiLayers className="w-6 h-6 mr-3 text-indigo-500" />
                Quick Actions
              </h3>
              <div className="space-y-4">
                {quickLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    className="group flex items-center p-4 rounded-xl border-2 border-slate-200/50 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300"
                  >
                    <div className="mr-4 p-3 rounded-xl bg-slate-100 group-hover:bg-white transition-colors">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 group-hover:text-indigo-700">{link.label}</p>
                      <p className="text-sm text-slate-500">{link.description}</p>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="xl:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <FiBarChart2 className="w-6 h-6 mr-3 text-indigo-500" />
                  Recent Activities
                </h3>
                <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {getActivitiesData().slice(0, 6).map(activity => (
                  <div key={activity.id} className="flex items-start p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                        <FiUsers size={18} />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-slate-800">{activity.action}</p>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <span className="font-medium">{activity.user}</span>
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
      </main>
    </div>
  );
};

export default AdminDashboard;