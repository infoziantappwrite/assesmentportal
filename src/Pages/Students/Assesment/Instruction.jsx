import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircle, AlarmClock } from 'lucide-react';

const Instruction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(60);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const submission = state?.submission;
  const assessment = state?.assessment;
  const sections = state?.sections;

  useEffect(() => {
    if (!submission || !assessment || !sections) return;

    const savedStartTime = localStorage.getItem('instruction_timer_start');
    let startTime = savedStartTime ? new Date(savedStartTime) : new Date();

    if (!savedStartTime) {
      localStorage.setItem('instruction_timer_start', startTime.toISOString());
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - new Date(startTime)) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setCountdown(remaining);

      if (remaining <= 0) {
        setButtonEnabled(true);
        localStorage.removeItem('instruction_timer_start');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submission, assessment, sections]);

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
      {/* Fixed Header with Countdown and Start Button */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-6 flex items-center justify-between fixed top-0 left-0 z-40">
        <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded border border-blue-200 bg-blue-50 text-blue-700 font-semibold">
            <AlarmClock className="w-4 h-4" />
            {buttonEnabled ? 'Ready to Start' : `Start in ${countdown}s`}
          </div>
          <button
            onClick={handleProceed}
            disabled={!buttonEnabled}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded shadow transition
              ${
                buttonEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          >
            <PlayCircle className="w-4 h-4" />
            Start Test
          </button>
        </div>
      </header>

      {/* Instruction Content */}
      <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
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
        </div>
      </div>
    </>
  );
};

export default Instruction;
