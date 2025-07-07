import React, { useState } from 'react'
import {
  ArrowLeft, Search, Download, Eye,
  CheckCircle, XCircle, AlertCircle, Clock, FileText
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CandidateList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const navigate = useNavigate()

  const mockTest = {
    id: '12345',
    name: 'ReactJS Advanced Assessment',
    totalCandidates: 45,
    completed: 42,
    pending: 3,
    averageScore: 78.5,
  }

  const mockCandidates = [
    {
      id: 101,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@student.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      score: 95,
      status: 'completed',
      timeSpent: '85 min',
      studentId: 'CS2024001',
    },
    {
      id: 102,
      name: 'Michael Chen',
      email: 'michael.chen@student.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211969-a64d6f02a3c5?w=100&h=100&fit=crop&crop=face',
      score: 88,
      status: 'completed',
      timeSpent: '102 min',
      studentId: 'CS2024002',
    },
    {
      id: 103,
      name: 'David Park',
      email: 'david.park@student.edu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      score: 0,
      status: 'pending',
      timeSpent: '0 min',
      studentId: 'CS2024003',
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600 w-4 h-4" />
      case 'pending': return <Clock className="text-orange-500 w-4 h-4" />
      case 'in-progress': return <AlertCircle className="text-blue-500 w-4 h-4" />
      default: return <XCircle className="text-gray-400 w-4 h-4" />
    }
  }

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'
    switch (status) {
      case 'completed': return `${base} bg-green-100 text-green-700`
      case 'pending': return `${base} bg-orange-100 text-orange-700`
      case 'in-progress': return `${base} bg-blue-100 text-blue-700`
      default: return `${base} bg-gray-100 text-gray-500`
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 font-semibold'
    if (score >= 80) return 'text-blue-600 font-semibold'
    if (score >= 70) return 'text-yellow-600 font-medium'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredCandidates = mockCandidates
    .filter((c) => {
      const search = searchTerm.toLowerCase()
      return (
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.studentId.toLowerCase().includes(search)
      ) && (filterStatus === 'all' || c.status === filterStatus)
    })
    .sort((a, b) => {
      const aVal = (a[sortBy] || '').toString().toLowerCase()
      const bVal = (b[sortBy] || '').toString().toLowerCase()
      return sortOrder === 'asc' ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1
    })

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/college/assessments')}
            className="bg-white p-2 rounded-md shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{mockTest.name}</h2>
            <p className="text-sm text-gray-500">Candidate Performance Overview</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
            <FileText className="w-4 h-4" /> Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Candidates', value: mockTest.totalCandidates },
          { label: 'Completed', value: mockTest.completed, color: 'text-green-600' },
          { label: 'Average Score', value: `${mockTest.averageScore}%`, color: 'text-blue-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-')
            setSortBy(field)
            setSortOrder(order)
          }}
          className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="score-desc">Score (High-Low)</option>
          <option value="score-asc">Score (Low-High)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Time Spent</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img src={candidate.avatar} alt={candidate.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium">{candidate.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{candidate.email}</td>
                  <td className={`px-4 py-3 ${getScoreColor(candidate.score)}`}>{candidate.score}</td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(candidate.status)}>
                      {getStatusIcon(candidate.status)}&nbsp;{candidate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{candidate.timeSpent}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/college/test/${mockTest.id}/candidate/${candidate.id}`)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CandidateList
