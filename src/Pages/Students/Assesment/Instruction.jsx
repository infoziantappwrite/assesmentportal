import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircle, AlarmClock, AlertTriangle, X } from 'lucide-react';

const Instruction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(60);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  // Prevent reload or tab close
  useEffect(() => {
    const beforeUnloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => window.removeEventListener('beforeunload', beforeUnloadHandler);
  }, []);

  // Prevent back button
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto fullscreen + detect exit
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();

    const checkFullScreen = () => {
      const isFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (!isFullScreen) {
        setShowExitConfirm(true);
      }
    };

    document.addEventListener('fullscreenchange', checkFullScreen);
    document.addEventListener('webkitfullscreenchange', checkFullScreen);
    document.addEventListener('mozfullscreenchange', checkFullScreen);
    document.addEventListener('MSFullscreenChange', checkFullScreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullScreen);
      document.removeEventListener('webkitfullscreenchange', checkFullScreen);
      document.removeEventListener('mozfullscreenchange', checkFullScreen);
      document.removeEventListener('MSFullscreenChange', checkFullScreen);
    };
  }, []);

  const handleProceed = () => {
    localStorage.setItem('submission_id', submission._id);
    navigate('/assesment', { state: { submission, assessment, sections } });
  };

  const handleExit = () => {
    localStorage.clear();
    navigate('/dashboard');
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  if (!submission || !assessment || !sections) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold text-lg">
        Test data not found. Please go back and try again.
      </div>
    );
  }

  const config = assessment.configuration || {};
  const scoring = assessment.scoring || {};

  return (
    <>
      {/* Header */}
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

      {/* Content */}
      <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-200">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-blue-800">{assessment.title}</h1>
            <p className="text-gray-700 text-sm">{assessment.description || 'No description available.'}</p>
          </div>

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

      {/* 🔔 Exit Warning Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl border border-gray-300 relative">
            <button
              onClick={handleCancelExit}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-3">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Exit Full Screen?
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Exiting full screen is considered an attempt and may affect your test score.
              Are you sure you want to exit?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancelExit}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Instruction;
