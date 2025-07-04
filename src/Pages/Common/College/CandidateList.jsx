import React, { useState } from 'react'
import { ArrowLeft, Search, Filter, Download, Users, Award, Clock, TrendingUp, Eye, Mail, User, MoreVertical, CheckCircle, XCircle, AlertCircle, BarChart3, Calendar, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CandidateList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedCandidates, setSelectedCandidates] = useState([])
  
  // Mock data - in real app this would come from useParams and API
  const testId = "12345"

  const navigate = useNavigate()
  
  const mockTest = {
    name: "ReactJS Advanced Assessment",
    date: "2025-07-01",
    totalCandidates: 45,
    completed: 42,
    pending: 3,
    averageScore: 78.5
  }

  const mockCandidates = [
    { 
      id: 101, 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@student.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      score: 95,
      status: 'completed',
      timeSpent: '85 min',
      submitTime: '2025-07-01 10:30 AM',
      department: 'Computer Science',
      year: '3rd Year',
      studentId: 'CS2024001',
      rank: 1,
      completionRate: 100
    },
    { 
      id: 102, 
      name: 'Michael Chen', 
      email: 'michael.chen@student.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211969-a64d6f02a3c5?w=150&h=150&fit=crop&crop=face',
      score: 88,
      status: 'completed',
      timeSpent: '102 min',
      submitTime: '2025-07-01 11:15 AM',
      department: 'Computer Science',
      year: '4th Year',
      studentId: 'CS2024002',
      rank: 3,
      completionRate: 100
    },
    { 
      id: 103, 
      name: 'Emily Rodriguez', 
      email: 'emily.rodriguez@student.edu',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      score: 82,
      status: 'completed',
      timeSpent: '95 min',
      submitTime: '2025-07-01 09:45 AM',
      department: 'Information Technology',
      year: '3rd Year',
      studentId: 'IT2024001',
      rank: 5,
      completionRate: 96
    },
    { 
      id: 104, 
      name: 'David Park', 
      email: 'david.park@student.edu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      score: 0,
      status: 'pending',
      timeSpent: '0 min',
      submitTime: null,
      department: 'Computer Science',
      year: '2nd Year',
      studentId: 'CS2024003',
      rank: null,
      completionRate: 0
    },
    { 
      id: 105, 
      name: 'Lisa Wang', 
      email: 'lisa.wang@student.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      score: 91,
      status: 'completed',
      timeSpent: '78 min',
      submitTime: '2025-07-01 08:30 AM',
      department: 'Software Engineering',
      year: '4th Year',
      studentId: 'SE2024001',
      rank: 2,
      completionRate: 100
    },
    { 
      id: 106, 
      name: 'James Wilson', 
      email: 'james.wilson@student.edu',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      score: 76,
      status: 'completed',
      timeSpent: '115 min',
      submitTime: '2025-07-01 12:00 PM',
      department: 'Information Systems',
      year: '3rd Year',
      studentId: 'IS2024001',
      rank: 8,
      completionRate: 92
    }
  ]

  const filteredCandidates = mockCandidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'score') {
        aValue = a.score || 0
        bValue = b.score || 0
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />
      case 'in-progress': return <AlertCircle className="w-4 h-4 text-blue-600" />
      default: return <XCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 font-bold'
    if (score >= 80) return 'text-blue-600 font-semibold'
    if (score >= 70) return 'text-yellow-600 font-medium'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleCandidateSelect = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId))
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId])
    }
  }

  const handleViewPerformance = (candidateId) => {
    // navigate(`/college/test/${testId}/candidate/${candidateId}`)
    console.log(`Viewing performance for candidate ${candidateId}`)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate('/college/tests')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tests</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {mockTest.name}
              </h1>
              <p className="text-gray-600 mt-1">Candidate Performance Dashboard</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg">
              <Download className="w-4 h-4" />
              Export Results
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockTest.totalCandidates}</p>
                <p className="text-sm text-gray-600">Total Candidates</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockTest.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockTest.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockTest.averageScore}%</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="score-desc">Score (High-Low)</option>
                  <option value="score-asc">Score (Low-High)</option>
                  <option value="submitTime-desc">Latest First</option>
                  <option value="submitTime-asc">Earliest First</option>
                </select>
              </div>
            </div>

            {selectedCandidates.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedCandidates.length} selected
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCandidates(filteredCandidates.map(c => c.id))
                        } else {
                          setSelectedCandidates([])
                        }
                      }}
                      className="rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100/50 transition-all"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Candidate
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                  <th 
                    className="px-6 py-4 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100/50 transition-all"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center gap-2">
                      Score
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Performance</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Time</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleCandidateSelect(candidate.id)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          {candidate.status === 'completed' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded-lg">
                              {candidate.studentId}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-lg">
                              {candidate.department}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(candidate.status)}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score > 0 ? `${candidate.score}%` : '-'}
                        </span>
                        {candidate.rank && (
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">#{candidate.rank}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {candidate.status === 'completed' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Completion</span>
                            <span className="font-medium">{candidate.completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${candidate.completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not started</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{candidate.timeSpent}</span>
                        </div>
                        {candidate.submitTime && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 text-xs">{candidate.submitTime}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        {candidate.status === 'completed' ? (
                          <button
                            onClick={() => navigate('/college/test/1/candidate/101')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md group-hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                          >
                            <Clock className="w-4 h-4" />
                            Pending
                          </button>
                        )}
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination would go here if needed */}
        {filteredCandidates.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredCandidates.length} of {mockCandidates.length} candidates
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-all">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">2</button>
              <button className="px-3 py-2 text-gray-600 hover:text-gray-600 transition-all">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateList

//ADD BACK TO TEST BUTTON NAVIGATE AND VIEW DETAILS AND LOGIN PAGE NAVIGATE