import React, { useState, useEffect } from 'react';
import {
  getComprehensiveDashboard,
  getAssessmentAnalytics,
  getMultipleStudentAnalytics,
  generateCustomAnalyticsReport
} from '../../../Controllers/AnalyticsController';
import { 
  processUserAnalytics, 
  processPerformanceData,
  processActivityLogs,
  createPerformanceChartData,
  formatNumber,
  isValidAnalyticsResponse
} from '../../../utils/analyticsHelpers';

/**
 * Comprehensive Analytics Dashboard Example
 * Demonstrates how to use multiple analytics endpoints effectively
 */
const AnalyticsExample = () => {
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [customReport, setCustomReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example: Fetch comprehensive dashboard data
  const fetchComprehensiveDashboard = async (role, additionalData = {}) => {
    try {
      setLoading(true);
      const data = await getComprehensiveDashboard(role, additionalData);
      
      if (data.errors.length > 0) {
        console.warn('Some analytics endpoints failed:', data.errors);
      }
      
      setComprehensiveData(data);
      console.log('Comprehensive dashboard data:', data);
    } catch (err) {
      console.error('Failed to fetch comprehensive dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example: Fetch specific assessment analytics
  const fetchAssessmentAnalytics = async (assessmentId) => {
    try {
      const data = await getAssessmentAnalytics(assessmentId);
      
      if (isValidAnalyticsResponse(data)) {
        setAssessmentData(data);
        console.log('Assessment analytics:', data);
      }
    } catch (err) {
      console.error('Failed to fetch assessment analytics:', err);
    }
  };

  // Example: Fetch multiple student analytics
  const fetchMultipleStudents = async (studentIds) => {
    try {
      const data = await getMultipleStudentAnalytics(studentIds);
      setStudentData(data);
      console.log('Multiple student analytics:', data);
    } catch (err) {
      console.error('Failed to fetch student analytics:', err);
    }
  };

  // Example: Generate custom report
  const generateReport = async (reportConfig) => {
    try {
      const report = await generateCustomAnalyticsReport(reportConfig);
      setCustomReport(report);
      console.log('Custom report generated:', report);
    } catch (err) {
      console.error('Failed to generate custom report:', err);
    }
  };

  // Example usage in useEffect
  useEffect(() => {
    // Fetch comprehensive dashboard for admin role
    fetchComprehensiveDashboard('admin', { 
      collegeId: 'college_123',  // Optional college-specific data
      trainerId: 'trainer_456'   // Optional trainer-specific data
    });

    // Fetch specific assessment analytics
    fetchAssessmentAnalytics('assessment_789');

    // Fetch analytics for multiple students
    fetchMultipleStudents(['student_1', 'student_2', 'student_3']);

    // Generate custom report
    generateReport({
      type: 'performance_summary',
      dateRange: {
        start: '2025-01-01',
        end: '2025-08-26'
      },
      filters: {
        college_ids: ['college_123'],
        assessment_types: ['coding', 'mcq']
      }
    });
  }, []);

  // Process the data for display
  const processedUserData = comprehensiveData?.dashboard 
    ? processUserAnalytics(comprehensiveData.dashboard) 
    : null;

  const processedActivityData = comprehensiveData?.activity 
    ? processActivityLogs(comprehensiveData.activity, 5)
    : [];

  const processedPerformanceData = assessmentData 
    ? processPerformanceData(assessmentData)
    : null;

  if (loading) {
    return <div className="p-6">Loading comprehensive analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard Example</h1>

      {/* User Analytics */}
      {processedUserData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{formatNumber(processedUserData.total)}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatNumber(processedUserData.breakdown.candidate)}</p>
              <p className="text-sm text-gray-600">Candidates ({processedUserData.percentages.candidate}%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{formatNumber(processedUserData.breakdown.college_rep)}</p>
              <p className="text-sm text-gray-600">College Reps ({processedUserData.percentages.college_rep}%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{formatNumber(processedUserData.breakdown.trainer)}</p>
              <p className="text-sm text-gray-600">Trainers ({processedUserData.percentages.trainer}%)</p>
            </div>
          </div>
        </div>
      )}

      {/* Platform Analytics */}
      {comprehensiveData?.platform && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comprehensiveData.platform.data?.totalAssessments && (
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-xl font-bold text-blue-600">{comprehensiveData.platform.data.totalAssessments}</p>
                <p className="text-sm">Total Assessments</p>
              </div>
            )}
            {comprehensiveData.platform.data?.averageScore && (
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-xl font-bold text-green-600">{comprehensiveData.platform.data.averageScore}%</p>
                <p className="text-sm">Average Score</p>
              </div>
            )}
            {comprehensiveData.platform.data?.activeColleges && (
              <div className="text-center p-4 bg-purple-50 rounded">
                <p className="text-xl font-bold text-purple-600">{comprehensiveData.platform.data.activeColleges}</p>
                <p className="text-sm">Active Colleges</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {processedActivityData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {processedActivityData.map(activity => (
              <div key={activity.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Analytics */}
      {processedPerformanceData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Assessment Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold">{processedPerformanceData.averageScore}%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{formatNumber(processedPerformanceData.totalSubmissions)}</p>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{processedPerformanceData.completionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Student Analytics */}
      {studentData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Student Analytics</h2>
          <div className="space-y-2">
            {studentData.map((student, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <p className="font-medium">Student {student.studentId}</p>
                <div className="text-right">
                  {student.data ? (
                    <>
                      <p className="font-bold">Score: {student.data.averageScore || 'N/A'}%</p>
                      <p className="text-sm text-gray-600">Assessments: {student.data.totalAssessments || 0}</p>
                    </>
                  ) : (
                    <p className="text-red-500">Error loading data</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Report */}
      {customReport && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Report</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(customReport, null, 2)}
          </pre>
        </div>
      )}

      {/* Debug Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Debug Information</h3>
        <p className="text-sm">Comprehensive Data Loaded: {comprehensiveData ? '✅' : '❌'}</p>
        <p className="text-sm">Assessment Data Loaded: {assessmentData ? '✅' : '❌'}</p>
        <p className="text-sm">Student Data Loaded: {studentData ? '✅' : '❌'}</p>
        <p className="text-sm">Custom Report Generated: {customReport ? '✅' : '❌'}</p>
        <p className="text-sm">Errors: {comprehensiveData?.errors?.length || 0}</p>
      </div>
    </div>
  );
};

export default AnalyticsExample;
