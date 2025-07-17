import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FullscreenConfirmModal from '../Assesment/FullscreenConfirmModal';
import {
  startSubmission,
  resumeSubmission
} from '../../../Controllers/SubmissionController';

const StartTestButton = ({ test, label }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setShowConfirm(false);

      // Fullscreen for immersive experience
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      let submissionData;

      if (label === 'Resume Test') {
        // Resume using submission_id
        submissionData = await resumeSubmission(test.submission_id);

        const submissionId = submissionData?.data?.submission?._id;

        if (submissionId) {
          localStorage.setItem('submission_id', submissionId);

          // Navigate directly to assessment page
          navigate('/assesment', {
            state: {
              submission: submissionData.data.submission,
              assessment: submissionData.data.assessment,
              sections: submissionData.data.test
            }
          });
        }
      } else {
        // Start new submission using assignment ID
        submissionData = await startSubmission(test._id);

        const submissionId = submissionData?.data?.submission?._id;

        if (submissionId) {
          localStorage.setItem('submission_id', submissionId);

          // Go to Instructions page first
          navigate('/instructions', {
            state: {
              submission: submissionData.data.submission,
              assessment: submissionData.data.assessment,
              sections: submissionData.data.test,
              
            }
          });
        }
      }
    } catch (error) {
      console.error(`Error ${label === 'Resume Test' ? 'resuming' : 'starting'} submission:`, error);

      const errorMsg = error?.response?.data?.message || 'Unexpected error occurred';
      alert(`Cannot ${label.toLowerCase()}: ${errorMsg}`);
    }
  };

  return (
    <>
      <button
        onClick={handleStartClick}
        className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded text-sm hover:from-green-600 hover:to-teal-600 transition"
      >
        <PlayCircle className="w-4 h-4" />
        {label}
      </button>

      {showConfirm && (
        <FullscreenConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default StartTestButton;
