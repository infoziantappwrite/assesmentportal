import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockReports = [
  {
    id: "TST001",
    name: "ReactJS Advanced Assessment",
    date: "2025-07-01",
    candidates: 45,
    completed: 42,
    avgScore: 78.5,
  },
  {
    id: "TST002",
    name: "Node.js Fundamentals Quiz",
    date: "2025-06-25",
    candidates: 30,
    completed: 28,
    avgScore: 72.3,
  },
  {
    id: "TST003",
    name: "Frontend Project Review",
    date: "2025-06-20",
    candidates: 25,
    completed: 25,
    avgScore: 81.2,
  },
];

const CollegeReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const navigate = useNavigate();

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (dateFilter === "last_7") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return (
        matchesSearch && new Date(report.date) >= sevenDaysAgo
      );
    }
    if (dateFilter === "last_30") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return (
        matchesSearch && new Date(report.date) >= thirtyDaysAgo
      );
    }
    return matchesSearch;
  });

  const handleDownload = (reportId) => {
    // Replace with actual export logic (e.g., API call)
    alert(`Report for ${reportId} downloaded (mock).`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-6 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/college/dashboard")}
              className="bg-indigo-100 text-indigo-600 p-3 rounded-lg hover:bg-indigo-200 transition"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
              Reports & Results
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-indigo-600 w-5 h-5" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="all">All Dates</option>
              <option value="last_7">Last 7 Days</option>
              <option value="last_30">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-base divide-y">
            <thead className="bg-indigo-50">
              <tr>
                <th className="text-left p-4 font-semibold text-indigo-700">
                  Test Name
                </th>
                <th className="text-left p-4 font-semibold text-indigo-700">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-indigo-700">
                  Candidates
                </th>
                <th className="text-left p-4 font-semibold text-indigo-700">
                  Completed
                </th>
                <th className="text-left p-4 font-semibold text-indigo-700">
                  Avg. Score
                </th>
                <th className="text-left p-4 font-semibold text-indigo-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-indigo-400 font-semibold"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t hover:bg-indigo-50 transition"
                >
                  <td className="p-4 font-semibold text-indigo-900">
                    {report.name}
                  </td>
                  <td className="p-4 text-indigo-700">{report.date}</td>
                  <td className="p-4 text-indigo-800">{report.candidates}</td>
                  <td className="p-4 text-green-600 font-semibold">
                    {report.completed}
                  </td>
                  <td className="p-4 text-blue-600 font-semibold">
                    {report.avgScore}%
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDownload(report.id)}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                      aria-label={`Download Excel for ${report.name}`}
                    >
                      <Download className="w-5 h-5" />
                      Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollegeReports;
