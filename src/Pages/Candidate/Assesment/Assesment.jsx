import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import AssessmentInstructions from './Steps/AssessmentInstructions';
import AssessmentQuestions from './Steps/AssessmentQuestions';
import ThankYou from "./ThankYou"

const Assesment = () => {
  const { state } = useLocation();
  const test = state?.test;
  const [step, setStep] = useState(0); // 0 = instructions, 1 = questions
  const [completed, setCompleted] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);


  useEffect(() => {
    if (!test) return;
    const started = localStorage.getItem('assessment_start_time');
    if (started) setStep(0); // If already started, skip instructions
  }, [test]);

  useEffect(() => {
  const checkFullscreenExit = () => {
    const isFullscreen = document.fullscreenElement !== null;
    if (!isFullscreen && step === 1 && !completed) {
      setShowFullscreenWarning(true);
    }
  };

  document.addEventListener('fullscreenchange', checkFullscreenExit);
  document.addEventListener('webkitfullscreenchange', checkFullscreenExit); // Safari
  document.addEventListener('mozfullscreenchange', checkFullscreenExit); // Firefox
  document.addEventListener('MSFullscreenChange', checkFullscreenExit); // IE

  return () => {
    document.removeEventListener('fullscreenchange', checkFullscreenExit);
    document.removeEventListener('webkitfullscreenchange', checkFullscreenExit);
    document.removeEventListener('mozfullscreenchange', checkFullscreenExit);
    document.removeEventListener('MSFullscreenChange', checkFullscreenExit);
  };
}, [step, completed]);


  const startTest = () => {
    const now = new Date();
    const end = new Date(now.getTime() + test.duration * 60 * 1000);
    localStorage.setItem('assessment_start_time', now.toISOString());
    localStorage.setItem('assessment_end_time', end.toISOString());
    setStep(1);
  };

  const endTest = () => {
    localStorage.removeItem('assessment_start_time');
    localStorage.removeItem('assessment_end_time');
    setCompleted(true);
    // you can use this for ThankYou screen
  };
  if (completed) {
    return <ThankYou />;
  }

  if (!test) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-semibold">No test data available.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header onEndTest={endTest} start={step === 1} />
      {step === 0 ? (
        <AssessmentInstructions test={test} onStartTest={startTest} />
      ) : (
        <AssessmentQuestions test={test} />
      )}
      {showFullscreenWarning && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
      <h2 className="text-lg font-semibold text-red-600">Fullscreen Exited</h2>
      <p className="text-sm text-gray-600">
        You exited fullscreen mode. Please return to fullscreen to continue the test.
      </p>
      <button
        onClick={async () => {
          await document.documentElement.requestFullscreen();
          setShowFullscreenWarning(false);
        }}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Go Fullscreen
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default Assesment;
