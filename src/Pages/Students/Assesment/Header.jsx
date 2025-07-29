import React, { useEffect, useState } from 'react';
import { AlarmClock, Power, X, AlertTriangle } from 'lucide-react';
import { submitSubmission } from '../../../Controllers/SubmissionController';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const submissionId = localStorage.getItem('submission_id');
      const showResults = JSON.parse(localStorage.getItem('show_results_immediately'));
      const response = await submitSubmission(submissionId);
      localStorage.clear();

      if (showResults) {
        navigate('/result', { state: { result: response.data.results } });
      } else {
        navigate('/thank-you');
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-2 sm:py-3 px-4 sm:px-6 flex flex-wrap gap-2 items-center justify-between">
        <img src="/Logo.png" alt="Logo" className="h-8 sm:h-10 w-auto" />

        <div className="flex items-center gap-2">
          {/* Time Left */}
          {timeLeft !== null && (
            <div className="flex items-center gap-2 border border-blue-200 rounded-md px-3 py-1.5 bg-blue-50 text-blue-700 font-medium text-sm">
              <AlarmClock className="w-5 h-5 text-blue-600" />
              <span className='md:hidden' >{formatTime(timeLeft)}</span>
              <span className="hidden sm:inline">Time Left: {formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg shadow transition"
          >
            <Power className="w-4 h-4" />
            <span >End Test</span>

          </button>
        </div>

      </header>

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
