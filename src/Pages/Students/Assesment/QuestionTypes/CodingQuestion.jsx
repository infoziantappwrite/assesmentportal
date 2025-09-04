import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import QuestionPanel from "./QuestionPanel";
import { getCodingQuestionById } from "../../../../Controllers/QuestionController";
import SolutionSection from "./SolutionSection";
import ErrorBoundary from "../../../../Components/ErrorBoundary";
import {
  questionVisited,
  getAnsweredStatus,
  getQuestionAnswerdStatus,
} from "../../../../Controllers/SubmissionController";

const CodingQuestion = ({
  question,
  refreshSectionStatus,
  questionIndex,
  layout,
}) => {
  const submissionId = localStorage.getItem("submission_id");
  const [answer, setAnswer] = useState("");
  const [fullDetails, setFullDetails] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle answer changes
  const handleAnswerChange = (_questionId, newAnswer) => {
    setAnswer(newAnswer);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDetailsAndStatus = async () => {
      setLoading(true);
      try {
        const [detailsRes, statusRes, submissionRes] = await Promise.all([
          getCodingQuestionById(question._id),
          getQuestionAnswerdStatus(submissionId, question._id),
          getAnsweredStatus(submissionId, question._id),
        ]);

        if (!isMounted) return;

        const details = detailsRes?.data?.codingQuestion || null;
        const answerStatusRes = statusRes || null;
        const submissionStatus = submissionRes || null;

        let finalLanguage = "java";
        let finalAnswer = "// Write your code here";

        if (details?.supported_languages?.length) {
          finalLanguage =
            details.supported_languages[0].language || finalLanguage;
          finalAnswer =
            details.supported_languages[0].starter_code || finalAnswer;
        }

        if (answerStatusRes?.answered) {
          if (
            answerStatusRes.programming_language &&
            answerStatusRes.code_solution
          ) {
            finalLanguage = answerStatusRes.programming_language;
            finalAnswer = answerStatusRes.code_solution;
          }
        } else {
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
            console.error("Failed to mark question as visited", err);
          }
        }

        // Update state once
        setFullDetails(details);
        setAnswerStatus(answerStatusRes);
        setSelectedLanguage(finalLanguage);
        setAnswer(finalAnswer);
        setIsAnswerSubmitted(submissionStatus);
      } catch (error) {
        console.error("Failed to fetch question/details/status:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (submissionId && question?._id) {
      fetchDetailsAndStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [submissionId, question._id, question.section_id, question.type]);

  // Loading UI
  if (loading && !fullDetails) {
    return <div className="text-center py-10">Loading question details...</div>;
  }

  if (!fullDetails) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load question details.
      </div>
    );
  }

  return (
    <div>
      <div
        className={`grid gap-4 ${
          layout === "left-info" ? "lg:grid-cols-2" : "lg:grid-cols-5"
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
