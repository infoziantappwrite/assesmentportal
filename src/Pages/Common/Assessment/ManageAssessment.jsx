import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { getallAssesment } from '../../../Controllers/AssesmentController';
import {
  Clock,
  BarChart2,
  BadgeCheck,
  Settings2,
  ClipboardList,
  Search, PlusCircle, ClipboardX
} from 'lucide-react';
import Loader from '../../../Components/Loader';

const ManageAssesment = () => {
  const navigate = useNavigate();
  const { role } = useUser();

  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAssessments();
  }, [difficultyFilter, statusFilter, page, limit]);

  useEffect(() => {
    applySearchFilter(assessments, searchText);
  }, [searchText, assessments]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const params = { page, limit };

      if (difficultyFilter !== "all") {
        params.difficulty = difficultyFilter;
      }

      if (statusFilter === "active") {
        params.isActive = true;
      } else if (statusFilter === "inactive") {
        params.isActive = false;
      }

      const res = await getallAssesment(params);
      const all = res?.assessments || [];
      const pagination = res?.pagination || {};
      setAssessments(all);
      setTotal(pagination.total || 0);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = (data, search) => {
    let result = [...data];
    if (search.trim()) {
      const lowerSearch = search.trim().toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredAssessments(result);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-lg font-semibold flex items-center gap-2 text-blue-500">
          <ClipboardList className="w-5 h-5" />
          Manage Assessments
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 shadow-xl bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-32">
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

          <div className="w-full sm:w-32">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 shadow-xl rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>


          <button
            onClick={() => navigate(`${role}/assessments/create`)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {filteredAssessments.length === 0 ? (
        <p className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500">
          <ClipboardX className="w-12 h-12 mb-3 text-gray-400" />
          <span className="text-sm">No assessments found </span>
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full 
                    ${item.difficulty_level === 'easy' && 'bg-green-100 text-green-700'}
                    ${item.difficulty_level === 'medium' && 'bg-yellow-100 text-yellow-700'}
                    ${item.difficulty_level === 'hard' && 'bg-red-100 text-red-700'}
                    ${item.difficulty_level === 'mixed' && 'bg-blue-100 text-blue-700'}
                  `}
                  >
                    {item.difficulty_level}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 italic">
                  {item.description || "No description provided."}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
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

                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  {item.is_active && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  {item.is_template && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Template
                    </span>
                  )}
                  {item.is_shareable && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      Shareable
                    </span>
                  )}
                </div>

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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <label htmlFor="rowsPerPage" className="font-medium text-gray-600">Rows per page:</label>
              <div className="relative">
                <select
                  id="rowsPerPage"
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={18}>18</option>
                  <option value={24}>24</option>
                  <option value={30}>30</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                First
              </button>
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="px-2 text-gray-600 font-medium">
                Page <span className="text-blue-600">{page}</span> of{" "}
                <span className="text-blue-600">{Math.ceil(total / limit) || 1}</span>
              </span>

              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page * limit >= total}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
              <button
                onClick={() => setPage(Math.ceil(total / limit))}
                disabled={page * limit >= total}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}


    </div>
  );
};

export default ManageAssesment;
