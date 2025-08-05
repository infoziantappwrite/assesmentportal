import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  AlarmClock,
  AlertTriangle,
  X,
  Timer,
  Repeat,
  Shuffle,
  FileCheck2,
  EyeOff,
  CheckCircle,
  XOctagon,
  MinusCircle,
  MonitorX,
  Copy,
  ClipboardPaste,
  MousePointerClick,
  LayoutPanelLeft,
  RefreshCw,
  Zap
} from 'lucide-react';

const Instruction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const isDevelopment = window.location.hostname === 'localhost';
  const [countdown, setCountdown] = useState(30);
  const [buttonEnabled, setButtonEnabled] = useState(isDevelopment);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const submission = state?.submission;
  const assessment = state?.assessment;
  const sections = state?.sections;

  // Timer only for production
  useEffect(() => {
    if (!submission || !assessment || !sections) return;
    if (isDevelopment) return;

    const savedStartTime = localStorage.getItem('instruction_timer_start');
    let startTime = savedStartTime ? new Date(savedStartTime) : new Date();

    if (!savedStartTime) {
      localStorage.setItem('instruction_timer_start', startTime.toISOString());
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - new Date(startTime)) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setCountdown(remaining);

      if (remaining <= 0) {
        setButtonEnabled(true);
        localStorage.removeItem('instruction_timer_start');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submission, assessment, sections, isDevelopment]);

  // Fullscreen enforcement
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
    console.log(submission)
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
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 fixed top-0 left-0 z-40">
        <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />

        <div className="flex sm:flex-row items-center gap-2 sm:gap-3">
          {!isDevelopment && !buttonEnabled && (
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-semibold whitespace-nowrap">
              <AlarmClock className="w-4 h-4" />
              {countdown}
            </div>
          )}

          <button
            onClick={handleProceed}
            disabled={!buttonEnabled}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow transition
              ${buttonEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            <PlayCircle className="w-4 h-4" />
            Start
          </button>
        </div>
      </header>

      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-white py-4 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-10 border border-gray-200">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-blue-800">{assessment.title}</h1>
            <p className="text-gray-700 text-sm">{assessment.description || 'No description available.'}</p>
          </div>

          {/* General Instructions */}
          <div className="bg-blue-100/60 border-l-4 border-blue-500 rounded-lg p-5 text-sm text-blue-900">
            <h2 className="text-base font-semibold mb-3">📝 General Instructions</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>This test will open in full-screen mode.</li>
              <li>Do not reload or close the browser window during the test.</li>
              <li>The timer will continue even if you leave the test.</li>
              <li>Ensure a stable internet connection before beginning.</li>
              <li>Retakes are allowed only if explicitly enabled.</li>
            </ul>
          </div>

          {/* Proctoring Violations */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5 text-sm text-red-900">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" /> Proctoring Rules & Violations
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <LayoutPanelLeft className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Tab Switching:</strong> Leaving this tab will be recorded as a violation.</span>
              </li>
              <li className="flex items-start gap-3">
                <MonitorX className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Window Blur:</strong> Minimizing or losing focus on the browser window triggers a warning.</span>
              </li>
              <li className="flex items-start gap-3">
                <MousePointerClick className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Right Click Disabled:</strong> Attempting to right-click will trigger a warning.</span>
              </li>
              <li className="flex items-start gap-3">
                <Copy className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Copy Attempt:</strong> Copying content is prohibited.</span>
              </li>
              <li className="flex items-start gap-3">
                <ClipboardPaste className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Paste Attempt:</strong> Pasting content is prohibited.</span>
              </li>
              <li className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Page Reload:</strong> Reloading or closing the page ends the test session.</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-red-500 mt-1" />
                <span><strong>Idle Timeout:</strong> Staying inactive for too long will be considered suspicious.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium">
              <strong>Note:</strong> Accumulating too many violations may automatically end your test and redirect you to the dashboard.
            </p>
          </div>
          {/* Config and Scoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" /> Test Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
                <div className="flex gap-2 items-center"><Timer className="w-4 h-4" /> Duration: {config.total_duration_minutes || 0} mins</div>
                <div className="flex gap-2 items-center"><AlarmClock className="w-4 h-4" /> Grace Period: {config.grace_period_minutes || 0} mins</div>
                <div className="flex gap-2 items-center"><FileCheck2 className="w-4 h-4" /> Navigation: {config.allow_section_navigation ? 'Allowed' : 'Restricted'}</div>
                <div className="flex gap-2 items-center"><Shuffle className="w-4 h-4" /> Shuffle Sections: {config.shuffle_sections ? 'Yes' : 'No'}</div>
                <div className="flex gap-2 items-center"><Repeat className="w-4 h-4" /> Retake Allowed: {config.allow_retake ? 'Yes' : 'No'}</div>
                <div className="flex gap-2 items-center"><MinusCircle className="w-4 h-4" /> Max Attempts: {config.max_attempts || 1}</div>
                <div className="flex gap-2 items-center"><EyeOff className="w-4 h-4" /> Show Results Immediately: {config.show_results_immediately ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" /> Scoring Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
                <div className="flex gap-2 items-center"><CheckCircle className="w-4 h-4" /> Total Marks: {scoring.total_marks || 0}</div>
                <div className="flex gap-2 items-center"><CheckCircle className="w-4 h-4" /> Passing Marks: {scoring.passing_marks || 0}</div>
                <div className="flex gap-2 items-center"><XOctagon className="w-4 h-4" /> Negative Marking: {scoring.negative_marking ? 'Yes' : 'No'}</div>
                <div className="flex gap-2 items-center"><MinusCircle className="w-4 h-4" /> Deduction per Wrong: {scoring.negative_marks_per_wrong || 0}</div>
              </div>
            </div>
          </div>

          {/* Config and Scoring (unchanged) */}
          {/* ... existing configuration and scoring blocks ... */}
        </div>
      </div>

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
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Exit Full Screen?</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Exiting full screen is considered an attempt and may affect your test score.
              Are you sure you want to exit?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={handleCancelExit} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
              <button onClick={handleExit} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm">Exit Anyway</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Instruction;
