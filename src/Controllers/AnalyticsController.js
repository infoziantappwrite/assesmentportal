import axiosClient from "../api/axiosClient";

// Base analytics endpoint - GET /analytics/
export const getBaseAnalytics = async () => {
  const res = await axiosClient.get(`/analytics/`, {
    withCredentials: true,
  });
  return res.data;
};

export const getDashboardData = async (payload = {}) => {
  const res = await axiosClient.get(`/analytics`, payload, {
    withCredentials: true,
  });
  //console.log("Dashboard Data Response:", res);
  return res.data;
};

export const getRoleBasedDashboardData = async (role) => {
  const res = await axiosClient.get(`/analytics/${role}?role=${role}`, {
    withCredentials: true,
  });
  return res.data;
};


export const getAssessmentAnalytics = async (assessmentId) => {
  const res = await axiosClient.get(`/analytics/assessment/${assessmentId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getStudentPerformanceAnalytics = async (studentId) => {
  const res = await axiosClient.get(`/analytics/candidate/${studentId}/performance`, {
    withCredentials: true,
  });
  return res.data;
};

export const getCollegePerformanceAnalytics = async (collegeId, filters) => {
  //console.log("Filters sent to backend:", filters);
  const res = await axiosClient.get(`/analytics/college/${collegeId}/performance`, {
    withCredentials: true,
    params: filters, // ✅ This sends filters as query parameters
  });
  return res.data;
};

export const getTrainerSummaryAnalytics = async (trainerId) => {
  const res = await axiosClient.get(`/analytics/trainer/${trainerId}/summary`, {
    withCredentials: true,
  });
  return res.data;
};

export const getQuestionPerformanceAnalytics = async (questionId) => {
  const res = await axiosClient.get(`/analytics/question/${questionId}/performance`, {
    withCredentials: true,
  });
  return res.data;
};

export const generateCustomAnalyticsReport = async (payload) => {
  const res = await axiosClient.post(`/analytics/custom-report`, payload, {
    withCredentials: true,
  });
  return res.data;
};

export const getAssignmentSummaryAnalytics = async (assignmentId) => {
  const res = await axiosClient.get(`/analytics/assignment/${assignmentId}/summary`, {
    withCredentials: true,
  });
  return res.data;
};

export const getSectionPerformanceAnalytics = async (sectionId) => {
  const res = await axiosClient.get(`/analytics/section/${sectionId}/performance`, {
    withCredentials: true,
  });
  return res.data;
};

export const getGroupPerformanceAnalytics = async (groupId) => {
  const res = await axiosClient.get(`/analytics/group/${groupId}/performance`, {
    withCredentials: true,
  });
  return res.data;
};

export const getCollegeTrendsAnalytics = async (collegeId) => {
  const res = await axiosClient.get(`/analytics/college/${collegeId}/trends`, {
    withCredentials: true,
  });
  return res.data;
};

export const getOverallPlatformAnalytics = async () => {
  const res = await axiosClient.get(`/analytics/overall`, {
    withCredentials: true,
  });
  return res.data;
};

export const getAnalyticsActivityLogs = async () => {
  const res = await axiosClient.get(`/analytics/activity`, {
    withCredentials: true,
  });
  return res.data;
};

// Additional helper functions for comprehensive analytics

// Get analytics for multiple assessments
export const getMultipleAssessmentAnalytics = async (assessmentIds) => {
  const promises = assessmentIds.map(id => getAssessmentAnalytics(id));
  const results = await Promise.allSettled(promises);
  return results.map((result, index) => ({
    assessmentId: assessmentIds[index],
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
};

// Get analytics for multiple students
export const getMultipleStudentAnalytics = async (studentIds) => {
  const promises = studentIds.map(id => getStudentPerformanceAnalytics(id));
  const results = await Promise.allSettled(promises);
  return results.map((result, index) => ({
    studentId: studentIds[index],
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
};

// Get comprehensive college analytics (performance + trends)
export const getComprehensiveCollegeAnalytics = async (collegeId) => {
  const [performance, trends] = await Promise.allSettled([
    getCollegePerformanceAnalytics(collegeId),
    getCollegeTrendsAnalytics(collegeId)
  ]);
  
  return {
    performance: performance.status === 'fulfilled' ? performance.value : null,
    trends: trends.status === 'fulfilled' ? trends.value : null,
    performanceError: performance.status === 'rejected' ? performance.reason : null,
    trendsError: trends.status === 'rejected' ? trends.reason : null
  };
};

// Get analytics dashboard for any role with comprehensive data
export const getComprehensiveDashboard = async (role, additionalData = {}) => {
  const promises = [
    getRoleBasedDashboardData(role),
    getAnalyticsActivityLogs(),
  ];
  
  // Add role-specific analytics
  if (role === 'admin') {
    promises.push(getOverallPlatformAnalytics());
  }
  
  if (additionalData.collegeId) {
    promises.push(getComprehensiveCollegeAnalytics(additionalData.collegeId));
  }
  
  if (additionalData.trainerId) {
    promises.push(getTrainerSummaryAnalytics(additionalData.trainerId));
  }
  
  const results = await Promise.allSettled(promises);
  
  return {
    dashboard: results[0]?.status === 'fulfilled' ? results[0].value : null,
    activity: results[1]?.status === 'fulfilled' ? results[1].value : null,
    platform: results[2]?.status === 'fulfilled' ? results[2].value : null,
    college: results[3]?.status === 'fulfilled' ? results[3].value : null,
    trainer: results[4]?.status === 'fulfilled' ? results[4].value : null,
    errors: results.map((result, index) => 
      result.status === 'rejected' ? { index, error: result.reason } : null
    ).filter(Boolean)
  };
};
