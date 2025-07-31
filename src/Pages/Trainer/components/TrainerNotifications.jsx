import React from 'react';
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Users,
  MessageSquare,
  Bell,
} from 'lucide-react';

const notifications = [
  {
    text: "Assignment deadline for Group A is tomorrow.",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-800",
  },
  {
    text: "New group assigned: React Basics Batch",
    icon: Users,
    color: "bg-blue-100 text-blue-800",
  },
  {
    text: "Trainer meeting scheduled for Friday 4 PM",
    icon: CalendarDays,
    color: "bg-purple-100 text-purple-800",
  },
  {
    text: "Assessment results published for JS Fundamentals.",
    icon: ClipboardList,
    color: "bg-green-100 text-green-800",
  },
  {
    text: "Update your availability for next week.",
    icon: CalendarDays,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    text: "Admin shared feedback on your session.",
    icon: MessageSquare,
    color: "bg-pink-100 text-pink-800",
  },
  {
    text: "New assignment created: Node.js Authentication",
    icon: ClipboardList,
    color: "bg-cyan-100 text-cyan-800",
  },
  {
    text: "Python Batch B session recording uploaded.",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
  },
];

const TrainerNotifications = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow">
      
      <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
              <Bell className="text-green-600" />
              Notifications
            </h2>
      {/* Scrollable notification list */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {notifications.map((note, i) => {
          const Icon = note.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl ${note.color} hover:scale-[1.01] transition-transform`}
            >
              <Icon size={20} className="mt-1" />
              <p className="text-sm font-medium">{note.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainerNotifications;
