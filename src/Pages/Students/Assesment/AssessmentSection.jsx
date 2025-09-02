import { useState } from "react";
import { saveTimeTaken } from "../../../Controllers/SubmissionController";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

const AssessmentSection = ({
  activeSection,
  sections,
  sectionIndex,
  setSectionIndex,
  questionIndex,
  setQuestionIndex,
  renderQuestion,
  getQuestionStatusClass,
  refreshSectionStatus,
  assignmentID,
  submissionID,
}) => {
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // SECTION PAGINATION (2 per page)
  const sectionsPerPage = 2;
  const totalSectionPages = Math.ceil(sections.length / sectionsPerPage);
  const [sectionPage, setSectionPage] = useState(
    Math.floor(sectionIndex / sectionsPerPage)
  );
  const sectionStartIndex = sectionPage * sectionsPerPage;
  const currentSections = sections.slice(
    sectionStartIndex,
    sectionStartIndex + sectionsPerPage
  );

  // QUESTION PAGINATION (10 per page)
  const [page, setPage] = useState(0);
  const questionsPerPage = 10;
  const totalQuestions = activeSection.questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = page * questionsPerPage;
  const currentQuestions = activeSection.questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  // Change Question (with save time)
  const handleQuestionChange = async (
    newQuestionIndex,
    newSectionIndex = sectionIndex
  ) => {
    const timeTakenSeconds = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    const currentQuestion = sections[sectionIndex]?.questions[questionIndex];

    if (timeTakenSeconds > 0 && currentQuestion?._id) {
      try {
        await saveTimeTaken({
          timeTakenSeconds,
          assignmentID,
          submissionID,
          questionID: currentQuestion._id,
        });
      } catch (err) {
        console.error("Failed to save time taken:", err);
      }
    }

    setSectionIndex(newSectionIndex);
    setQuestionIndex(newQuestionIndex);
    setQuestionStartTime(Date.now());
    refreshSectionStatus();
    setPage(0); // reset when section changes
  };

  const baseBtnClass =
    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border border-gray-300 transition disabled:opacity-40";

  // SECTION NAVIGATION
  const renderSectionNav = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700">
          Sections ({sections.length})
        </h3>
        <p className="text-[11px] text-gray-500">
          Page {sectionPage + 1} of {totalSectionPages}
        </p>
      </div>

      {/* Section Buttons */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {/* First & Prev */}
        <button
          disabled={sectionPage === 0}
          onClick={() => setSectionPage(0)}
          className={baseBtnClass}
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          disabled={sectionPage === 0}
          onClick={() => setSectionPage((p) => Math.max(0, p - 1))}
          className={baseBtnClass}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Section Buttons with Tooltip */}
        {currentSections.map((sec, idx) => {
          const globalIdx = sectionStartIndex + idx;
          return (
            <div key={sec._id} className="relative group">
              <button
                onClick={() => handleQuestionChange(0, globalIdx)}
                className={`px-4 py-1.5 border border-gray-200 rounded-full text-xs font-medium transition ${globalIdx === sectionIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
              >
                {sec.title}
              </button>

              {/* Hover Info Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block w-48 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50 text-[11px]">
                <h4 className="font-semibold text-gray-800">{sec.title}</h4>
                {sec.description && (
                  <p className="text-gray-600 mt-1">{sec.description}</p>
                )}
                <p className="text-gray-500 mt-1">
                  Duration: {sec.configuration?.duration_minutes} mins
                </p>
              </div>
            </div>
          );
        })}

        {/* Next & Last */}
        <button
          disabled={sectionPage === totalSectionPages - 1}
          onClick={() =>
            setSectionPage((p) => Math.min(totalSectionPages - 1, p + 1))
          }
          className={baseBtnClass}
        >
          <ChevronRight size={14} />
        </button>
        <button
          disabled={sectionPage === totalSectionPages - 1}
          onClick={() => setSectionPage(totalSectionPages - 1)}
          className={baseBtnClass}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );


  // QUESTION NAVIGATION
  const renderQuestionPalette = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700">
          Questions ({totalQuestions})
        </h3>
        <p className="text-[11px] text-gray-500">
          Page {page + 1} of {totalPages}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1 flex-wrap">
        <button
          disabled={page === 0}
          onClick={() => setPage(0)}
          className={baseBtnClass}
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className={baseBtnClass}
        >
          <ChevronLeft size={14} />
        </button>

        {currentQuestions.map((q, idx) => (
          <button
            key={q._id}
            onClick={() => handleQuestionChange(startIndex + idx)}
            className={`${baseBtnClass} ${getQuestionStatusClass(
              q._id,
              startIndex + idx
            )}`}
          >
            {startIndex + idx + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          className={baseBtnClass}
        >
          <ChevronRight size={14} />
        </button>
        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(totalPages - 1)}
          className={baseBtnClass}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Row: Compact Nav */}
      <div className="flex flex-col md:flex-row items-stretch bg-gray-100 border-b border-gray-300">
        {/* Sections Left */}
        <div className="flex-1 flex items-center justify-start px-3 py-2 border-b md:border-b-0 md:border-r border-gray-300">
          <div className="w-full">{renderSectionNav()}</div>
        </div>

        {/* Questions Right */}
        <div className="flex-1 flex items-center justify-end px-3 py-2">
          <div className="w-full">{renderQuestionPalette()}</div>
        </div>
      </div>

      {/* Main Question Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white flex flex-col">
        <div className="flex-1">{renderQuestion("default")}</div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center border-t border-gray-300 pt-4 mt-4">
          {/* Previous Button */}
          <button
            disabled={questionIndex === 0 && sectionIndex === 0}
            onClick={() => {
              if (questionIndex > 0) {
                handleQuestionChange(questionIndex - 1, sectionIndex);
              } else if (sectionIndex > 0) {
                const prevSecLastQ = sections[sectionIndex - 1].questions.length - 1;
                handleQuestionChange(prevSecLastQ, sectionIndex - 1);
              }
            }}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {questionIndex === 0 && sectionIndex > 0
              ? "Go to Previous Section"
              : "Previous"}
          </button>

          {/* Next Button */}
          <button
            disabled={
              sectionIndex === sections.length - 1 &&
              questionIndex === sections[sectionIndex].questions.length - 1
            }
            onClick={() => {
              if (questionIndex < sections[sectionIndex].questions.length - 1) {
                handleQuestionChange(questionIndex + 1, sectionIndex);
              } else if (sectionIndex < sections.length - 1) {
                handleQuestionChange(0, sectionIndex + 1);
              }
            }}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {questionIndex === sections[sectionIndex].questions.length - 1 &&
              sectionIndex < sections.length - 1
              ? "Go to Next Section"
              : "Next"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssessmentSection;
