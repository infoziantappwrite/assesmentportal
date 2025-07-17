import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { Info } from 'lucide-react';
import QuizQuestion from './QuestionTypes/QuizQuestion';
import CodingQuestion from './QuestionTypes/CodingQuestion';

const Assessment = () => {
  const { state } = useLocation();
  const sections = state?.sections || [];

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const activeSection = sections[activeSectionIndex];

  if (!sections.length) {
    return <div className="p-10 text-center text-red-600">No assessment data found.</div>;
  }

  const toggleConfig = () => setShowConfig(!showConfig);
  const handleJump = (index) => setActiveQuestionIndex(index);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {/* Section Selector */}
      <div className="max-w-5xl mx-auto pt-6 px-4 flex items-center justify-between">
        <div className="flex gap-3 overflow-x-auto">
          {sections.map((section, idx) => (
            <button
              key={section._id}
              onClick={() => {
                setActiveSectionIndex(idx);
                setActiveQuestionIndex(0);
                setShowConfig(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                idx === activeSectionIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Info Toggle */}
        <button
          onClick={toggleConfig}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
        >
          <Info className="w-4 h-4" />
          {showConfig ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-6">
        {/* Section Configuration */}
        {showConfig && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700">
            <h3 className="font-semibold text-gray-800 mb-2">Section Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul>
                <li>Duration: {activeSection.configuration?.duration_minutes ?? 0} mins</li>
                <li>Questions: {activeSection.configuration?.question_count ?? 0}</li>
                <li>Allow Skip: {activeSection.configuration?.allow_skip ? 'Yes' : 'No'}</li>
              </ul>
              <ul>
                <li>Shuffle: {activeSection.configuration?.shuffle_questions ? 'Yes' : 'No'}</li>
                <li>Show Palette: {activeSection.configuration?.show_question_palette ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Question Palette */}
        <div className="flex justify-end gap-2 flex-wrap">
          {activeSection.questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => handleJump(idx)}
              className={`w-8 h-8 rounded-full text-sm font-medium border ${
                idx === activeQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Active Question Display */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2 font-semibold">
            Question {activeQuestionIndex + 1} of {activeSection.questions.length}
          </p>

          {activeSection.questions[activeQuestionIndex].type === 'single_correct' ? (
            <QuizQuestion question={activeSection.questions[activeQuestionIndex]} />
          ) : (
            <CodingQuestion question={activeSection.questions[activeQuestionIndex]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
