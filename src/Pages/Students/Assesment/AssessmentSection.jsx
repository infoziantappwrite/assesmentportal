import LayoutManager from './LayoutManager';
import { saveTimeTaken } from '../../../Controllers/SubmissionController';
import { useState } from 'react';

const AssessmentSection = ({
  layout = 'default',
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

  const handleQuestionChange = async (newQuestionIndex, newSectionIndex = sectionIndex) => {
    const timeTakenSeconds = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQuestion = sections[sectionIndex]?.questions[questionIndex];

    if (timeTakenSeconds > 0 && currentQuestion?._id) {
      try {
        await saveTimeTaken({
          timeTakenSeconds,
          assignmentID,
          submissionID,
          questionID: currentQuestion._id,
        });
        //console.log(timeTakenSeconds)
      } catch (err) {
        console.error('Failed to save time taken:', err);
      }
    }

    setSectionIndex(newSectionIndex);
    setQuestionIndex(newQuestionIndex);
    setQuestionStartTime(Date.now());
    refreshSectionStatus();
  };

  const renderHeader = () => (
    <div className="bg-white rounded-xl p-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{activeSection.title}</h2>
        {activeSection.description && (
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{activeSection.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Duration: {activeSection.configuration?.duration_minutes} mins
        </p>
      </div>
    </div>
  );

  const renderLegend = () => (
    <div className="bg-white rounded-xl p-4">
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-600 inline-block"></span> Answered
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-purple-600 inline-block"></span> Marked for Review
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block"></span> Visited but Unanswered
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 inline-block"></span> Not Visited
        </div>
      </div>
    </div>
  );

  const renderQuestionPalette = () => (
    <div className="bg-white rounded-xl p-4">
      <h3 className="text-md font-semibold text-gray-700 mb-3">Questions</h3>
      <div className="flex flex-wrap gap-2">
        {activeSection.questions.map((q, idx) => (
          <button
            key={q._id}
            onClick={() => handleQuestionChange(idx)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition duration-150 ${getQuestionStatusClass(
              q._id,
              idx
            )}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );

  const renderQuestionContent = () => (
    <div>
      {renderQuestion(layout)}
      <div className="mt-6 flex justify-between gap-4">
        {/* Previous */}
        {questionIndex > 0 ? (
          <button
            onClick={() => handleQuestionChange(questionIndex - 1)}
            className="px-5 py-2 rounded-lg text-sm font-medium shadow bg-blue-600 hover:bg-blue-700 text-white"
          >
            ← Previous
          </button>
        ) : sectionIndex > 0 ? (
          <button
            onClick={() => {
              const newSectionIndex = sectionIndex - 1;
              const newQuestionIndex = sections[newSectionIndex].questions.length - 1;
              handleQuestionChange(newQuestionIndex, newSectionIndex);
            }}
            className="px-5 py-2 rounded-lg text-sm font-medium shadow bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            ← Previous Section
          </button>
        ) : (
          <div></div>
        )}

        {/* Next */}
        {questionIndex < activeSection.questions.length - 1 ? (
          <button
            onClick={() => handleQuestionChange(questionIndex + 1)}
            className="px-5 py-2 rounded-lg text-sm font-medium shadow bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next →
          </button>
        ) : sectionIndex < sections.length - 1 ? (
          <button
            onClick={() => {
              const newSectionIndex = sectionIndex + 1;
              handleQuestionChange(0, newSectionIndex);
            }}
            className="px-5 py-2 rounded-lg text-sm font-medium shadow bg-green-600 hover:bg-green-700 text-white"
          >
            Go to Next Section →
          </button>
        ) : null}
      </div>
    </div>
  );

  // Layouts
  if (layout === 'left-info') {
    return (
      <div className="flex h-[calc(100vh-64px)] px-6 py-4 gap-6 overflow-hidden">
        <div className="w-[250px] shrink-0 space-y-4 overflow-y-auto">
          <div className="border border-gray-200 rounded-xl">{renderHeader()}</div>
          <div className="border border-gray-200 rounded-xl">{renderLegend()}</div>
          <div className="border border-gray-200 rounded-xl">{renderQuestionPalette()}</div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">{renderQuestionContent()}</div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <LayoutManager
        renderHeader={renderHeader}
        renderLegend={renderLegend}
        renderQuestionPalette={renderQuestionPalette}
        renderQuestionContent={renderQuestionContent}
      />
    );
  }

  if (layout === 'top-info-nav') {
    return (
      <div className="space-y-6 px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 border border-gray-200 rounded-xl">{renderHeader()}</div>
          <div className="col-span-1 border border-gray-200 rounded-xl">{renderLegend()}</div>
          <div className="col-span-2 border border-gray-200 rounded-xl">{renderQuestionPalette()}</div>
        </div>
        <div className="col-span-1">{renderQuestionContent()}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div>{renderQuestionContent()}</div>
    </div>
  );
};

export default AssessmentSection;
