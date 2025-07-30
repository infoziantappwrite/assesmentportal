import { useEffect } from 'react';
import { logEvent } from '../../../Controllers/ProctoringController'; // Adjust path if needed

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
  ip_address: '', // backend can auto-detect if needed
  user_agent: navigator.userAgent,
  timestamp: new Date().toISOString(),
  page_url: window.location.href,
});

const useProctoringEvents = ({ submission_id, student_id, assignment_id }) => {
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
    } catch (error) {
      console.error(`Failed to log ${event_type}:`, error);
    }
  };

  useEffect(() => {
    // 1. Tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        log(proctoringEvent.TAB_SWITCH, 'User switched tab', 'high');
      }
    };

    // 2. Window blur
    const handleBlur = () => {
      log(proctoringEvent.WINDOW_BLUR, 'Browser window lost focus', 'medium');
    };

    // 3. Right click
    const handleRightClick = (e) => {
      e.preventDefault();
      log(proctoringEvent.RIGHT_CLICK, 'Right click detected', 'medium');
    };

    // 4. Copy attempt
    const handleCopy = () => {
      log(proctoringEvent.COPY_ATTEMPT, 'User attempted to copy content', 'medium');
    };

    // 5. Paste attempt
    const handlePaste = () => {
      log(proctoringEvent.PASTE_ATTEMPT, 'User attempted to paste content', 'medium');
    };

    // 6. Fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        log(proctoringEvent.FULLSCREEN_EXIT, 'User exited fullscreen mode', 'high');
      }
    };

    // 7. Page reload or close
    const handleBeforeUnload = () => {
      log(proctoringEvent.PAGE_RELOAD, 'User attempted to reload or close the page', 'critical');
    };

    // 8. Idle detection
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        log(proctoringEvent.IDLE_TIMEOUT, 'User inactive for over 2 minutes', 'high');
      }, 2 * 60 * 1000);
    };

    // Attach event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    ['mousemove', 'keydown', 'mousedown'].forEach((e) =>
      document.addEventListener(e, resetIdleTimer)
    );

    resetIdleTimer(); // Initialize idle timer

    return () => {
      // Cleanup listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      ['mousemove', 'keydown', 'mousedown'].forEach((e) =>
        document.removeEventListener(e, resetIdleTimer)
      );
      clearTimeout(idleTimer);
    };
  }, [submission_id, student_id, assignment_id]);
};

export default useProctoringEvents;
