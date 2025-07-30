import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, AlertTriangle } from 'lucide-react';
import Header from './Header';
import QuizQuestion from './QuestionTypes/QuizQuestion';
import CodingQuestion from './QuestionTypes/CodingQuestion';
import DescriptiveQuestion from './QuestionTypes/DescriptiveQuestion';
import { getSectionWiseStatus } from '../../../Controllers/SubmissionController';
import AssessmentSection from './AssessmentSection';
import { useUser } from '../../../context/UserContext';
import useProctoringEvents from '../Proctoring/useProctoringEvents';

const Assessment = () => {
  const { state } = useLocation();
  const {user}=useUser();
  const navigate = useNavigate();
  const { sections,submission } = state;
  const submissionId = submission._id;
  const assignmentId=submission.assignment_id;
  const studentId=user._id
  //console.log(student_id)
  
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [sectionWiseStatus, setSectionWiseStatus] = useState({});
  const [answerStatusMap, setAnswerStatusMap] = useState({});
  const development =true;
  useProctoringEvents({
    submission_id: submissionId,
    assignment_id: assignmentId,
    student_id: studentId,
  });

  const activeSection = sections[sectionIndex];
  const question = activeSection.questions[questionIndex];

  const refreshSectionStatus = async () => {
    try {
      const res = await getSectionWiseStatus(submissionId);
      setSectionWiseStatus(res || {});
    } catch (error) {
      console.error("Failed to refresh status:", error.message);
    }
  };

  useEffect(() => {
    const map = {};
    Object.values(sectionWiseStatus).forEach((questionArray) => {
      questionArray.forEach((q) => {
        map[q.question_id] = q;
      });
    });
    setAnswerStatusMap(map);
  }, [sectionWiseStatus]);

  const enforceFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    }
  };

  useEffect(() => {
    if (development) return;
    enforceFullScreen();

    const preventRightClick = (e) => e.preventDefault();
    const preventDevTools = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    const handleTabSwitch = () => {
      setShowExitConfirm(true);
    };

    window.addEventListener('contextmenu', preventRightClick);
    window.addEventListener('keydown', preventDevTools);
    window.addEventListener('blur', handleTabSwitch);

    const checkFullScreen = () => {
      if (!document.fullscreenElement) {
        setShowExitConfirm(true);
      }
    };

    document.addEventListener('fullscreenchange', checkFullScreen);

    return () => {
      window.removeEventListener('contextmenu', preventRightClick);
      window.removeEventListener('keydown', preventDevTools);
      window.removeEventListener('blur', handleTabSwitch);
      document.removeEventListener('fullscreenchange', checkFullScreen);
    };
  }, []);

  const handleExitConfirm = () => {
    localStorage.clear();
    navigate('/dashboard');
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    enforceFullScreen();
  };

  const renderQuestion = (layout) => {
    if (!question) return <div>No question available</div>;

    const answerStatus = answerStatusMap[question._id];
    const props = { question, refreshSectionStatus, answerStatus, questionIndex, layout };
    const isMobileOrTablet = window.innerWidth < 768;

    switch (question.type) {
      case 'single_correct':
      case 'multi_correct':
        return <QuizQuestion {...props} />;
      case 'coding':
        return isMobileOrTablet ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-red-600 font-semibold text-lg p-4">
            You can't take coding assessments on mobile or tablet devices.
          </div>
        ) : (
          <CodingQuestion {...props} />
        );
      case 'descriptive':
        return <DescriptiveQuestion {...props} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  const getQuestionStatusClass = (qid, idx) => {
    const isCurrent = idx === questionIndex;
    const currentSectionId = activeSection._id;
    const sectionStatus = sectionWiseStatus[currentSectionId] || [];
    const qStatus = sectionStatus.find((q) => q.question_id === qid);

    if (isCurrent) return 'bg-blue-600 text-white';
    if (qStatus) {
      const isAnswered =
        (qStatus.selected_options && qStatus.selected_options.length > 0) ||
        (qStatus.code_solution && qStatus.code_solution.trim() !== '') ||
        (qStatus.text_answer && qStatus.text_answer.trim() !== '');

      if (qStatus.is_marked_for_review) return 'bg-purple-600 text-white';
      if (isAnswered) return 'bg-green-600 text-white';
      return 'bg-yellow-400 text-white';
    }

    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />

      <div className="p-4 border-b border-gray-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex overflow-x-auto gap-2 md:justify-end scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
      </div>

      <AssessmentSection
        layout="top-info-nav"
        activeSection={activeSection}
        sections={sections}
        sectionIndex={sectionIndex}
        setSectionIndex={setSectionIndex}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        question={question}
        renderQuestion={renderQuestion}
        getQuestionStatusClass={getQuestionStatusClass}
        refreshSectionStatus={refreshSectionStatus}
        assignmentID={assignmentId}
        submissionID={submissionId}
        
      />

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

            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Exit Full Screen?</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Exiting full screen or switching tabs counts as an attempt and may affect your test.
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
