// useProctoringEvents.js
import { useEffect, useState } from 'react';
import { logEvent, getViolations } from '../../../Controllers/ProctoringController';
import { useNavigate } from 'react-router-dom';

const proctoringEvent = Object.freeze({
  TAB_SWITCH: 'tab_switch',
  WINDOW_BLUR: 'window_blur',
  RIGHT_CLICK: 'right_click',
  COPY_ATTEMPT: 'copy_attempt',
  PASTE_ATTEMPT: 'paste_attempt',
  FULLSCREEN_EXIT: 'fullscreen_exit',
  PAGE_RELOAD: 'page_reload',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  IDLE_TIMEOUT: 'idle_timeout',
});

const getSessionInfo = () => ({
  ip_address: '',
  user_agent: navigator.userAgent,
  timestamp: new Date().toISOString(),
  page_url: window.location.href,
});

const useProctoringEvents = ({ submission_id, student_id, assignment_id }) => {
  const navigate = useNavigate();
  const MAX_ATTEMPTS = 5;
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const log = async (event_type, description, severity = 'medium', additionalData = {}) => {
    try {
      await logEvent({
        submission_id,
        student_id,
        assignment_id,
        event_type,
        severity,
        event_details: {
          description,
          previous_tab_title: document.title || '',
          duration_seconds: 0,
          additional_data: additionalData,
        },
        session_info: getSessionInfo(),
      });

      const violationsData = await getViolations(submission_id);
      const totalViolations = violationsData.data?.summary?.total || 0;

      if (totalViolations >= MAX_ATTEMPTS) {
        setPopupMessage('You have exceeded the maximum allowed violations. Redirecting to dashboard...');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/dashboard');
        }, 3000);
      } else {
        const attemptsLeft = MAX_ATTEMPTS - totalViolations;
        setPopupMessage(`Proctoring violation detected! You have ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} left.`);
        setShowPopup(true);
      }
    } catch (error) {
      console.error(`Failed to process ${event_type}:`, error);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => { if (document.hidden) log(proctoringEvent.TAB_SWITCH, 'User switched tab', 'high'); };
    const handleBlur = () => log(proctoringEvent.WINDOW_BLUR, 'Browser window lost focus', 'medium');
    const handleRightClick = (e) => { e.preventDefault(); log(proctoringEvent.RIGHT_CLICK, 'Right click detected', 'medium'); };
    const handleCopy = () => log(proctoringEvent.COPY_ATTEMPT, 'User attempted to copy content', 'medium');
    const handlePaste = () => log(proctoringEvent.PASTE_ATTEMPT, 'User attempted to paste content', 'medium');
    const handleFullscreenChange = () => { if (!document.fullscreenElement) log(proctoringEvent.FULLSCREEN_EXIT, 'User exited fullscreen mode', 'high'); };
    const handleBeforeUnload = () => log(proctoringEvent.PAGE_RELOAD, 'User attempted to reload or close the page', 'critical');

    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => log(proctoringEvent.IDLE_TIMEOUT, 'User inactive for over 2 minutes', 'high'), 2 * 60 * 1000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    ['mousemove', 'keydown', 'mousedown'].forEach((e) => document.addEventListener(e, resetIdleTimer));

    resetIdleTimer();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      ['mousemove', 'keydown', 'mousedown'].forEach((e) => document.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer);
    };
  }, [submission_id, student_id, assignment_id]);

  return { showPopup, popupMessage, setShowPopup };
};

export default useProctoringEvents;
