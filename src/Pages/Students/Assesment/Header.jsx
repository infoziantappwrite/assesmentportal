import React, { useEffect, useState } from 'react';
import { AlarmClock, Power, X, AlertTriangle } from 'lucide-react';
import { submitSubmission } from '../../../Controllers/SubmissionController';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const submissionId = localStorage.getItem('submission_id');
    if (!submissionId) {
      localStorage.clear();
      navigate('/dashboard');
      return;
    }

    const endTimeStr = localStorage.getItem('assessment_end_time');
    if (!endTimeStr) {
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
    const submissionId = localStorage.getItem('submission_id');
    const showResults = JSON.parse(localStorage.getItem('show_results_immediately'));

    const response = await submitSubmission(submissionId);
    localStorage.clear();

    if (showResults) {
      const resultData = response.data.results ; 
      //console.log(resultData)
      navigate('/result', { state: { result: resultData } });
    } else {
      navigate('/thank-you');
    }
  } catch (err) {
    console.error('Submission failed:', err);
  }
};


  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-6 flex items-center justify-between">
        <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />

        {timeLeft !== null && (
          <div className="flex items-center gap-2 border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-sm">
            <AlarmClock className="w-5 h-5 text-blue-600" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg shadow transition"
        >
          <Power className="w-4 h-4" />
          End Test
        </button>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg border border-gray-300 relative">
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
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                End Test
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
