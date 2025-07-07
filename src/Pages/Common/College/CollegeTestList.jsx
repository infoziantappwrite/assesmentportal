import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, ArrowRight, Search, Filter, Clock, BookOpen, TrendingUp } from 'lucide-react'
const CollegeTestList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const navigate = useNavigate()
  
  const mockTests = [
    { 
      id: 1, 
      name: 'Frontend Development Assessment', 
      date: '2025-07-01', 
      candidates: 45, 
      status: 'active',
      duration: '120 min',
      difficulty: 'Intermediate',
      description: 'Comprehensive evaluation of React, JavaScript, and CSS skills',
      totalCandidates: 45,
      completed: 30,
      averageScore: 76.4
    },
    { 
      id: 2, 
      name: 'Backend System Evaluation', 
      date: '2025-06-20', 
      candidates: 32, 
      status: 'completed',
      duration: '90 min',
      difficulty: 'Advanced',
      description: 'Server-side programming and database management assessment',
      totalCandidates: 32,
      completed: 32,
      averageScore: 84.1
    },
    { 
      id: 3, 
      name: 'ReactJS Mastery Test', 
      date: '2025-06-15', 
      candidates: 67, 
      status: 'active',
      duration: '150 min',
      difficulty: 'Expert',
      description: 'Advanced React concepts including hooks, context, and performance optimization',
      totalCandidates: 67,
      completed: 45,
      averageScore: 91.3
    },
    { 
      id: 4, 
      name: 'Full Stack Challenge', 
      date: '2025-07-10', 
      candidates: 23, 
      status: 'upcoming',
      duration: '180 min',
      difficulty: 'Advanced',
      description: 'End-to-end development skills assessment with real-world scenarios',
      totalCandidates: 23,
      completed: 0,
      averageScore: 0
    },
  ]


  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || test.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'upcoming': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600'
      case 'Intermediate': return 'text-yellow-600'
      case 'Advanced': return 'text-orange-600'
      case 'Expert': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const handleTestClick = (testId) => {
    navigate(`/college/test/${testId}/candidates`)
    console.log(`Navigating to test ${testId} candidates`)
  }

return (
  <div className=' bg-gradient-to-br from-blue-50 to-teal-50'>
  <div>
    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
      Assesments
    </h1>
  </div>

    <div className="max-w-7xl mx-auto mt-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockTests.length}</p>
              <p className="text-sm text-gray-600">Total Assessments</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockTests.reduce((sum, test) => sum + test.candidates, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Candidates</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockTests.filter(test => test.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Tests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            onClick={() => navigate(`/college/test/${test.id}/candidates`, { state: { test } })}
            className="group cursor-pointer bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03]"
          >
            {/* Top: Title & Arrow */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {test.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {test.description}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Meta Info */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{test.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{test.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{test.candidates} Candidates</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="capitalize">{test.difficulty}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  test.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : test.status === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {test.status}
              </span>
            </div>
          </div>
        ))}
      </div>


      {/* Empty State */}
      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  </div>
)
}

export default CollegeTestList