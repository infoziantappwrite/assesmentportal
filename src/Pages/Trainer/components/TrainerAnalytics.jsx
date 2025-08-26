import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { getRoleBasedDashboardData } from '../../../Controllers/AnalyticsController';
import { useUser } from '../../../context/UserContext';

const COLORS = ["#34D399", "#FBBF24", "#F87171"];

const TrainerAnalytics = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching analytics data for trainer:', user);
        console.log('User role:', user?.role);
        
        // Use the role-based endpoint that calls /analytics/{role}
        const data = await getRoleBasedDashboardData(user?.role || 'trainer');
        setDashboardData(data);
        console.log('Analytics data received:', data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        
        if (err.response?.status === 403 || err.response?.data?.message?.includes('permissions')) {
          console.log('Using fallback analytics data due to permissions restriction');
          setDashboardData(null);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Get chart data from API or use fallback
  const getChartData = () => {
    if (dashboardData?.data?.charts) {
      return dashboardData.data.charts;
    }

    // Fallback hardcoded data
    return {
      pieData: [
        { name: "Completed", value: 60 },
        { name: "Pending", value: 25 },
        { name: "In Progress", value: 15 },
      ],
      barData: [
        { name: "Week 1", students: 30 },
        { name: "Week 2", students: 45 },
        { name: "Week 3", students: 38 },
        { name: "Week 4", students: 50 },
        { name: "Week 5", students: 42 },
      ]
    };
  };

  const chartData = getChartData();
  const pieData = chartData.pieData || chartData.assignmentStatus || [
    { name: "Completed", value: 60 },
    { name: "Pending", value: 25 }, 
    { name: "In Progress", value: 15 },
  ];

  const barData = chartData.barData || chartData.weeklyParticipation || [
    { name: "Week 1", students: 30 },
    { name: "Week 2", students: 45 },
    { name: "Week 3", students: 38 },
    { name: "Week 4", students: 50 },
    { name: "Week 5", students: 42 },
  ];

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <BarChart3 className="text-indigo-500" size={28} />
          Trainer Analytics
        </h2>
        {dashboardData && (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Live Data
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">Error loading analytics: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <PieChartIcon className="text-teal-500" size={20} />
            Assignment Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} />
            Weekly Student Participation
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#60A5FA">
                <LabelList dataKey="students" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrainerAnalytics;
