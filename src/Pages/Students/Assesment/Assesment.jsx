import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import QuizQuestion from './QuestionTypes/QuizQuestion';
import CodingQuestion from './QuestionTypes/CodingQuestion';
import DescriptiveQuestion from './QuestionTypes/DescriptiveQuestion';
import { getSectionWiseStatus } from '../../../Controllers/SubmissionController';
import AssessmentSection from './AssessmentSection';
import { useUser } from '../../../context/UserContext';
import useProctoringEvents from '../Proctoring/useProctoringEvents';
import ProctoringPopup from '../Proctoring/ProctoringPopup';

const Assessment = () => {
  const {state } = useLocation();
  const {user}=useUser();
  
  const { sections,submission,settings } = state;
  //console.log(settings)
  const submissionId = submission._id;
  const assignmentId=submission.assignment_id;
  const studentId=user._id
  //console.log(student_id)
  
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sectionWiseStatus, setSectionWiseStatus] = useState({});
  const [answerStatusMap, setAnswerStatusMap] = useState({});

  const { showPopup, popupMessage, setShowPopup,needsFullscreenPrompt } = useProctoringEvents({
    submission_id: submissionId,
    assignment_id: assignmentId,
    student_id: studentId,
    enabled: settings?.proctoring_enabled
  });


  const activeSection = sections[sectionIndex];
  const question = activeSection.questions[questionIndex];

  const refreshSectionStatus = async () => {
    try {
      const res = await getSectionWiseStatus(submissionId);
      setSectionWiseStatus(res || {});
      //console.log("Section Wise Status:", res);
    } catch (error) {
      console.error("Failed to refresh status:", error.message);
    }
  };
//   useEffect(() => {
//   refreshSectionStatus();
// }, []); // runs only once on first mount


  useEffect(() => {
   
    const map = {};
    Object.values(sectionWiseStatus).forEach((questionArray) => {
      questionArray.forEach((q) => {
        map[q.question_id] = q;
      });
    });
    setAnswerStatusMap(map);
     //console.log(map)
  }, [sectionWiseStatus]);




  

  

  const renderQuestion = (layout) => {
    if (!question) return <div>No question available</div>;

    const answerStatus = answerStatusMap[question._id];
    //console.log("Answer Status:", answerStatus);
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
      {needsFullscreenPrompt && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <p className="text-lg font-semibold mb-4">
        You must return to fullscreen to continue the assessment.
      </p>
      <button
        onClick={() => {
          document.documentElement.requestFullscreen().catch(err =>
            console.error('Failed to re-enter fullscreen:', err)
          );
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Return to Fullscreen
      </button>
    </div>
  </div>
)}

{showPopup && <ProctoringPopup message={popupMessage} onClose={() => setShowPopup(false)} />}
      

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

      
    </div>
  );
};

export default Assessment;
