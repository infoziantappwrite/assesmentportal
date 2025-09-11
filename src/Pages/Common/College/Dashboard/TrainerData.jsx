import React, { useEffect, useState } from "react";
import { X, UserCheck, BarChart3, ClipboardList, Trophy } from "lucide-react";
import { getTrainerSummaryAnalytics } from "../../../../Controllers/AnalyticsController";

const TrainerData = ({ trainer }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainer?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTrainerSummaryAnalytics(trainer._id);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching trainer analytics:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainer]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <UserCheck className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">{trainer.name}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">{trainer.email}</p>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <div className="space-y-4 text-gray-700 text-sm">
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard title="Assessments Created" value={data.assessmentsCreated} icon={<ClipboardList className="w-5 h-5 text-green-600" />} />
            <StatCard title="Total Attempts" value={data.totalAttempts} icon={<BarChart3 className="w-5 h-5 text-purple-600" />} />
            <StatCard title="Average Score" value={data.averageScores} icon={<BarChart3 className="w-5 h-5 text-blue-600" />} />
          </div>

          {/* Top Performers */}
          {/* Top Performers (Debug / Overview) */}
{data.topPerformers && data.topPerformers.length > 0 && (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Trophy className="w-5 h-5 text-yellow-500" /> Top Performers
    </h4>
    <pre className="text-sm text-gray-700 overflow-x-auto">
      {JSON.stringify(data.topPerformers, null, 2)}
    </pre>
  </div>
)}

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg p-4">
          <X className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">No analytics data available</p>
        </div>
      )}
    </div>
  );
};

/* Small Stat Card Component */
const StatCard = ({ title, value, icon }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
    <div className="p-2 bg-gray-50 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default TrainerData;
