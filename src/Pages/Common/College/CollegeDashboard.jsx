import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Layers,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  TrendingUp,
  Award,
  Calendar,
  Target,
} from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  getRoleBasedDashboardData,
  getCollegePerformanceAnalytics,
  getCollegeTrendsAnalytics,
  getAnalyticsActivityLogs 
} from '../../../Controllers/AnalyticsController';
import { useUser } from '../../../context/UserContext';

ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend
);

const CollegeDashboard = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [activityLogs, setActivityLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching comprehensive dashboard data for user:', user);
        console.log('User role:', user?.role, 'College ID:', user?.college_id);
        
        // Fetch multiple analytics endpoints in parallel
        const promises = [
          getRoleBasedDashboardData(user?.role || 'college'),
        ];

        // Add college-specific analytics if user has college_id
        if (user?.college_id) {
          promises.push(
            getCollegePerformanceAnalytics(user.college_id),
            getCollegeTrendsAnalytics(user.college_id)
          );
        }

        // Add activity logs
        promises.push(getAnalyticsActivityLogs());

        const results = await Promise.allSettled(promises);
        
        // Process results
        const [dashboardResult, performanceResult, trendsResult, activityResult] = results;
        
        if (dashboardResult.status === 'fulfilled') {
          setDashboardData(dashboardResult.value);
          console.log('Dashboard data:', dashboardResult.value);
        } else {
          console.error('Dashboard data failed:', dashboardResult.reason);
        }

        if (performanceResult?.status === 'fulfilled') {
          setPerformanceData(performanceResult.value);
          console.log('Performance data:', performanceResult.value);
        } else if (performanceResult?.status === 'rejected') {
          console.error('Performance data failed:', performanceResult.reason);
        }

        if (trendsResult?.status === 'fulfilled') {
          setTrendsData(trendsResult.value);
          console.log('Trends data:', trendsResult.value);
        } else if (trendsResult?.status === 'rejected') {
          console.error('Trends data failed:', trendsResult.reason);
        }

        if (activityResult?.status === 'fulfilled') {
          setActivityLogs(activityResult.value);
          console.log('Activity logs:', activityResult.value);
        } else if (activityResult?.status === 'rejected') {
          console.error('Activity logs failed:', activityResult.reason);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        console.error('Error details:', err.response?.data);
        
        // If it's a permissions error, we'll use fallback data instead of showing error
        if (err.response?.status === 403 || err.response?.data?.message?.includes('permissions')) {
          console.log('Using fallback data due to permissions restriction');
          setError(null); // Don't show error, just use fallback
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchAllDashboardData();
    }
  }, [user?.role, user?.college_id]);

  // Fallback hardcoded data for now until API response structure is confirmed
  const stats = dashboardData?.stats || {
    totalStudents: 240,
    activeGroups: 8,
    assignedAssessments: 14,
  };

  const chartPerformanceData = performanceData?.chartData || dashboardData?.performanceData || {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Performance',
        data: [80, 60, 45, 20],
        backgroundColor: ['#22c55e', '#3b82f6', '#fbbf24', '#ef4444'],
        borderRadius: 6,
        barPercentage: 0.7,
      },
    ],
  };

  const trendsChartData = trendsData?.chartData || {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Performance Trend',
        data: [65, 70, 68, 75, 72, 78],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const recentActivity = activityLogs?.activities || dashboardData?.recentActivity || [
    { id: 1, name: 'John Doe', action: 'Completed Java Test', date: '2025-07-28' },
    { id: 2, name: 'Group A', action: 'Assigned React Challenge', date: '2025-07-29' },
    { id: 3, name: 'Jane Smith', action: 'Submitted Python Quiz', date: '2025-07-30' },
  ];

  console.log('Final stats being used:', stats);
  console.log('Performance analytics:', performanceData);
  console.log('Trends analytics:', trendsData);
  console.log('Activity logs:', activityLogs);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-gray-100 to-blue-50 p-6 sm:p-8 md:p-10 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-gray-100 to-blue-50 p-6 sm:p-8 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-gray-100 to-blue-50 p-6 sm:p-8 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        College Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
        <StatCardRounded
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          color="text-green-700"
          bg="bg-green-100"
          shadow="shadow-lg shadow-green-300/50"
        />
        <StatCardPill
          icon={Layers}
          title="Active Groups"
          value={stats.activeGroups}
          color="text-indigo-700"
          bg="bg-indigo-100"
          shadow="shadow-xl shadow-indigo-300/60"
        />
        <StatCardRounded
          icon={BookOpen}
          title="Assigned Assessments"
          value={stats.assignedAssessments}
          color="text-blue-700"
          bg="bg-blue-100"
          shadow="shadow-lg shadow-blue-300/50"
        />
        <StatCardPill
          icon={Award}
          title="Avg Performance"
          value={performanceData?.averageScore || stats.averagePerformance || '75%'}
          color="text-purple-700"
          bg="bg-purple-100"
          shadow="shadow-xl shadow-purple-300/60"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 mb-12">
        <ChartCard title="Student Performance Distribution" icon={PieChart}>
          <Pie data={chartPerformanceData} />
        </ChartCard>
        <ChartCard title="Performance Breakdown" icon={BarChart3}>
          <Bar
            data={chartPerformanceData}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { stepSize: 20, color: '#374151' } },
                x: { ticks: { color: '#374151' } },
              },
            }}
          />
        </ChartCard>
        <ChartCard title="Performance Trends" icon={TrendingUp}>
          <Line
            data={trendsChartData}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { color: '#374151' } },
                x: { ticks: { color: '#374151' } },
              },
            }}
          />
        </ChartCard>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.activeAssignments || dashboardData?.activeAssignments || 12}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-green-500">+2</span> from last week
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.completionRate || dashboardData?.completionRate || '85%'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-green-500">+5%</span> from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.pendingReviews || dashboardData?.pendingReviews || 8}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-yellow-500">3</span> urgent
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Top Performers</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.topPerformers || dashboardData?.topPerformers || 15}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Above 90% score
          </p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-full overflow-x-auto border border-gray-200">
        <div className="flex justify-between items-center mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-3">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Recent Activity
          </h2>
          <button className="text-blue-600 font-semibold hover:underline transition text-sm sm:text-base">
            View More
          </button>
        </div>
        <table className="w-full text-left text-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 sm:py-3 px-3 sm:px-4 font-medium">Name</th>
              <th className="py-2 sm:py-3 px-3 sm:px-4 font-medium">Action</th>
              <th className="py-2 sm:py-3 px-3 sm:px-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map(({ id, name, action, date }) => (
              <tr
                key={id}
                className="hover:bg-gray-100 transition cursor-pointer rounded-lg"
              >
                <td className="py-2 sm:py-3 px-3 sm:px-4">{name}</td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">{action}</td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">{new Date(date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCardRounded = ({ icon: Icon, title, value, color, bg, shadow }) => (
  <div
    className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white ${shadow} hover:scale-[1.03] transition-transform cursor-pointer`}
  >
    <div className={`${bg} p-3 rounded-lg`}>
      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
    </div>
    <div>
      <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{value}</p>
      <p className="text-gray-700 text-xs sm:text-sm mt-1">{title}</p>
    </div>
  </div>
);

const StatCardPill = ({ icon: Icon, title, value, color, bg, shadow }) => (
  <div
    className={`flex items-center gap-3 p-3 sm:p-4 rounded-full bg-white ${shadow} hover:scale-[1.03] transition-transform cursor-pointer`}
  >
    <div className={`${bg} p-2.5 sm:p-3 rounded-full`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
    </div>
    <div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-700 text-xs sm:text-sm mt-0.5">{title}</p>
    </div>
  </div>
);

const ChartCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-gray-200">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 text-gray-800 font-bold text-base sm:text-lg">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      <h3>{title}</h3>
    </div>
    <div className="h-48 sm:h-64">{children}</div>
  </div>
);

export default CollegeDashboard;
