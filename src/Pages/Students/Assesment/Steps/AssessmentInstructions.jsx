import React, { useEffect, useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

const WAIT_SECONDS = 1 * 60; // 5 minutes

const AssessmentInstructions = ({ test, onStartTest }) => {
  const [timeLeft, setTimeLeft] = useState(WAIT_SECONDS);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    if (!test) return;

    const storageKey = `instruction_start_time_${test._id}`;
    const existingStart = localStorage.getItem(storageKey);

    let startTime;

    if (existingStart) {
      startTime = new Date(existingStart);
    } else {
      startTime = new Date();
      localStorage.setItem(storageKey, startTime.toISOString());
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, WAIT_SECONDS - elapsedSeconds);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setButtonEnabled(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [test]);

  const handleStart = () => {
    localStorage.removeItem(`instruction_start_time_${test._id}`);
    onStartTest();
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">{test.title}</h1>
      <p className="text-gray-700 text-lg">{test.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <strong>Date:</strong> {new Date(test.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          <strong>Duration:</strong> {test.duration} minutes
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Instructions:</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>Do not close the browser tab during the test.</li>
          <li>Once started, you cannot return to the instructions page.</li>
          <li>All questions are mandatory unless mentioned otherwise.</li>
          <li>The test will auto-submit when the timer ends.</li>
        </ul>
      </div>

      <div className="bg-white border rounded-md p-4 mt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Answer Status Legend:</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Not Answered</span>
          </div>
        </div>
      </div>

      {!buttonEnabled && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md p-4">
          ⏳ Please read the instructions carefully. <br />
          You can start the test in <strong>{formatTime(timeLeft)}</strong>.
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleStart}
          disabled={!buttonEnabled}
          className={`px-6 py-2 rounded text-sm font-medium transition ${
            buttonEnabled
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Start Test
        </button>
      </div>
    </main>
  );
};

export default AssessmentInstructions;
