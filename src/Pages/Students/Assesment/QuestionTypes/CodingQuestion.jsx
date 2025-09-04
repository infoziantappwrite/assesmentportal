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
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // only render SolutionSection when true

  const handleAnswerChange = (questionId, newAnswer) => {
    setAnswer(newAnswer);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDetailsAndStatus = async () => {
      try {
        setLoading(true);
        setReady(false); // prevent SolutionSection render until ready

        const [detailsRes, statusRes, submissionRes] = await Promise.all([
          getCodingQuestionById(question._id),
          getQuestionAnswerdStatus(submissionId, question._id),
          getAnsweredStatus(submissionId, question._id),
        ]);

        if (!isMounted) return;

        const details = detailsRes?.data?.codingQuestion || null;
        const answerStatusRes = statusRes || null;
        const submissionStatus = submissionRes || null;

        // default language + starter code
        let finalLanguage = 'java';
        let finalAnswer = '// Write your code here';

        if (details?.supported_languages?.length) {
          finalLanguage =
            details.supported_languages[0].language || finalLanguage;
          finalAnswer =
            details.supported_languages[0].starter_code || finalAnswer;
        }

        // override with saved answer if exists
        if (answerStatusRes?.answered) {
          if (answerStatusRes.programming_language && answerStatusRes.code_solution) {
            finalLanguage = answerStatusRes.programming_language;
            finalAnswer = answerStatusRes.code_solution;
          }
        } else {
          // first-time visit: fire-and-forget
          questionVisited({
            submissionID: submissionId,
            sectionID: question.section_id,
            questionID: question._id,
            type: question.type,
            isMarkedForReview: false,
            isSkipped: true,
          }).catch(err =>
            console.error('Failed to mark question as visited', err)
          );
        }

        // ✅ update all state before rendering
        setFullDetails(details);
        setAnswerStatus(answerStatusRes);
        setSelectedLanguage(finalLanguage);
        setAnswer(finalAnswer);
        setIsAnswerSubmitted(submissionStatus);

        setReady(true); // allow SolutionSection to render
      } catch (error) {
        console.error('Failed to fetch question/details/status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (submissionId && question?._id) {
      fetchDetailsAndStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [submissionId, question._id, question.section_id, question.type]);

  // render loading if still fetching
  if (loading && !ready) {
    return <div className="text-center py-10">Loading question details...</div>;
  }

  if (!fullDetails) {
    return <div className="text-center py-10 text-red-500">No question found</div>;
  }

  return (
    <div>
      <div
        className={`grid gap-4 ${
          layout === 'left-info' ? 'lg:grid-cols-2' : 'lg:grid-cols-5'
        } md:grid-cols-2`}
      >
        <QuestionPanel
          question={question}
          questionIndex={questionIndex}
          fullDetails={fullDetails}
        />

        <div className="col-span-3">
          <ErrorBoundary>
            {ready && (
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
            )}
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
