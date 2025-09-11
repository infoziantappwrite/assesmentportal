import React, { useEffect, useState } from "react";
import { X, UserCheck, BarChart3, ClipboardList } from "lucide-react";
import { getStudentPerformanceAnalytics } from "../../../../Controllers/AnalyticsController";

const StudentData = ({ student }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getStudentPerformanceAnalytics(student._id);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching student analytics:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [student]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <UserCheck className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">{student.email}</p>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <div className="space-y-4 text-gray-700 text-sm">

          {/* Overall Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <StatCard title="Total Attempts" value={data.overallStats.totalAttempts} icon={<ClipboardList className="w-5 h-5 text-green-600" />} />
            <StatCard title="Average Score" value={data.overallStats.avgScore} icon={<BarChart3 className="w-5 h-5 text-purple-600" />} />
            <StatCard title="Max Score" value={data.overallStats.maxScore} icon={<BarChart3 className="w-5 h-5 text-blue-600" />} />
            <StatCard title="Min Score" value={data.overallStats.minScore} icon={<BarChart3 className="w-5 h-5 text-red-600" />} />
          </div>

          {/* Trend Data */}
          {data.trendData?.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Trend Data</h4>
              <div className="space-y-1 text-sm">
                {data.trendData.map((t, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-200 py-1">
                    <span>{t.assignment}</span>
                    <span>{new Date(t.date).toLocaleDateString()} - Score: {t.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rankings */}
          {data.rankings?.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Rankings</h4>
              <div className="space-y-1 text-sm">
                {data.rankings.map((r, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-200 py-1">
                    <span>{r.assignment}</span>
                    <span>Score: {r.score} - Rank: {r.rank}</span>
                  </div>
                ))}
              </div>
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

export default StudentData;
