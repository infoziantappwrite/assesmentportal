import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sampleStudents from './sampleStudents';
import {
  ArrowLeft,
  ShieldCheck,
  BarChart3,
  User,
  Mail,
  GraduationCap,
  Star,
  FileText,
  Medal,
} from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = sampleStudents.find((s) => s.id === parseInt(id));

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Student not found.
      </div>
    );
  }

  // Simulated statistics
  const stats = {
    testsTaken: Math.floor(Math.random() * 10) + 3,
    avgScore: Math.floor(Math.random() * 30) + 60,
    rank: Math.floor(Math.random() * 50) + 1,
    topSubject: 'Frontend Development',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Student List
        </button>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-1">
              <Mail className="w-4 h-4 text-gray-500" />
              {student.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-1">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              {student.collegeName}
            </p>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            Permissions
          </div>
          <div className="flex flex-wrap gap-2">
            {['Can take tests', 'View results', 'Access profile', 'Download certificates'].map((perm, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full border border-green-200"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Performance Statistics
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <FileText className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{stats.testsTaken}</p>
                <p className="text-sm text-gray-500">Tests Taken</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{stats.avgScore}%</p>
                <p className="text-sm text-gray-500">Average Score</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <Medal className="w-6 h-6 text-pink-500" />
              <div>
                <p className="text-lg font-semibold text-gray-800">#{stats.rank}</p>
                <p className="text-sm text-gray-500">Current Rank</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{stats.topSubject}</p>
                <p className="text-sm text-gray-500">Top Subject</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
