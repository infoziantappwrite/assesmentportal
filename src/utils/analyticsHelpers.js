// Utility functions for processing analytics data

/**
 * Format large numbers with K, M suffixes
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

/**
 * Get trend direction based on percentage change
 */
export const getTrendDirection = (change) => {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
};

/**
 * Process user analytics data from API response
 */
export const processUserAnalytics = (apiResponse) => {
  if (!apiResponse?.data?.users) return null;
  
  const users = apiResponse.data.users;
  return {
    total: users.total,
    breakdown: {
      admin: users.admin,
      candidate: users.candidate,
      college_rep: users.college_rep,
      trainer: users.trainer
    },
    percentages: {
      admin: ((users.admin / users.total) * 100).toFixed(1),
      candidate: ((users.candidate / users.total) * 100).toFixed(1),
      college_rep: ((users.college_rep / users.total) * 100).toFixed(1),
      trainer: ((users.trainer / users.total) * 100).toFixed(1)
    }
  };
};

/**
 * Process performance analytics data
 */
export const processPerformanceData = (apiResponse) => {
  if (!apiResponse?.data) return null;
  
  return {
    averageScore: apiResponse.data.averageScore || 0,
    totalSubmissions: apiResponse.data.totalSubmissions || 0,
    completionRate: apiResponse.data.completionRate || 0,
    topPerformers: apiResponse.data.topPerformers || [],
    distribution: apiResponse.data.scoreDistribution || {}
  };
};

/**
 * Process activity logs for display
 */
export const processActivityLogs = (apiResponse, limit = 10) => {
  if (!apiResponse?.data?.activities) return [];
  
  return apiResponse.data.activities
    .slice(0, limit)
    .map(activity => ({
      id: activity.id || Math.random(),
      action: activity.action || activity.description || 'Unknown action',
      user: activity.user_name || activity.user || 'System',
      time: activity.created_at ? formatTimeAgo(activity.created_at) : activity.time || 'Unknown',
      type: activity.type || 'general'
    }));
};

/**
 * Format timestamp to relative time
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

/**
 * Create chart data for performance distribution
 */
export const createPerformanceChartData = (performanceData) => {
  if (!performanceData?.distribution) {
    return {
      labels: ['Excellent', 'Good', 'Average', 'Poor'],
      datasets: [{
        label: 'Performance',
        data: [80, 60, 45, 20],
        backgroundColor: ['#22c55e', '#3b82f6', '#fbbf24', '#ef4444'],
        borderRadius: 6,
        barPercentage: 0.7,
      }]
    };
  }
  
  const dist = performanceData.distribution;
  return {
    labels: Object.keys(dist),
    datasets: [{
      label: 'Students',
      data: Object.values(dist),
      backgroundColor: ['#22c55e', '#3b82f6', '#fbbf24', '#ef4444'],
      borderRadius: 6,
      barPercentage: 0.7,
    }]
  };
};

/**
 * Create trends chart data
 */
export const createTrendsChartData = (trendsData) => {
  if (!trendsData?.data?.trends) {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Performance Trend',
        data: [65, 70, 68, 75, 72, 78],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  }
  
  const trends = trendsData.data.trends;
  return {
    labels: trends.map(t => t.period || t.month),
    datasets: [{
      label: 'Performance Trend',
      data: trends.map(t => t.average_score || t.score),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };
};

/**
 * Safely get nested object property
 */
export const safeGet = (obj, path, defaultValue = null) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
};

/**
 * Validate analytics response structure
 */
export const isValidAnalyticsResponse = (response) => {
  return response && 
         typeof response === 'object' && 
         response.success !== false &&
         response.data !== undefined;
};
