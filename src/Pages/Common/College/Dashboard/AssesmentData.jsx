import React, { useEffect, useState } from "react";
import { X, FileText, BarChart3, CheckCircle, ClipboardList, Activity } from "lucide-react";
import { getAssessmentAnalytics } from "../../../../Controllers/AnalyticsController";

const AssesmentData = ({ assessment }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessment?.assessment_id?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAssessmentAnalytics(assessment?.assessment_id?._id);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching assessment analytics:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessment]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <FileText className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">Assessment Analytics</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Detailed overview of the assessment performance and statistics.
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <div className="space-y-4 text-gray-700 text-sm">
          {/* Basic Info */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <p className="font-semibold text-gray-800">{assessment.assessment_id.title}</p>
            <p className="text-gray-600">{assessment.assessment_id.description}</p>
            <p className="mt-1 text-sm text-gray-500">Status: {assessment.status}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard title="Total Submissions" value={data.statistics.totalSubmissions} icon={<ClipboardList className="w-5 h-5 text-green-600" />} />
            <StatCard title="Average Score" value={data.statistics.avgScore.toFixed(2)} icon={<BarChart3 className="w-5 h-5 text-purple-600" />} />
            <StatCard title="Max Score" value={data.statistics.maxScore} icon={<CheckCircle className="w-5 h-5 text-blue-600" />} />
          </div>

          {/* Score Distribution */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Score Distribution
            </h4>
            <div className="space-y-1 text-sm">
              {Object.entries(data.scoreDistribution).map(([range, count]) => (
                <div key={range} className="flex justify-between border-b border-gray-200 py-1">
                  <span>{range}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Analysis */}
          {data.difficultAnalysis && Object.keys(data.difficultAnalysis).length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" /> Difficulty Analysis
              </h4>
              <div className="space-y-1 text-sm">
                {Object.entries(data.difficultAnalysis).map(([level, count]) => (
                  <div key={level} className="flex justify-between border-b border-gray-200 py-1">
                    <span className="capitalize">{level}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section-wise Analysis */}
          {data.sectionWise && Object.keys(data.sectionWise).length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Section-wise Analysis
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(data.sectionWise).map(([section, stats]) => (
                  <div key={section} className="border border-gray-200 p-2 rounded-lg">
                    <p className="font-semibold text-gray-800">{section}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-600 text-sm mt-1">
                      <p>Total Questions: {stats.totalQuestions}</p>
                      <p>Avg Score: {stats.avgScore.toFixed(2)}</p>
                      <p>Highest Score: {stats.highestScore}</p>
                      <p>Pass Rate: {stats.passRate}%</p>
                    </div>
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

export default AssesmentData;
