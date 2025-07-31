import React from 'react';
import { ArrowRightCircle, FileText } from 'lucide-react';

const TrainerAssignments = () => {
  const assignments = [
    { title: 'Assignment 1', due: '2025-08-05', status: 'Pending', color: 'text-yellow-600' },
    { title: 'Assignment 2', due: '2025-08-10', status: 'Completed', color: 'text-green-600' },
    { title: 'Assignment 3', due: '2025-08-15', status: 'In Progress', color: 'text-red-600' },
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
        <FileText className="text-purple-600" />
        Assignments Timeline
      </h2>
      <div className="relative border-l-2 border-gray-300 ml-4">
        {assignments.map((item, i) => (
          <div key={i} className="mb-6 ml-4">
            {/* Timeline Dot */}
            <div className={`absolute -left-3 w-6 h-6 rounded-full bg-white border-4 ${item.color}`}></div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">Due: {item.due}</p>
              <p className={`text-sm font-medium ${item.color}`}>Status: {item.status}</p>
              <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                View Details <ArrowRightCircle size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerAssignments;
