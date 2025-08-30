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
  Info,
  Award,
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
  const [countdown, setCountdown] = useState(60);
  const [buttonEnabled, setButtonEnabled] = useState(isDevelopment);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const submission = state?.submission;
  const assessment = state?.assessment;
  const sections = state?.sections;
  const settings=state?.settings;

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
      const remaining = Math.max(0, 60 - elapsed);
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
    //console.log(submission)
    navigate('/assesment', { state: { submission, assessment, sections,settings } });
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

    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-300 shadow-md p-6 space-y-10">

    {/* Header */}
    <header className="text-center space-y-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">{assessment.title}</h1>
      <p className="text-gray-500 text-sm sm:text-base">
        {assessment.description || 'No description available.'}
      </p>
    </header>

    {/* Configuration and Scoring */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* General Instructions */}
      <div className="col-span-1 sm:col-span-2 bg-gray-50 rounded-xl p-5 border shadow border-gray-300">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-green-500" /> General Instructions
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• This test will open in full-screen mode.</li>
          <li>• Do not reload or close the browser window during the test.</li>
          <li>• The timer will continue even if you leave the test.</li>
          <li>• Ensure a stable internet connection before beginning.</li>
          <li>• Retakes are allowed only if explicitly enabled.</li>
        </ul>
      </div>

      {/* Test Configuration */}
      <div className="bg-gray-50 rounded-xl p-5 border shadow border-gray-300">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-500" /> Test Configuration
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Duration: {config.total_duration_minutes || 0} mins</li>
          <li>Grace Period: {config.grace_period_minutes || 0} mins</li>
          <li>Navigation: {config.allow_section_navigation ? 'Allowed' : 'Restricted'}</li>
          <li>Shuffle Sections: {config.shuffle_sections ? 'Yes' : 'No'}</li>
          <li>Retake Allowed: {config.allow_retake ? 'Yes' : 'No'}</li>
          <li>Show Results Immediately: {config.show_results_immediately ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      {/* Scoring Rules */}
      <div className="bg-gray-50 rounded-xl p-5 border shadow border-gray-300">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" /> Scoring Rules
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Total Marks: {scoring.total_marks || 0}</li>
          <li>Passing Marks: {scoring.passing_marks || 0}</li>
          <li>Negative Marking: {scoring.negative_marking ? 'Yes' : 'No'}</li>
          <li>Deduction per Wrong: {scoring.negative_marks_per_wrong || 0}</li>
        </ul>
      </div>
    </section>

    {/* Proctoring Rules */}
    <section className="space-y-4 bg-gray-50 rounded-xl p-5 border shadow border-gray-300">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" /> Proctoring Rules & Violations
      </h2>

      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center text-sm sm:text-base font-medium shadow-sm">
        ⚠ Note: Accumulating too many violations may automatically end your test and redirect you to the dashboard.
      </div>

      <div className="divide-y divide-gray-200 text-sm text-gray-600">
        {[
          { icon: LayoutPanelLeft, label: 'Tab Switching', text: 'Leaving this tab will be recorded as a violation.' },
          { icon: MonitorX, label: 'Window Blur', text: 'Minimizing or losing focus on the browser window triggers a warning.' },
          { icon: MousePointerClick, label: 'Right Click Disabled', text: 'Attempting to right-click will trigger a warning.' },
          { icon: Copy, label: 'Copy Attempt', text: 'Copying content is prohibited.' },
          { icon: ClipboardPaste, label: 'Paste Attempt', text: 'Pasting content is prohibited.' },
          { icon: RefreshCw, label: 'Page Reload', text: 'Reloading or closing the page ends the test session.' },
          { icon: Zap, label: 'Idle Timeout', text: 'Staying inactive for too long will be considered suspicious.' }
        ].map((rule, index) => (
          <div key={index} className="flex items-start gap-3 py-2">
            <rule.icon className="w-4 h-4 text-red-400 mt-1" />
            <span><strong>{rule.label}:</strong> {rule.text}</span>
          </div>
        ))}
      </div>
    </section>
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
