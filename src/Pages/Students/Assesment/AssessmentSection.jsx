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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);


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
  // SECTION NAVIGATION
  const renderSectionNav = () => {
    const isMobile = window.innerWidth < 640; // simple mobile check

    let mobileSections = [];
    if (isMobile) {
      mobileSections = [sections[sectionIndex]]; // show only the active section
    }

    return (
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Sections with pagination */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-700">
              Sections ({sections.length})
            </h3>
            <p className="text-[11px] text-gray-500">
              {isMobile
                ? `Section ${sectionIndex + 1} of ${sections.length}`
                : `Page ${sectionPage + 1} of ${totalSectionPages}`}
            </p>
          </div>

          {/* Section Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* First & Prev */}
            <button
              disabled={isMobile ? sectionIndex === 0 : sectionPage === 0}
              onClick={() =>
                isMobile
                  ? setSectionIndex(0)
                  : setSectionPage(0)
              }
              className={baseBtnClass}
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              disabled={isMobile ? sectionIndex === 0 : sectionPage === 0}
              onClick={() =>
                isMobile
                  ? setSectionIndex((i) => Math.max(0, i - 1))
                  : setSectionPage((p) => Math.max(0, p - 1))
              }
              className={baseBtnClass}
            >
              <ChevronLeft size={14} />
            </button>

            {/* Section Buttons */}
            {!isMobile &&
              currentSections.map((sec, idx) => {
                const globalIdx = sectionStartIndex + idx;
                return (
                  <div key={sec._id} className="relative group">
                    <button
                      onClick={() => handleQuestionChange(0, globalIdx)}
                      className={`px-4 py-1.5 border rounded-full text-xs font-medium transition ${globalIdx === sectionIndex
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100 border-gray-200"
                        }`}
                    >
                      {sec.title}
                    </button>

                    {/* Tooltip */}
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

            {/* Mobile → only one section */}
            {isMobile &&
              mobileSections.map((sec) => (
                <button
                  key={sec._id}
                  onClick={() =>
                    handleQuestionChange(0, sections.indexOf(sec))
                  }
                  className={`px-4 py-1.5 border rounded-full text-xs font-medium transition ${sections.indexOf(sec) === sectionIndex
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 border-gray-200"
                    }`}
                >
                  {sec.title}
                </button>
              ))}

            {/* Next & Last */}
            <button
              disabled={
                isMobile
                  ? sectionIndex === sections.length - 1
                  : sectionPage === totalSectionPages - 1
              }
              onClick={() =>
                isMobile
                  ? setSectionIndex((i) =>
                    Math.min(sections.length - 1, i + 1)
                  )
                  : setSectionPage((p) =>
                    Math.min(totalSectionPages - 1, p + 1)
                  )
              }
              className={baseBtnClass}
            >
              <ChevronRight size={14} />
            </button>
            <button
              disabled={
                isMobile
                  ? sectionIndex === sections.length - 1
                  : sectionPage === totalSectionPages - 1
              }
              onClick={() =>
                isMobile
                  ? setSectionIndex(sections.length - 1)
                  : setSectionPage(totalSectionPages - 1)
              }
              className={baseBtnClass}
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // QUESTION NAVIGATION
  // QUESTION NAVIGATION
  const renderQuestionPalette = () => {
    const isMobile = window.innerWidth < 640; // simple check

    // Mobile: calculate "page of 3"
    const mobileQuestionsPerPage = 3;
    const mobilePage = Math.floor(questionIndex / mobileQuestionsPerPage);
    const mobileTotalPages = Math.ceil(totalQuestions / mobileQuestionsPerPage);

    const mobileStartIndex = mobilePage * mobileQuestionsPerPage;
    const mobileQuestions = activeSection.questions.slice(
      mobileStartIndex,
      mobileStartIndex + mobileQuestionsPerPage
    );

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700">
            Questions ({totalQuestions})
          </h3>
          <p className="text-[11px] text-gray-500">
            {isMobile
              ? `Page ${mobilePage + 1} of ${mobileTotalPages}`
              : `Page ${page + 1} of ${totalPages}`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-1 flex-wrap">
          {/* First & Prev */}
          <button
            disabled={isMobile ? mobilePage === 0 : page === 0}
            onClick={() =>
              isMobile ? handleQuestionChange(0) : setPage(0)
            }
            className={baseBtnClass}
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            disabled={isMobile ? mobilePage === 0 : page === 0}
            onClick={() =>
              isMobile
                ? handleQuestionChange(
                  Math.max(0, mobileStartIndex - mobileQuestionsPerPage)
                )
                : setPage((p) => Math.max(0, p - 1))
            }
            className={baseBtnClass}
          >
            <ChevronLeft size={14} />
          </button>

          {/* Question Numbers */}
          {!isMobile &&
            currentQuestions.map((q, idx) => (
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

          {isMobile &&
            mobileQuestions.map((q, idx) => {
              const globalIdx = mobileStartIndex + idx;
              return (
                <button
                  key={q._id}
                  onClick={() => handleQuestionChange(globalIdx)}
                  className={`${baseBtnClass} ${getQuestionStatusClass(
                    q._id,
                    globalIdx
                  )}`}
                >
                  {globalIdx + 1}
                </button>
              );
            })}

          {/* Next & Last */}
          <button
            disabled={isMobile ? mobilePage === mobileTotalPages - 1 : page === totalPages - 1}
            onClick={() =>
              isMobile
                ? handleQuestionChange(
                  Math.min(
                    totalQuestions - 1,
                    mobileStartIndex + mobileQuestionsPerPage
                  )
                )
                : setPage((p) => Math.min(totalPages - 1, p + 1))
            }
            className={baseBtnClass}
          >
            <ChevronRight size={14} />
          </button>
          <button
            disabled={isMobile ? mobilePage === mobileTotalPages - 1 : page === totalPages - 1}
            onClick={() =>
              isMobile
                ? handleQuestionChange(totalQuestions - 1)
                : setPage(totalPages - 1)
            }
            className={baseBtnClass}
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Row: Compact Nav */}
      {/* Top Row: Compact Nav */}
      <div className="flex flex-col md:flex-row items-stretch bg-gray-100 border-b border-gray-300">
        {/* Left: Sections (40%) */}
        <div className="md:w-2/5 flex items-center justify-center px-3 py-2 border-b md:border-b-0 md:border-r border-gray-300">
          {renderSectionNav()}
        </div>

        {/* Center: Status Legend (20%) */}
        <div className="md:w-1/5 flex items-center justify-center px-3 py-2 border-b md:border-b-0 md:border-r border-gray-300">
        <div className="grid grid-cols-2 gap-2 text-[12px]">
              {/* Answered */}
              <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                <span className="w-3.5 h-3.5 rounded-full bg-green-600 shadow-sm"></span>
                <span className="text-green-700 font-medium">Answered</span>
              </div>

              {/* Review */}
              <div className="flex items-center gap-2 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shadow-sm"></span>
                <span className="text-purple-700 font-medium">Review</span>
              </div>

              {/* Unanswered */}
              <div className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm"></span>
                <span className="text-yellow-700 font-medium">Unanswered</span>
              </div>

              {/* Not Visited */}
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                <span className="w-3.5 h-3.5 rounded-full bg-gray-300 border shadow-sm"></span>
                <span className="text-gray-600 font-medium">Not Visited</span>
              </div>
            </div>
          
        </div>

        {/* Right: Questions (40%) */}
        <div className="md:w-2/5 flex items-center justify-center px-3 py-2">
          {renderQuestionPalette()}
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
