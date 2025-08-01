import React from "react";
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
import { BarChart3, PieChart as PieChartIcon } from "lucide-react"; // Lucide icons

const pieData = [
  { name: "Completed", value: 60 },
  { name: "Pending", value: 25 },
  { name: "In Progress", value: 15 },
];

const barData = [
  { name: "Week 1", students: 30 },
  { name: "Week 2", students: 45 },
  { name: "Week 3", students: 38 },
  { name: "Week 4", students: 50 },
  { name: "Week 5", students: 42 },
];

const COLORS = ["#34D399", "#FBBF24", "#F87171"];

const TrainerAnalytics = () => (
  <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
    <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
      <BarChart3 className="text-indigo-500" size={28} />
      Trainer Analytics
    </h2>

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

export default TrainerAnalytics;
