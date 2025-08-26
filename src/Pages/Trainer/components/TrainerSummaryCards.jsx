import React, { useState, useEffect } from 'react';
import {
  Users, Layers, ClipboardList, GraduationCap, Loader2,
} from 'lucide-react';
import { getRoleBasedDashboardData } from '../../../Controllers/AnalyticsController';
import { useUser } from '../../../context/UserContext';

const TrainerSummaryCards = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data for user:', user);
        console.log('User role:', user?.role);
        
        // Use the role-based endpoint that calls /analytics/{role}  
        const data = await getRoleBasedDashboardData(user?.role || 'trainer');
        setDashboardData(data);
        console.log('Dashboard data received:', data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        console.error('Error details:', err.response?.data);
        
        // If it's a permissions error, we'll use fallback data
        if (err.response?.status === 403 || err.response?.data?.message?.includes('permissions')) {
          console.log('Using fallback data due to permissions restriction');
          setDashboardData(null); // Will use fallback data
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

  // Map API data to summary cards format
  const getSummaryData = () => {
    if (dashboardData?.data?.kpis) {
      const kpis = dashboardData.data.kpis;
      return [
        { 
          title: 'Groups', 
          value: kpis.totalGroups || 0, 
          color: 'from-blue-400 to-blue-600', 
          icon: Layers 
        },
        { 
          title: 'Assessments', 
          value: kpis.totalAssessments || kpis.totalActiveAssessments || 0, 
          color: 'from-yellow-400 to-yellow-600', 
          icon: ClipboardList 
        },
        { 
          title: 'Assignments', 
          value: kpis.totalAssignments || 0, 
          color: 'from-green-400 to-green-600', 
          icon: GraduationCap 
        },
        { 
          title: 'Students', 
          value: kpis.totalUsers || 0, 
          color: 'from-purple-400 to-purple-600', 
          icon: Users 
        },
      ];
    }

    // Fallback hardcoded data
    return [
      { title: 'Groups', value: 5, color: 'from-blue-400 to-blue-600', icon: Layers },
      { title: 'Assessments', value: 12, color: 'from-yellow-400 to-yellow-600', icon: ClipboardList },
      { title: 'Assignments', value: 7, color: 'from-green-400 to-green-600', icon: GraduationCap },
      { title: 'Students', value: 100, color: 'from-purple-400 to-purple-600', icon: Users },
    ];
  };

  const summaryData = getSummaryData();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading dashboard: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {summaryData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-300 shadow hover:shadow-md transition"
          >
            <div className={`p-3 rounded-full bg-gradient-to-br ${card.color} text-white`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              {dashboardData && (
                <p className="text-xs text-green-600">• Live data</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainerSummaryCards;
