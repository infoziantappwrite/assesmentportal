import React, { useState } from 'react'
import { ArrowLeft, User, Calendar, Clock, Award, Target, CheckCircle, XCircle, AlertCircle, TrendingUp, Download, Share2, Eye, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CandidatePerformance = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock data - in real app this would come from useParams and API
  const candidateId = "12345"
  const testId = "67890"

  const navigate = useNavigate()

  const mockCandidate = {
    name: "Sarah Johnson",
    email: "sarah.johnson@student.edu",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    studentId: "ST2024001",
    department: "Computer Science",
    year: "3rd Year"
  }

  const mockTest = {
    name: "ReactJS Advanced Assessment",
    date: "2025-07-01",
    duration: "120 minutes",
    totalQuestions: 25,
    difficulty: "Advanced"
  }

  const mockPerformance = {
    score: 85,
    total: 100,
    percentage: 85,
    rank: 3,
    totalCandidates: 45,
    timeSpent: "95 minutes",
    completionRate: 100,
    remarks: 'Excellent understanding of React concepts with strong problem-solving skills. Shows mastery in hooks and state management.',
    strengths: ["React Hooks", "State Management", "Component Architecture", "Performance Optimization"],
    improvements: ["Testing", "TypeScript Integration"],
    categoryScores: [
      { category: "React Fundamentals", score: 90, total: 100, questions: 8 },
      { category: "Hooks & State", score: 88, total: 100, questions: 7 },
      { category: "Performance", score: 75, total: 100, questions: 5 },
      { category: "Best Practices", score: 85, total: 100, questions: 5 }
    ],
    questions: [
      { 
        id: 1,
        question: 'What is React and how does it differ from other JavaScript frameworks?', 
        answer: 'React is a JavaScript library for building user interfaces, particularly web applications. Unlike frameworks like Angular or Vue, React focuses solely on the view layer and uses a component-based architecture with virtual DOM for efficient updates.',
        correctAnswer: 'React is a JavaScript library for building user interfaces with component-based architecture and virtual DOM.',
        correct: true,
        category: "React Fundamentals",
        difficulty: "Medium",
        timeSpent: "3m 45s",
        points: 10
      },
      { 
        id: 2,
        question: 'Explain the useEffect hook and provide an example of its usage.', 
        answer: 'useEffect is used for side effects in function components like API calls, subscriptions, or DOM manipulation. It runs after render and can have dependencies to control when it re-runs.',
        correctAnswer: 'useEffect handles side effects in functional components, accepts a callback and dependency array.',
        correct: true,
        category: "Hooks & State",
        difficulty: "Hard",
        timeSpent: "5m 20s",
        points: 15
      },
      { 
        id: 3,
        question: 'What is JSX and why is it used in React?', 
        answer: 'JSX is JavaScript XML syntax extension that allows writing HTML-like code in JavaScript',
        correctAnswer: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript, making React components more readable and expressive.',
        correct: true,
        category: "React Fundamentals",
        difficulty: "Easy",
        timeSpent: "2m 15s",
        points: 8
      },
      { 
        id: 4,
        question: 'How would you optimize a React application for better performance?', 
        answer: 'Use React.memo, useMemo, and useCallback for optimization',
        correctAnswer: 'Performance optimization includes React.memo for component memoization, useMemo/useCallback for expensive calculations, code splitting, lazy loading, and proper state management.',
        correct: false,
        category: "Performance",
        difficulty: "Hard",
        timeSpent: "4m 30s",
        points: 0
      }
    ],
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 80) return 'bg-blue-500'
    if (percentage >= 70) return 'bg-yellow-500'
    if (percentage >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getGradeFromScore = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 85) return 'A'
    if (percentage >= 80) return 'A-'
    if (percentage >= 75) return 'B+'
    if (percentage >= 70) return 'B'
    if (percentage >= 65) return 'B-'
    if (percentage >= 60) return 'C+'
    if (percentage >= 55) return 'C'
    return 'F'
  }

  const calculateCircleStroke = (percentage) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    return circumference - (percentage / 100) * circumference
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button
                onClick={() => navigate('/college/test/1/candidates')}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all"
                >
                <ArrowLeft className="w-4 h-4" />
            </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Performance Analysis
            </h1>
            <p className="text-gray-600 mt-1">Detailed assessment results and insights</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Candidate & Test Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Candidate Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={mockCandidate.avatar}
                  alt={mockCandidate.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{mockCandidate.name}</h2>
                <p className="text-gray-600">{mockCandidate.email}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>ID: {mockCandidate.studentId}</span>
                  <span>{mockCandidate.department}</span>
                  <span>{mockCandidate.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{mockTest.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{mockTest.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{mockTest.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{mockTest.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{mockTest.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg mb-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Circular Score */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={calculateCircleStroke(mockPerformance.percentage)}
                    className={getScoreColor(mockPerformance.percentage)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(mockPerformance.percentage)}`}>
                      {mockPerformance.percentage}%
                    </div>
                    <div className="text-sm text-gray-500">Overall</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(mockPerformance.percentage)}`}>
                  Grade {getGradeFromScore(mockPerformance.percentage)}
                </div>
                <div className="text-sm text-gray-500">{mockPerformance.score}/{mockPerformance.total} points</div>
              </div>
            </div>

            {/* Stats */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3 mx-auto">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">#{mockPerformance.rank}</div>
                <div className="text-sm text-gray-500">Rank out of {mockPerformance.totalCandidates}</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3 mx-auto">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{mockPerformance.timeSpent}</div>
                <div className="text-sm text-gray-500">Time Spent</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3 mx-auto">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{mockPerformance.completionRate}%</div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3 mx-auto">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockPerformance.questions.filter(q => q.correct).length}
                </div>
                <div className="text-sm text-gray-500">Correct Answers</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-3 mx-auto">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockPerformance.questions.filter(q => !q.correct).length}
                </div>
                <div className="text-sm text-gray-500">Incorrect Answers</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3 mx-auto">
                  <Eye className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{mockPerformance.questions.length}</div>
                <div className="text-sm text-gray-500">Total Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'questions', label: 'Question Analysis', icon: Eye },
              { id: 'insights', label: 'Insights', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Category Scores */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mockPerformance.categoryScores.map((category, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{category.category}</span>
                          <span className={`font-bold ${getScoreColor((category.score / category.total) * 100)}`}>
                            {Math.round((category.score / category.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor((category.score / category.total) * 100)}`}
                            style={{ width: `${(category.score / category.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.score}/{category.total} points • {category.questions} questions
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor Remarks */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Instructor Remarks
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{mockPerformance.remarks}</p>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Question Analysis</h3>
                {mockPerformance.questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`rounded-xl border-2 p-6 transition-all ${
                      q.correct 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium bg-white px-2 py-1 rounded-lg">
                            Question {index + 1}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded-lg">
                            {q.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-lg ${
                            q.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                            q.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {q.correct ? 
                          <CheckCircle className="w-6 h-6 text-green-600" /> :
                          <XCircle className="w-6 h-6 text-red-600" />
                        }
                        <span className={`font-bold ${q.correct ? 'text-green-600' : 'text-red-600'}`}>
                          {q.points} pts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Student's Answer:</p>
                        <p className="text-gray-900 bg-white p-3 rounded-lg">{q.answer}</p>
                      </div>
                      
                      {!q.correct && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Expected Answer:</p>
                          <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                            {q.correctAnswer}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Time spent: {q.timeSpent}</span>
                        <span className={q.correct ? 'text-green-600' : 'text-red-600'}>
                          {q.correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {mockPerformance.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {mockPerformance.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2 text-orange-700">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Performance Summary</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">Above Average</div>
                      <div className="text-sm text-blue-700">Overall Performance</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">Strong</div>
                      <div className="text-sm text-green-700">Conceptual Understanding</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">Good</div>
                      <div className="text-sm text-yellow-700">Time Management</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidatePerformance