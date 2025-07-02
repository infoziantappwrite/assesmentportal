import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import FullscreenConfirmModal from '../Assesment/FullscreenConfirmModal';
import { useNavigate } from 'react-router-dom';

const StartTestButton = ({ test }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    setShowConfirm(true);
  };

  const enterFullscreenAndStart = async () => {
    setShowConfirm(false);

    // Fullscreen
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    // Store start and end time
    const now = new Date();
    const end = new Date(now.getTime() + test.duration * 60 * 1000);
    localStorage.setItem('assessment_start_time', now.toISOString());
    localStorage.setItem('assessment_end_time', end.toISOString());

    // Navigate to assessment page
    navigate('/assessment', { state: { test } });
  };

  return (
    <>
      <button
        onClick={handleStartClick}
        className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded text-sm hover:from-green-600 hover:to-teal-600 transition"
      >
        <PlayCircle className="w-4 h-4" />
        Start Test
      </button>

      {showConfirm && (
        <FullscreenConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={enterFullscreenAndStart}
        />
      )}
    </>
  );
};

export default StartTestButton;
