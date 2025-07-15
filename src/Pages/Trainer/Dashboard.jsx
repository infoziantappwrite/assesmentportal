import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  CalendarDays,
  LineChart,
  Users,
  ChevronDown,
} from 'lucide-react';
import 'chart.js/auto';

const Dashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState('group1');
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-05');

  const groups = [
    { id: 'group1', name: 'Batch A' },
    { id: 'group2', name: 'Batch B' },
    { id: 'group3', name: 'Advanced React Team' },
  ];

  const kpiCards = [
    {
      label: 'Total Assessments',
      value: 12,
      icon: FileText,
      color: 'from-green-200 to-emerald-100',
    },
    {
      label: 'Active Assignments',
      value: 5,
      icon: LayoutDashboard,
      color: 'from-blue-200 to-cyan-100',
    },
    {
      label: 'Students Assigned',
      value: 200,
      icon: GraduationCap,
      color: 'from-orange-200 to-red-100',
    },
  ];

  const recentActivities = [
    'Assignment "Midterm Exam" submitted by 32 students',
    'Test "Java Basics" edited',
    'New assessment "React Fundamentals" created',
  ];

  const generateDateLabels = (start, end) => {
    const labels = [];
    let current = new Date(start);
    const stop = new Date(end);

    while (current <= stop) {
      labels.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return labels;
  };

  const dateLabels = generateDateLabels(startDate, endDate);

  const performanceData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Avg Score (%)',
        data: dateLabels.map(() => Math.floor(Math.random() * 40 + 60)),
        backgroundColor: '#4ADE80',
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 20 },
      },
    },
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <LineChart className="w-7 h-7 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, Trainer 👋</h2>
      </div>

      {/* Filters */}
      <div className="w-full bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-6 border border-blue-100">
        {/* Group Selector */}
        <div className="relative w-56">
          <Users className="absolute left-3 top-2.5 w-4 h-4 text-blue-500" />
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm rounded-md border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white appearance-none"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-blue-500 pointer-events-none" />
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-blue-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 pr-3 py-2 text-sm rounded-md border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-blue-500" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 pr-3 py-2 text-sm rounded-md border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>
      </div>


      {/* KPI + Chart Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-1">
          {kpiCards.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className={`bg-gradient-to-r ${color} p-5 rounded-xl shadow-md flex items-center gap-4 hover:scale-[1.02] transition`}
            >
              <div className="p-3 bg-white/30 rounded-md">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <div className="text-sm text-gray-700 font-medium">{label}</div>
                <div className="text-xl font-bold text-gray-900">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
          <div className="text-lg font-semibold text-gray-800 mb-4">
            Performance for Group: <span className="text-blue-600">{groups.find(g => g.id === selectedGroup)?.name}</span><br />
            <span className="text-sm text-gray-500">({startDate} to {endDate})</span>
          </div>
          <div className="h-[220px] w-full">
            <Bar data={performanceData} options={chartOptions} />
          </div>
        </div>
      </div>

     <div className="bg-white border border-blue-100 rounded-xl shadow-md overflow-hidden">
  {/* Header */}
  <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-4">
    <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      Recent Activities
    </h3>
  </div>

  {/* Activity List */}
  <ul className="divide-y divide-gray-100">
    {recentActivities.map((item, idx) => (
      <li
        key={idx}
        className="px-6 py-4 text-sm text-gray-700 hover:bg-blue-50 transition-all flex items-start gap-2"
      >
        <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default Dashboard;
