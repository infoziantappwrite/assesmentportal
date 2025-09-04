import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import QuestionPanel from './QuestionPanel';
import { getCodingQuestionById } from '../../../../Controllers/QuestionController';
import SolutionSection from './SolutionSection';
import ErrorBoundary from '../../../../Components/ErrorBoundary';
import {
  questionVisited,
  getAnsweredStatus,
  getQuestionAnswerdStatus,
} from '../../../../Controllers/SubmissionController';

const CodingQuestion = ({
  question,
  refreshSectionStatus,
  questionIndex,
  layout,
}) => {
  const submissionId = localStorage.getItem('submission_id');
  const [answer, setAnswer] = useState('');
  const [fullDetails, setFullDetails] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);

  // Function to handle answer changes
  const handleAnswerChange = (questionId, newAnswer) => {
    setAnswer(newAnswer);
  };

  // Helper: pick default language + starter code from fullDetails


useEffect(() => {
  let isMounted = true;

  const fetchDetailsAndStatus = async () => {
    try {
      // Fetch everything concurrently to reduce time & avoid partial renders
      const [detailsRes, statusRes, submissionRes] = await Promise.all([
        getCodingQuestionById(question._id),
        getQuestionAnswerdStatus(submissionId, question._id),
        getAnsweredStatus(submissionId, question._id)
      ]);

      if (!isMounted) return;

      const details = detailsRes?.data?.codingQuestion || null;
      const answerStatusRes = statusRes || null; // { answered: true/false, ... } or null
      const submissionStatus = submissionRes || null;

      // compute defaults from details (guarantee we have something)
      let finalLanguage = 'java';
      let finalAnswer = '// Write your code here';

      if (details?.supported_languages?.length) {
        finalLanguage = details.supported_languages[0].language || finalLanguage;
        finalAnswer = details.supported_languages[0].starter_code || finalAnswer;
      }

      // Decide final values based on answered-status
      if (answerStatusRes?.answered) {
        // If answered and has code+lang, use them
        if (answerStatusRes.programming_language && answerStatusRes.code_solution) {
          finalLanguage = answerStatusRes.programming_language;
          finalAnswer = answerStatusRes.code_solution;
        }
        // else leave the default (from details or hard fallback)
      } else {
        // Not answered: mark visited (fire-and-forget)
        try {
          await questionVisited({
            submissionID: submissionId,
            sectionID: question.section_id,
            questionID: question._id,
            type: question.type,
            isMarkedForReview: false,
            isSkipped: true,
          });
        } catch (err) {
          console.error('Failed to mark question as visited', err);
        }
        // finalLanguage / finalAnswer already set to defaults above
      }

      // Reset editor / init refs (prevent carryover from previous question)
      // (make sure these refs exist in your component scope)
     

      // Now update state ONCE with the final computed values
      setFullDetails(details);
      setAnswerStatus(answerStatusRes);
      setSelectedLanguage(finalLanguage);
      setAnswer(finalAnswer);
      setIsAnswerSubmitted(submissionStatus);

    } catch (error) {
      console.error('Failed to fetch question/details/status:', error);
    }
  };

  // When question changes, run the flow
  if (submissionId && question?._id) {
    // Immediate safe reset so UI won't show previous question while fetching
    setFullDetails(null); // will show your loading UI
    setAnswer(''); // ensure previous answer not visible
    setSelectedLanguage('java'); // or keep previous preference if you want
    fetchDetailsAndStatus();
  }

  return () => {
    isMounted = false;
  };
}, [submissionId, question._id, question.section_id, question.type]);


  if (!fullDetails) {
    return <div className="text-center py-10">Loading question details...</div>;
  }

  return (
    <div>
      <div
        className={`grid gap-4 ${
          layout === 'left-info' ? 'lg:grid-cols-2' : 'lg:grid-cols-5'
        } md:grid-cols-2`}
      >
        {/* Question Panel */}
        <QuestionPanel
          question={question}
          questionIndex={questionIndex}
          fullDetails={fullDetails}
        />

        {/* Solution Section */}
        <div className="col-span-3">
          <ErrorBoundary>
            <SolutionSection
              question={question}
              answer={answer}
              onAnswerChange={handleAnswerChange}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              fullDetails={fullDetails}
              submissionId={submissionId}
              refreshSectionStatus={refreshSectionStatus}
              isAnswerSubmitted={isAnswerSubmitted}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

CodingQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  refreshSectionStatus: PropTypes.func.isRequired,
  questionIndex: PropTypes.number.isRequired,
  layout: PropTypes.string,
};

export default CodingQuestion;
