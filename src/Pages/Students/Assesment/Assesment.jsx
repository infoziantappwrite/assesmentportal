import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, AlertTriangle } from 'lucide-react';
import Header from './Header';
import QuizQuestion from './QuestionTypes/QuizQuestion';
import CodingQuestion from './QuestionTypes/CodingQuestion';
import DescriptiveQuestion from './QuestionTypes/DescriptiveQuestion';
import { getAnsweredStatus } from '../../../Controllers/SubmissionController';

const Assessment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sections } = state;
  const submissionId = localStorage.getItem('submission_id');

  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const activeSection = sections[sectionIndex];
  const question = activeSection.questions[questionIndex];
  useEffect(() => {
  const beforeUnloadHandler = (e) => {
    // Show warning before reload or tab close
    e.preventDefault();
    e.returnValue = ''; // Required for Chrome
    return '';
  };

  window.addEventListener('beforeunload', beforeUnloadHandler);

  return () => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
  };
}, []);


  useEffect(() => {
    getAnsweredStatus(submissionId, question._id)
      .then(({ data }) => {
        if (data.answered) {
          const val = data.selected_options ?? data.code_solution ?? data.text_answer;
          setAnswers((prev) => ({ ...prev, [question._id]: val }));
        }
      })
      .catch(console.error);
  }, [submissionId, question._id]);

  useEffect(() => {
    const checkFullScreen = () => {
      const isFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (!isFullScreen) {
        setShowExitConfirm(true);
      }
    };

    document.addEventListener('fullscreenchange', checkFullScreen);
    document.addEventListener('webkitfullscreenchange', checkFullScreen);
    document.addEventListener('mozfullscreenchange', checkFullScreen);
    document.addEventListener('MSFullscreenChange', checkFullScreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullScreen);
      document.removeEventListener('webkitfullscreenchange', checkFullScreen);
      document.removeEventListener('mozfullscreenchange', checkFullScreen);
      document.removeEventListener('MSFullscreenChange', checkFullScreen);
    };
  }, []);

  const handleExitConfirm = () => {
    localStorage.clear();
    navigate('/dashboard');
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const renderQuestion = () => {
    const props = { question, answer: answers[question._id] };
    switch (question.type) {
      case 'single_correct':
      case 'multi_correct':
        return <QuizQuestion {...props} />;
      case 'coding':
        return <CodingQuestion {...props} />;
      case 'descriptive':
        return <DescriptiveQuestion {...props} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  const getQuestionStatusClass = (qid, idx) => {
    const isCurrent = idx === questionIndex;
    const isAnswered = answers[qid];

    if (isCurrent) return 'bg-blue-600 text-white';
    if (isAnswered) return 'border-2 border-green-500 border-dotted text-green-600 bg-green-50';
    return 'bg-gray-200 text-gray-700';
  };

  return (
  <div className="min-h-screen bg-gray-50 relative">
    <Header />

    {/* Section Tabs */}
    <div className="flex gap-2 p-4 overflow-x-auto border-b border-gray-200">
      {sections.map((sec, idx) => (
        <button
          key={sec._id}
          onClick={() => {
            setSectionIndex(idx);
            setQuestionIndex(0);
          }}
          className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
            idx === sectionIndex
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
        >
          {sec.title}
        </button>
      ))}
    </div>

    {/* Section Info */}
    <div className="px-6 py-3 bg-white border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">{activeSection.title}</h2>
      {activeSection.description && (
        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{activeSection.description}</p>
      )}
      <p className="text-sm text-gray-500 mt-1">
        ⏱️ Duration: {activeSection.configuration?.duration_minutes} mins
      </p>
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-4">
      {/* Left Panel – Question Navigation */}
      <div className="lg:col-span-1 bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Questions</h3>
        <div className="flex flex-wrap gap-2">
          {activeSection.questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setQuestionIndex(idx)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition duration-150 ${getQuestionStatusClass(
                q._id,
                idx
              )}`}
              title={answers[q._id] ? 'Answered' : 'Not Answered'}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel – Question Content */}
      <div className="lg:col-span-3 bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="mb-4 font-semibold text-lg text-gray-800">
          Q{questionIndex + 1}. {question.content.question_text}
        </h2>

        {renderQuestion()}

        {/* Prev/Next Buttons */}
        <div className="mt-6 flex justify-between gap-4 border-t pt-4 border-gray-300">
          <button
            onClick={() => setQuestionIndex((prev) => prev - 1)}
            disabled={questionIndex === 0}
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow transition ${
              questionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={() => setQuestionIndex((prev) => prev + 1)}
            disabled={questionIndex === activeSection.questions.length - 1}
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow transition ${
              questionIndex === activeSection.questions.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    {/* Exit Confirmation Modal */}
    {showExitConfirm && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl border border-gray-300 relative">
          <button
            onClick={handleCancelExit}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
            Exit Full Screen?
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Exiting full screen counts as an attempt and may affect your test.
            Are you sure you want to exit?
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleCancelExit}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleExitConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Exit Anyway
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default Assessment;
