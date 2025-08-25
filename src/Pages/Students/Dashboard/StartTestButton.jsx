import React, { useState } from 'react';
import { PlayCircle, Loader2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FullscreenConfirmModal from '../Assesment/FullscreenConfirmModal';
import NotificationMessage from '../../../Components/NotificationMessage';
import {
  startSubmission,
  resumeSubmission
} from '../../../Controllers/SubmissionController';

const StartTestButton = ({ test, label }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  const navigate = useNavigate();

  // Helper function to show notifications
  const showNotification = (type, message) => {
    setNotification({ 
      show: true, 
      type, 
      message 
    });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleStartClick = () => {
    setShowConfirm(true);
  };
  const getScreenResolution = () => {
  return `${window.screen.width}x${window.screen.height}`;
};


  const handleConfirm = async () => {
    try {
      setShowConfirm(false);
      setLoading(true);

      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      // API Call
     let submissionData;
const screenResolution = getScreenResolution();

if (label === 'Resume Test') {
  submissionData = await resumeSubmission(test.submission_id);
} else {
  submissionData = await startSubmission(test._id, screenResolution);
}


      const { submission, assessment, test: sections } = submissionData.data;
      const submissionId = submission?._id;
      if (!submissionId) return;

      localStorage.setItem('submission_id', submissionId);
      

      const totalDuration = sections.reduce(
        (sum, sec) => sum + (sec.configuration?.duration_minutes || 0),
        0
      );
      localStorage.setItem('assessment_duration', totalDuration);

      const startTime =
        label === 'Resume Test'
          ? new Date(submission.timing?.started_at)
          : new Date();

      const endTime = new Date(startTime.getTime() + totalDuration * 60000);
      localStorage.setItem('assessment_end_time', endTime.toISOString());

      // Delay before navigation
      setTimeout(() => {
        navigate(label === 'Resume Test' ? '/assesment' : '/instructions', {
          state: { submission, assessment, sections,settings:test.settings }
        });
      }, 1500);
    } 
    catch (error) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while starting/resuming the test.';

      showNotification('error', errorMessage); // ✅ Show detailed error message with notification
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleStartClick}
        disabled={loading}
        className="mt-2 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-teal-600 transition flex justify-center items-center gap-2"
      >
        <PlayCircle className="w-4 h-4" />
        <span className="font-medium">{label}</span>
      </button>


      {showConfirm && (
        <FullscreenConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* 🌀 Full Page Loader */}
      {loading && (
        <div className="fixed inset-0 bg-white/100 z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
          <p className="text-blue-700 font-medium">Preparing your test, please wait...</p>
        </div>
      )}

      {/* Notification Message */}
      {notification.show && notification.message && (
        <NotificationMessage
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </>
  );
};

export default StartTestButton;
