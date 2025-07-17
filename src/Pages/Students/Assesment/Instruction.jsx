import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import Header from './Header';

const Instruction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const submission = state?.submission;
  const assessment = state?.assessment;
  const sections = state?.sections;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setButtonEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!submission || !assessment || !sections) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold text-lg">
        Test data not found. Please go back and try again.
      </div>
    );
  }

  const handleProceed = () => {
    localStorage.setItem('submission_id', submission._id);
    navigate('/assesment', {
      state: {
        submission,
        assessment,
        sections,
      },
    });
  };

  const config = assessment.configuration || {};
  const scoring = assessment.scoring || {};

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-200">
          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-blue-800">{assessment.title}</h1>
            <p className="text-gray-700 text-sm">{assessment.description || 'No description available.'}</p>
          </div>

          {/* Instructions Box */}
          <div className="bg-blue-100/60 border-l-4 border-blue-500 rounded-lg p-5 text-sm text-blue-900">
            <h2 className="text-base font-semibold mb-2">📝 General Instructions</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>This test will open in full-screen mode.</li>
              <li>Do not reload or close the browser window during the test.</li>
              <li>The timer will continue even if you leave the test.</li>
              <li>Ensure a stable internet connection before beginning.</li>
              <li>Retakes are allowed only if explicitly enabled.</li>
            </ul>
          </div>

          {/* Config + Scoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration Card */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">⚙️ Test Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
                <div><strong>Duration:</strong> {config.total_duration_minutes || 0} mins</div>
                <div><strong>Grace Period:</strong> {config.grace_period_minutes || 0} mins</div>
                <div><strong>Allow Navigation:</strong> {config.allow_section_navigation ? 'Yes' : 'No'}</div>
                <div><strong>Shuffle Sections:</strong> {config.shuffle_sections ? 'Yes' : 'No'}</div>
                <div><strong>Allow Retake:</strong> {config.allow_retake ? 'Yes' : 'No'}</div>
                <div><strong>Max Attempts:</strong> {config.max_attempts || 1}</div>
                <div><strong>Show Results Immediately:</strong> {config.show_results_immediately ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Scoring Card */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">📊 Scoring Rules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
                <div><strong>Total Marks:</strong> {scoring.total_marks || 0}</div>
                <div><strong>Passing Marks:</strong> {scoring.passing_marks || 0}</div>
                <div><strong>Negative Marking:</strong> {scoring.negative_marking ? 'Yes' : 'No'}</div>
                <div><strong>Deduct per Wrong:</strong> {scoring.negative_marks_per_wrong || 0}</div>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="text-right">
            <button
              onClick={handleProceed}
              disabled={!buttonEnabled}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium shadow transition 
              ${
                buttonEnabled
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              <PlayCircle className="w-5 h-5" />
              {buttonEnabled ? 'Proceed to Test' : `Start in ${countdown}s`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Instruction;
