 import LayoutManager from './LayoutManager';
const AssessmentSection = ({
  layout = 'default', // options: default, left-info, compact
  activeSection,
  sections,
  sectionIndex,
  setSectionIndex,
  questionIndex,
  setQuestionIndex,
  question,
  renderQuestion,
  getQuestionStatusClass,
  refreshSectionStatus
}) => {
  const renderHeader = () => (
   <div className="bg-white rounded-xl p-4 ">
  {/* Top Flex Row: Details Left, Legend Right */}
 
    {/* Section Info - Left */}
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
   const renderlegend = () => (
    <div className="bg-white rounded-xl p-4 ">
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
    <div className="bg-white rounded-xl p-4 ">
      <h3 className="text-md font-semibold text-gray-700 mb-3">Questions</h3>
      <div className="flex flex-wrap gap-2">
        {activeSection.questions.map((q, idx) => (
          <button
            key={q._id}
            onClick={() => {
              setQuestionIndex(idx);
              refreshSectionStatus();
            }}
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
    <div className="bg-white rounded-xl p-6  w-full">
      <h2 className="mb-4 font-semibold text-lg text-gray-800">
        Q{questionIndex + 1}. {question.content.question_text}
      </h2>
      {renderQuestion()}
      <div className="mt-6 flex justify-between gap-4 border-t pt-4 border-gray-300">
        {/* Previous */}
        {questionIndex > 0 ? (
          <button
            onClick={() => {
              setQuestionIndex((prev) => prev - 1);
              refreshSectionStatus();
            }}
            className="px-5 py-2 rounded-lg text-sm font-medium shadow bg-blue-600 hover:bg-blue-700 text-white"
          >
            ← Previous
          </button>
        ) : sectionIndex > 0 ? (
          <button
            onClick={() => {
              setSectionIndex((prev) => prev - 1);
              setQuestionIndex(sections[sectionIndex - 1].questions.length - 1);
              refreshSectionStatus();
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
            onClick={() => {
              setQuestionIndex((prev) => prev + 1);
              refreshSectionStatus();
            }}
            className="px-5 py-2 rounded-lg text-sm font-medium shadow bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next →
          </button>
        ) : sectionIndex < sections.length - 1 ? (
          <button
            onClick={() => {
              setSectionIndex((prev) => prev + 1);
              setQuestionIndex(0);
              refreshSectionStatus();
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-4">
        <div className="lg:col-span-1 space-y-4">
          <div className='border border-gray-200 rounded-xl'>{renderHeader()}</div>
          <div className='border border-gray-200 rounded-xl'> {renderlegend()}</div>
         <div className='border border-gray-200 rounded-xl'> {renderQuestionPalette()}</div>
         
        </div>
        <div className="lg:col-span-3 border border-gray-200 rounded-xl">{renderQuestionContent()}</div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <LayoutManager
  renderHeader={renderHeader}
  renderLegend={renderlegend}
  renderQuestionPalette={renderQuestionPalette}
  renderQuestionContent={renderQuestionContent}
/>
    );
  }
  if (layout === 'top-info-nav') {
  return (
    <div className="space-y-4 px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 border border-gray-200 rounded-xl">{renderHeader()}</div>
        <div className="col-span-1 border border-gray-200 rounded-xl">{renderlegend()}</div>
        <div className="col-span-2 border border-gray-200 rounded-xl">{renderQuestionPalette()}</div>
      </div>
      <div className="col-span-1 border border-gray-200 rounded-xl"> {renderQuestionContent()}</div>
     
    </div>
  );
}


  // Default layout: header on top, palette left, question right
  return (
    <div className="p-4">
      {renderHeader()}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-4">
        <div className="lg:col-span-1">{renderQuestionPalette()}</div>
        <div className="lg:col-span-3">{renderQuestionContent()}</div>
      </div>
    </div>
  );
};

export default AssessmentSection;
