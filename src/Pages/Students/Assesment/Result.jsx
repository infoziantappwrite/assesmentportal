import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 font-semibold text-lg">
        Result data not found.
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { total_marks, obtained_marks, percentage, section_wise_scores } = result;
  const passed = percentage >= 40; // Or use your own pass logic

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">🎉 Assessment Result</h1>
          <button
  onClick={() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    navigate('/dashboard');
  }}
  className="flex items-center text-sm text-gray-600 hover:text-blue-600"
>
  <ArrowLeftCircle className="w-5 h-5 mr-1" />
  Back to Dashboard
</button>

        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Total Marks:</strong> {total_marks}</div>
          <div><strong>Marks Scored:</strong> {obtained_marks}</div>
          <div><strong>Percentage:</strong> {percentage}%</div>
          <div><strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-white text-xs font-semibold ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
              {passed ? 'Passed' : 'Failed'}
            </span>
          </div>
        </div>

        {/* Section-wise Breakdown */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">📊 Section-wise Breakdown</h2>
          <div className="space-y-2">
            {section_wise_scores.map((sec, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="font-medium text-blue-700">{sec.section_title}</h3>
                <p className="text-sm text-gray-600">
                  Score: {sec.obtained_marks} / {sec.total_marks} <br />
                  Attempted: {sec.attempted_questions} <br />
                  Correct Answers: {sec.correct_answers}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
