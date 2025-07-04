import React, { useEffect, useState } from 'react';
import { AlarmClock, Power, X ,AlertTriangle} from 'lucide-react';

const Header = ({ onEndTest, start }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let timer;

    if (start) {
      const end = new Date(localStorage.getItem('assessment_end_time'));
      timer = setInterval(() => {
        const now = new Date();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        setTimeLeft(diff);

        if (diff <= 0) {
          clearInterval(timer);
          onEndTest();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [start, onEndTest]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const confirmEndTest = () => {
    localStorage.removeItem('assessment_start_time');
    localStorage.removeItem('assessment_end_time');
    onEndTest();
    setShowConfirm(false);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-6 flex items-center justify-between">
        {/* Logo */}
        <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />

        {/* Timer */}
        {start && timeLeft !== null && (
          <div className="flex items-center gap-2 border border-blue-200 rounded px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-sm">
            <AlarmClock className="w-5 h-5 text-blue-600" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}

        {/* End Test Button */}
        {start && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded shadow transition"
          >
            <Power className="w-4 h-4" />
            End Test
          </button>
        )}
      </header>

      {/* Confirmation Modal */}
      {showConfirm && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-200">
      
      {/* Close Button */}
      <button
        onClick={() => setShowConfirm(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Warning Icon */}
      <div className="flex justify-center mb-3">
        <div className="bg-red-100 text-red-600 p-3 rounded-full">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
        End Test Early?
      </h2>

      {/* Subtext */}
      <p className="text-sm text-gray-600 text-center mb-6">
        You still have <strong>{formatTime(timeLeft)}</strong> remaining.
        Once ended, you cannot resume this test.
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={confirmEndTest}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
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
