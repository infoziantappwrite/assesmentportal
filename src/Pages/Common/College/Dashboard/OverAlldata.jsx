import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  ClipboardList,
  FileText,
  Hash,
  CheckCircle2,
  Timer,
  X,
  ArrowRightCircle,
} from "lucide-react";

import StudentData from './StudentData';
import TrainerData from './TrainerData';
import AssesmentData from './AssesmentData';

const OverAlldata = ({ dashboarddata }) => {
  const dashboardData = dashboarddata;
  const [candidateSearch, setCandidateSearch] = useState('');
  const [trainerSearch, setTrainerSearch] = useState('');
   const [selected, setSelected] = useState(null); // { type, data }
  // Example handler
 const handleViewDetails = (type, item) => {
    setSelected({ type, data: item });
  };

  // Handle close
  const handleClose = () => setSelected(null);



  if (!dashboardData) return <div>Loading...</div>;

  const filteredCandidates = dashboardData.candidates.filter(c =>
    c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const filteredTrainers = dashboardData.trainers.filter(t =>
    t.name.toLowerCase().includes(trainerSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(trainerSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50 min-h-screen">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
           <button
  onClick={handleClose}
  className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center transition"
>
  <X className="w-4 h-4 text-gray-600" />
</button>

            {/* Render component inside modal */}
            {selected.type === "candidate" && <StudentData student={selected.data} />}
            {selected.type === "trainer" && <TrainerData trainer={selected.data} />}
            {selected.type === "assessment" && <AssesmentData assessment={selected.data} />}
          </div>
        </div>
      )}




      {/* Candidates & Trainers */}
      {/* Candidates & Trainers Section */}
      <div className="mt-8">
        {/* Section Title + Subtitle + Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-800">
              <Users className="w-6 h-6 text-indigo-600" />
              Candidates & Trainers
            </h2>
            <p className="text-sm text-gray-500">
              Manage all registered candidates and assigned trainers in your college.
            </p>
          </div>

          {/* Total Count */}

        </div>

        {/* Grid of Candidates + Trainers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidates */}
          <div className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md p-5">
            {/* Count Badge */}
            <span className="absolute top-3 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              Total: {filteredCandidates.length}
            </span>

            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              Candidates
            </h3>

            <input
              type="text"
              placeholder="Search by name or email"
              value={candidateSearch}
              onChange={e => setCandidateSearch(e.target.value)}
              className="mb-3 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="max-h-16 overflow-y-auto">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map(c => (
                  <div
                    key={c._id}
                    className="flex justify-between items-center border border-blue-100 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 mb-3 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                    </div>
                    <button
                      onClick={() => handleViewDetails("candidate", c)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="text-gray-500 text-sm">No candidates found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Trainers */}
          <div className="relative bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl shadow-md p-5">
            {/* Count Badge */}
            <span className="absolute top-3 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              Total: {filteredTrainers.length}
            </span>

            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Trainers
            </h3>

            <input
              type="text"
              placeholder="Search by name or email"
              value={trainerSearch}
              onChange={e => setTrainerSearch(e.target.value)}
              className="mb-3 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />

            <div className="max-h-16 overflow-y-auto">
              {filteredTrainers.length > 0 ? (
                filteredTrainers.map(t => (
                  <div
                    key={t._id}
                    className="flex justify-between items-center border border-green-200 bg-green-50 hover:bg-green-100 rounded-lg px-3 py-2 mb-2 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.email}</p>
                    </div>
                    <button
                      onClick={() => handleViewDetails("trainer", t)}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </button>

                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-green-50 border border-green-200 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-gray-500 text-sm">No trainers found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>



      <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-2xl shadow-md p-5">
  {/* Title + Subtitle */}
  <div className="mb-4">
    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <ClipboardList className="w-5 h-5 text-purple-600" />
      Recent Assignments
    </h3>
    <p className="text-sm text-gray-500">
      Latest 5 assignments with status and participation details.
    </p>
  </div>

  {/* Assignment list */}
  <div className="space-y-4">
    {dashboardData?.recent5Assignments?.length > 0 ? (
      dashboardData.recent5Assignments.map((a) => (
        <div
          key={a._id}
          className="p-4 border border-purple-200 bg-purple-50 rounded-xl hover:shadow transition flex flex-col gap-3"
        >
          {/* Title + Button on same line */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              {a.title}
            </h4>

            <button
              onClick={() => handleViewDetails("assessment", a)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg shadow hover:bg-purple-700 transition"
            >
              View
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Tags below */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              <Hash className="w-3 h-3" /> {a.assessment_id._id}
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                a.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> {a.status}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              <Users className="w-3 h-3" /> Eligible: {a.stats.total_eligible}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
              <Timer className="w-3 h-3" /> Started: {a.stats.started_count}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Completed: {a.stats.completed_count}
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center h-40 bg-purple-50 border border-purple-200 rounded-lg">
        <ClipboardList className="w-8 h-8 text-purple-400 mb-2" />
        <p className="text-gray-500 text-sm">No assignments available.</p>
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default OverAlldata;
