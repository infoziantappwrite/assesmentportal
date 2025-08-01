import React from 'react';
import {
  Users, Layers, ClipboardList, GraduationCap,
} from 'lucide-react';

const summaryData = [
  { title: 'Groups', value: 5, color: 'from-blue-400 to-blue-600', icon: Layers },
  { title: 'Assessments', value: 12, color: 'from-yellow-400 to-yellow-600', icon: ClipboardList },
  { title: 'Assignments', value: 7, color: 'from-green-400 to-green-600', icon: GraduationCap },
  { title: 'Students', value: 100, color: 'from-purple-400 to-purple-600', icon: Users },
];

const TrainerSummaryCards = () => (
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
          </div>
        </div>
      );
    })}
  </div>
);

export default TrainerSummaryCards;
