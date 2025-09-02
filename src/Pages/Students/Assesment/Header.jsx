import React, { useEffect, useState } from 'react';
import { AlarmClock, Power, X, AlertTriangle, Maximize } from 'lucide-react';
import { submitSubmission } from '../../../Controllers/SubmissionController';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const submissionId = localStorage.getItem('submission_id');
    const endTimeStr = localStorage.getItem('assessment_end_time');
    if (!submissionId || !endTimeStr) {
      localStorage.clear();
      navigate('/dashboard');
      return;
    }

    const endTime = new Date(endTimeStr);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const submissionId = localStorage.getItem('submission_id');
      await submitSubmission(submissionId);
      localStorage.clear();
      navigate('/thank-you');
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-2 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
        {/* Left: Logo + Fullscreen */}
       {/* Left: Logo + Fullscreen */}
<div className="flex items-center gap-2">
  <img src="/Logo.png" alt="Logo" className="h-8 sm:h-10 w-auto" />
  
  {/* Show fullscreen button only if NOT in fullscreen */}
  {!isFullscreen && (
    <button
      onClick={handleFullscreen}
      className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
    >
      <Maximize className="w-5 h-5 sm:mr-2" />
      <span className="hidden sm:inline text-sm">Go Fullscreen</span>
    </button>
  )}
</div>


        {/* Right: Timer + End Test */}
        <div className="flex items-center gap-2 ml-auto">
          {timeLeft !== null && (
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 border border-blue-200 rounded-md bg-blue-50 text-blue-700 font-medium text-sm">
              <AlarmClock className="w-5 h-5" />
              <span className="text-xs sm:text-sm">{formatTime(timeLeft)}</span>
              <span className="hidden sm:inline">Time Left</span>
            </div>
          )}

          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center p-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg shadow transition"
          >
            <Power className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">End Test</span>
          </button>
        </div>
      </header>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-lg border border-gray-300 relative">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-3">
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">End Test?</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              You still have <strong>{formatTime(timeLeft)}</strong> left. Are you sure?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm w-full sm:w-auto"
              >
                End Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/100 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-blue-700 font-medium text-sm">Submitting your test, please wait...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
