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

      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      let submissionData;
      if (label === 'Resume Test') {
        submissionData = await resumeSubmission(test.submission_id);
      } else {
        submissionData = await startSubmission(test._id);
      }

      const submission = submissionData?.data?.submission;
      const assessment = submissionData?.data?.assessment;
      const sections = submissionData?.data?.test;
      const submissionId = submission?._id;

      if (!submissionId) return;

      localStorage.setItem('submission_id', submissionId);

      const totalDuration = sections.reduce(
        (sum, sec) => sum + (sec.configuration?.duration_minutes || 0),
        0
      );

      localStorage.setItem('assessment_duration', totalDuration);

      let startTime = label === 'Resume Test'
        ? new Date(submission.timing?.started_at)
        : new Date();

      const endTime = new Date(startTime.getTime() + totalDuration * 60000);
      localStorage.setItem('assessment_end_time', endTime.toISOString());

      navigate(label === 'Resume Test' ? '/assesment' : '/instructions', {
        state: {
          submission,
          assessment,
          sections
        }
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while starting/resuming the test.');
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
