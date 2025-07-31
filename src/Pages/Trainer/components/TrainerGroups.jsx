import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

const TrainerGroups = () => {
  const groups = [
    { name: 'Group A', subject: 'Mathematics', members: 20, color: 'border-blue-500 bg-blue-50' },
    { name: 'Group B', subject: 'Physics', members: 16, color: 'border-green-500 bg-green-50' },
    { name: 'Group C', subject: 'Computer Science', members: 25, color: 'border-orange-500 bg-orange-50' },
     { name: 'Group D', subject: 'Computer Engineering', members: 55, color: 'border-blue-500 bg-blue-50' },
  ];

  return (
    <div className="p-6 bg-white border border-gray-300 rounded-2xl shadow">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <Users className="text-blue-600" />
        Managed Groups
      </h2>

      <div className="space-y-2">
        {groups.map((group, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-4 rounded-xl border-l-4 ${group.color}`}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-600">Subject: {group.subject}</p>
              <span className="inline-block mt-1 text-xs text-white bg-gray-600 px-2 py-0.5 rounded-full">
                {group.members} members
              </span>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              View <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerGroups;
