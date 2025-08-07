import React, { useState, useEffect } from "react";
import { getAssignmentResults } from '../../../Controllers/AssignmentControllers';
import { RefreshCw } from 'lucide-react'; // You can swap this with your icon lib
// import Loader from './Loader'; // Uncomment if you have a custom Loader component

const AssignmentResults = ({ id }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState([]);
  
  const [refreshing, setRefreshing] = useState(false);
  const resultsPerPage = 6;

  const fetchResults = async () => {
    try {
     
      const response = await getAssignmentResults(id);
      setResults(response.data || []);
    } catch {
      // Handle error if needed
    } finally {
      
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchResults();
  };

  // Filter results by search
  const filteredResults = results.filter(
    (res) =>
      res.student_info.name.toLowerCase().includes(search.toLowerCase()) ||
      res.student_info.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  let visiblePages = [];
  if (totalPages <= 3) {
    visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage === 1) visiblePages = [1, 2, 3];
    else if (currentPage === totalPages) visiblePages = [totalPages - 2, totalPages - 1, totalPages];
    else visiblePages = [currentPage, currentPage + 1, currentPage + 2];
  }

  

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 shadow-lg">
      {/* Header */}
      <div className="w-full border-b border-gray-300 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-2 h-5 rounded-full bg-green-600"></div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Assignment Results
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full sm:w-80"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Results Table */}
      {currentResults.length === 0 ? (
        <div className="text-gray-500 text-center py-8 px-4">
          No results available.
        </div>
      ) : (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-green-200 text-left text-sm table-fixed">
              <thead className="bg-green-100 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="border border-green-200 p-2 w-8">#</th>
                  <th className="border border-green-200 p-2 w-32 truncate">Name</th>
                  <th className="border border-green-200 p-2 w-48 truncate">Email</th>
                  <th className="border border-green-200 p-2 w-20">Status</th>
                  <th className="border border-green-200 p-2 w-24">Evaluation</th>
                  <th className="border border-green-200 p-2 w-16">Attempt</th>
                  <th className="border border-green-200 p-2 w-24">Score</th>
                  <th className="border border-green-200 p-2 w-24">Percentage</th>
                  <th className="border border-green-200 p-2 w-24">Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {currentResults.map((res, index) => (
                  <tr
                    key={res.id}
                    className="hover:bg-green-50 transition-colors duration-200 text-gray-700"
                  >
                    <td className="border border-green-200 p-2 text-center font-semibold text-green-700">
                      {startIndex + index + 1}
                    </td>
                    <td className="border border-green-200 p-2 truncate font-medium text-green-800" title={res.student_info.name}>
                      {res.student_info.name}
                    </td>
                    <td className="border border-green-200 p-2 truncate text-blue-600" title={res.student_info.email}>
                      {res.student_info.email}
                    </td>
                    <td className="border border-green-200 p-2 text-yellow-600">
                      {res.status}
                    </td>
                    <td className="border border-green-200 p-2 text-green-600">
                      {res.evaluation_status}
                    </td>
                    <td className="border border-green-200 p-2 text-pink-600">
                      {res.attempt_number}
                    </td>
                    <td className="border border-green-200 p-2 text-green-700">
                      {res.scores.obtained_marks}/{res.scores.total_marks}
                    </td>
                    <td className="border border-green-200 p-2 font-bold text-green-600">
                      {res.scores.percentage.toFixed(2)}%
                    </td>
                    <td className="border border-green-200 p-2 text-red-500">
                      {Math.floor(res.timing.total_time_taken_seconds / 60)} min{" "}
                      {res.timing.total_time_taken_seconds % 60} sec
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4 text-sm">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-green-100 disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-green-100 disabled:opacity-50"
              >
                Prev
              </button>
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded-lg ${
                    currentPage === page
                      ? "bg-green-500 text-white"
                      : "hover:bg-green-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-green-100 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-green-100 disabled:opacity-50"
              >
                Last
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentResults;
