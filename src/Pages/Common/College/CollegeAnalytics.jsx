import React, { useState } from 'react'
import {
  ArrowLeft, Calendar, Search,
  TrendingUp, BarChart3, Filter,
  Users, FileText, Download
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CollegeAnalytics = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('last_30_days')
  const [metric, setMetric] = useState('candidates')

  const navigate = useNavigate()

  const mockStats = {
    candidates: 120,
    assessments: 15,
    avgScore: 82.4,
    completionRate: 91,
    topSubject: 'ReactJS',
    activeTrainers: 8,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/college/dashboard')}
              className="bg-white p-2 rounded-md shadow hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold">College Analytics</h1>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Candidates', value: mockStats.candidates, icon: Users },
            { label: 'Assessments Taken', value: mockStats.assessments, icon: FileText },
            { label: 'Avg. Score', value: `${mockStats.avgScore}%`, icon: TrendingUp },
            { label: 'Completion Rate', value: `${mockStats.completionRate}%`, icon: BarChart3 },
            { label: 'Top Subject', value: mockStats.topSubject, icon: BarChart3 },
            { label: 'Active Trainers', value: mockStats.activeTrainers, icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <stat.icon className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assessments, subjects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500 w-5 h-5" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="year_to_date">Year to Date</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 w-5 h-5" />
            <select
              value={metric}
              onChange={e => setMetric(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="candidates">Candidates</option>
              <option value="scores">Scores</option>
              <option value="completion">Completion Rate</option>
            </select>
          </div>
        </div>

        {/* Chart / Report */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            {metric === 'candidates' && 'Candidate Totals'}
            {metric === 'scores' && 'Average Scores'}
            {metric === 'completion' && 'Completion Rate'}
          </h2>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-gray-400">
            {/* Replace with your chart component (e.g. Chart.js, Recharts) */}
            <p>📊 Chart placeholder</p>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm divide-y">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Assessment</th>
                <th className="p-2 text-left">Taken</th>
                <th className="p-2 text-left">Avg Score</th>
                <th className="p-2 text-left">Completion %</th>
                <th className="p-2 text-left">Last Taken</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(idx => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2">Assessment {idx}</td>
                  <td className="p-2">20{idx}</td>
                  <td className="p-2">75–90%</td>
                  <td className="p-2">85–95%</td>
                  <td className="p-2">2025-06-{10 + idx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CollegeAnalytics
