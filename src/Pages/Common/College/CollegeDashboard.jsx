import React from 'react';
import {
  Users,
  BookOpen,
  Layers,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CollegeDashboard = () => {
  const stats = {
    totalStudents: 240,
    activeGroups: 8,
    assignedAssessments: 14,
  };

  const performanceData = {
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

  const recentActivity = [
    { id: 1, name: 'John Doe', action: 'Completed Java Test', date: '2025-07-28' },
    { id: 2, name: 'Group A', action: 'Assigned React Challenge', date: '2025-07-29' },
    { id: 3, name: 'Jane Smith', action: 'Submitted Python Quiz', date: '2025-07-30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-gray-100 to-blue-50 p-6 sm:p-8 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        College Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
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
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-12">
        <ChartCard title="Student Performance (Pie Chart)" icon={PieChart}>
          <Pie data={performanceData} />
        </ChartCard>
        <ChartCard title="Performance Distribution (Bar Chart)" icon={BarChart3}>
          <Bar
            data={performanceData}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { stepSize: 20, color: '#374151' } },
                x: { ticks: { color: '#374151' } },
              },
            }}
          />
        </ChartCard>
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
