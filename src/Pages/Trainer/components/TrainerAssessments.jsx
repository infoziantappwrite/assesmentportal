import React from 'react';
import { BookOpenCheck } from 'lucide-react';

const TrainerAssessments = () => {
  const assessments = [
    { title: 'Math Test', tag: 'Active', badge: 'from-blue-400 to-blue-600' },
    { title: 'Science Quiz', tag: 'Published', badge: 'from-green-400 to-green-600' },
    { title: 'JavaScript Exam', tag: 'Draft', badge: 'from-purple-400 to-purple-600' },
    { title: 'Python Coding', tag: 'Active', badge: 'from-indigo-400 to-indigo-600' },
    { title: 'UI/UX Test', tag: 'Published', badge: 'from-pink-400 to-pink-600' },
    { title: 'React Quiz', tag: 'Draft', badge: 'from-yellow-400 to-yellow-600' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-300 space-y-4">
      <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
        <BookOpenCheck className="text-indigo-600" />
        Trainer Assessments
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assessments.map((a, i) => (
          <div
            key={i}
            className="p-4 bg-gray-50 border border-gray-300 rounded-xl hover:shadow transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-gray-900">{a.title}</h3>
              <span className={`text-xs text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${a.badge}`}>
                {a.tag}
              </span>
            </div>
            <p className="text-sm text-gray-500">Created by you • 1 section</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerAssessments;
