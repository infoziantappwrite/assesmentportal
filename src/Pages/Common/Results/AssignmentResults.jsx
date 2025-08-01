import React, { useState } from 'react';

const AssignmentResults = ({ results = [] }) => {
  const [search, setSearch] = useState('');

  const filteredResults = results.filter((res) =>
    res.student_info.name.toLowerCase().includes(search.toLowerCase()) ||
    res.student_info.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200  shadow-lg">
     <div className="w-full border-b border-gray-300 p-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
      <div className="w-2 h-5 rounded-full bg-green-600"></div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Assignment Results</h2>
    </div>

    <input
      type="text"
      placeholder="Search by name or email..."
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full sm:w-80"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>


      {filteredResults.length === 0 ? (
        <div className="text-gray-500 text-center py-8 px-4">No results available.</div>
      ) : (
        <div className='p-4'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto pr-1">
          {filteredResults.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-green-200 rounded-xl p-5 shadow hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-green-700">
                {res.student_info.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{res.student_info.email}</p>
              <div className="text-sm space-y-1 text-gray-700">
                <div><strong>Status:</strong> {res.status}</div>
                <div><strong>Evaluation:</strong> {res.evaluation_status}</div>
                <div><strong>Attempt #:</strong> {res.attempt_number}</div>
                <div>
                  <strong>Score:</strong> {res.scores.obtained_marks} / {res.scores.total_marks}
                </div>
                <div>
                  <strong>Percentage:</strong> {res.scores.percentage}%
                </div>
                <div>
                  <strong>Started At:</strong>{' '}
                  {new Date(res.timing.started_at).toLocaleString()}
                </div>
                <div>
                  <strong>Time Taken:</strong>{' '}
                  {Math.floor(res.timing.total_time_taken_seconds / 60)} min{' '}
                  {res.timing.total_time_taken_seconds % 60} sec
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentResults;
