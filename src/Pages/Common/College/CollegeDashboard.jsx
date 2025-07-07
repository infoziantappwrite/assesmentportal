import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
} from 'lucide-react';

const CollegeDashboard = () => {
  const stats = {
    totalStudents: 240,
    totalTrainers: 18,
    totalAssessments: 12,
    activeTests: 4,
    completedSubmissions: 135,
    upcomingTests: 2,
  };

  const upcomingTests = [
    {
      id: 1,
      title: 'Full Stack Challenge',
      date: '2025-07-10',
      candidates: 23,
      duration: '180 min',
    },
    {
      id: 2,
      title: 'Python Data Structures Test',
      date: '2025-07-15',
      candidates: 30,
      duration: '90 min',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">College Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard icon={GraduationCap} title="Total Students" value={stats.totalStudents} bg="bg-orange-100" iconColor="text-orange-600" />
        <DashboardCard icon={Users} title="Total Trainers" value={stats.totalTrainers} bg="bg-green-100" iconColor="text-green-600" />
        <DashboardCard icon={BookOpen} title="Total Assessments" value={stats.totalAssessments} bg="bg-blue-100" iconColor="text-blue-600" />
        <DashboardCard icon={TrendingUp} title="Active Tests" value={stats.activeTests} bg="bg-indigo-100" iconColor="text-indigo-600" />
        <DashboardCard icon={FileText} title="Completed Submissions" value={stats.completedSubmissions} bg="bg-purple-100" iconColor="text-purple-600" />
        <DashboardCard icon={Calendar} title="Upcoming Tests" value={stats.upcomingTests} bg="bg-yellow-100" iconColor="text-yellow-600" />
      </div>

      {/* Upcoming Tests */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Upcoming Assessments
        </h2>
        <div className="space-y-4">
          {upcomingTests.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition">
              <div>
                <h3 className="font-semibold text-gray-800">{test.title}</h3>
                <p className="text-sm text-gray-500">{test.candidates} candidates • {test.duration}</p>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(test.date)}</span>
              </div>
            </div>
          ))}
          {upcomingTests.length === 0 && (
            <p className="text-gray-500 text-sm">No upcoming assessments scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon: Icon, title, value, bg, iconColor }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${bg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  </div>
);

export default CollegeDashboard;
