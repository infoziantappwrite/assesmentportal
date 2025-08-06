import { useEffect, useState } from 'react';
import { logEvent, getViolations } from '../../../Controllers/ProctoringController';
import { useNavigate } from 'react-router-dom';

const proctoringEvent = Object.freeze({
  TAB_SWITCH: 'tab_switch',
  WINDOW_BLUR: 'window_blur',
  FULLSCREEN_EXIT: 'fullscreen_exit',
  PAGE_RELOAD: 'page_reload',
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
  const [needsFullscreenPrompt, setNeedsFullscreenPrompt] = useState(false);

  const logViolation = async (event_type, description, severity = 'medium', additionalData = {}) => {
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
      const totalViolations = violationsData.data?.violation_count || 0;

      if (totalViolations >= MAX_ATTEMPTS) {
        setPopupMessage('You have exceeded the maximum allowed violations. Redirecting to dashboard...');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          // Exit fullscreen if currently in fullscreen mode
          if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => {
              console.warn('Error exiting fullscreen:', err);
            });
          }

          // Clear localStorage
          localStorage.clear();
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

  const showWarning = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  useEffect(() => {
    let lastTabSwitch = false;
    let fullscreenExitTimer = null;

    // Detect Tab Switch (log only TAB_SWITCH)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastTabSwitch = true;
        logViolation(proctoringEvent.TAB_SWITCH, 'User switched tab', 'high');
      }
    };

    // Detect Window Blur separately
    const handleBlur = () => {
      if (!lastTabSwitch) {
        logViolation(proctoringEvent.WINDOW_BLUR, 'Browser window lost focus', 'medium');
      }
      lastTabSwitch = false;
    };

    // Fullscreen Exit (log if not returned within 10 seconds)
    let fullscreenWarningTimer;
    let fullscreenViolationTimer;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // Step 1: Show warning after 4 seconds
        fullscreenWarningTimer = setTimeout(() => {
          showWarning('You exited fullscreen! Please return within 5 seconds to avoid a violation.');
        }, 5000);
        setNeedsFullscreenPrompt(true);

        // Step 2: Log violation after 10 seconds if still not in fullscreen
        fullscreenViolationTimer = setTimeout(() => {
          logViolation(
            proctoringEvent.FULLSCREEN_EXIT,
            'User stayed out of fullscreen for more than 10 seconds',
            'high'
          );
          setNeedsFullscreenPrompt(true);
          // Show button to re-enter fullscreen
        }, 10000);
      } else {
        // User re-entered fullscreen → clear timers
        clearTimeout(fullscreenWarningTimer);
        clearTimeout(fullscreenViolationTimer);
        setNeedsFullscreenPrompt(false);
      }
    };



    // Page Reload (only if user navigates away)
    const handleBeforeUnload = (e) => {
      if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') {
        logViolation(proctoringEvent.PAGE_RELOAD, 'User attempted to leave the page', 'critical');
      }
      e.preventDefault();
    };

    // Block Copy/Paste (warning only)
    const handleCopy = () => showWarning('Copying is disabled during the assessment.');
    const handlePaste = () => showWarning('Pasting is disabled during the assessment.');

    // Block Right Click
    const handleRightClick = (e) => {
      e.preventDefault();
      showWarning('Right-click is disabled during the assessment.');
    };

    // Block Shortcuts (F12, Ctrl+Shift+I, F5, Ctrl+R, Esc)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        e.key === 'F5' ||
        (e.ctrlKey && e.key.toLowerCase() === 'r') ||
        e.key === 'Escape'
      ) {
        e.preventDefault();
        showWarning('This action is disabled during the assessment.');
      }
    };

    // Idle Timeout (warning only)
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => showWarning('You have been inactive for over 2 minutes.'), 2 * 60 * 1000);
    };

    // Attach Event Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);
    ['mousemove', 'keydown', 'mousedown'].forEach((e) => document.addEventListener(e, resetIdleTimer));

    resetIdleTimer();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
      ['mousemove', 'keydown', 'mousedown'].forEach((e) => document.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer);
      clearTimeout(fullscreenExitTimer);
    };
  }, [submission_id, student_id, assignment_id]);

  return { showPopup, popupMessage, setShowPopup, needsFullscreenPrompt };
};

export default useProctoringEvents;
