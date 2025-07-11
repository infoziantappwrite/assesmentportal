import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { getallAssesment } from '../../../Controllers/AssesmentController';
import { Clock, BarChart2, BadgeCheck, Settings2, ClipboardList, Search } from 'lucide-react';
import Loader from '../../../Components/Loader';

const ManageAssesment = () => {
  const navigate = useNavigate();
  const { role } = useUser();

  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await getallAssesment();
        const all = res?.assessments || [];
        setAssessments(all);
        applyFilter(all, difficultyFilter);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  useEffect(() => {
    applyFilter(assessments, difficultyFilter);
  }, [difficultyFilter, assessments]);

  const applyFilter = (data, level) => {
    if (level === "all") {
      setFilteredAssessments(data);
    } else {
      setFilteredAssessments(data.filter(a => a.difficulty_level === level));
    }
  };
  if(loading){
    return <Loader/>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-lg font-semibold flex items-center gap-2 text-blue-500">
          <ClipboardList className="w-5 h-5" />
          Manage Assessments
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto flex-wrap">
          {/* Search Placeholder */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title (coming soon)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 shadow-xl bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          {/* Difficulty Level Filter */}
          <div className="w-full sm:w-48">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 shadow-xl rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <button
            onClick={() => navigate(`/${role}/assessments/create`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-xl"
          >
            + Create Assessment
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading assessments...</p>
      ) : filteredAssessments.length === 0 ? (
        <p className="text-gray-500 text-sm">No assessments found for this difficulty level.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredAssessments.map((item) => (
  <div
    key={item._id}
    className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
  >
    {/* Title + Difficulty */}
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
      <span className={`text-xs font-medium px-2 py-1 rounded-full 
        ${item.difficulty_level === 'easy' && 'bg-green-100 text-green-700'}
        ${item.difficulty_level === 'medium' && 'bg-yellow-100 text-yellow-700'}
        ${item.difficulty_level === 'hard' && 'bg-red-100 text-red-700'}
        ${item.difficulty_level === 'mixed' && 'bg-blue-100 text-blue-700'}
      `}>
        {item.difficulty_level}
      </span>
    </div>

    {/* Description */}
    <p className="text-sm text-gray-600 mb-4 italic">
      {item.description || "No description provided."}
    </p>

    {/* Info Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" />
        <span>{item.configuration.total_duration_minutes} mins</span>
      </div>
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-indigo-500" />
        <span>Attempts: {item.configuration.max_attempts}</span>
      </div>
      <div className="flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-green-500" />
        <span>Total Marks: {item.scoring.total_marks}</span>
      </div>
      <div className="flex items-center gap-2">
        <BadgeCheck className="w-4 h-4 text-emerald-500" />
        <span>Passing: {item.scoring.passing_marks}</span>
      </div>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 text-xs mb-3">
      {item.is_active && (
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
      )}
      {item.is_template && (
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Template</span>
      )}
      {item.is_shareable && (
        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Shareable</span>
      )}
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
      <p>Created: {new Date(item.createdAt).toLocaleDateString()}</p>
      <button
        className="text-green-600 hover:underline font-medium"
        onClick={() => navigate(`/${role}/assessments/${item._id}`)}
      >
        View Details
      </button>
      <button
        className="text-blue-500 hover:underline font-medium"
        onClick={() => navigate(`/${role}/assessments/edit/${item._id}`)}
      >
        Edit Details
      </button>
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default ManageAssesment;
