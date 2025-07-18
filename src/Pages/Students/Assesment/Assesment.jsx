import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import QuizQuestion from './QuestionTypes/QuizQuestion';
import CodingQuestion from './QuestionTypes/CodingQuestion';
import DescriptiveQuestion from './QuestionTypes/DescriptiveQuestion';
import { getAnsweredStatus } from '../../../Controllers/SubmissionController';

const Assessment = () => {
  const { state } = useLocation();
  const { sections } = state;
  const submissionId = localStorage.getItem('submission_id');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const activeSection = sections[sectionIndex];
  const question = activeSection.questions[questionIndex];

  useEffect(() => {
    getAnsweredStatus(submissionId, question._id)
      .then(({ data }) => {
        if (data.answered) {
          const val = data.selected_options ?? data.code_solution ?? data.text_answer;
          setAnswers((prev) => ({ ...prev, [question._id]: val }));
        }
      })
      .catch(console.error);
  }, [submissionId, question._id]);

  const renderQuestion = () => {
    const props = { question, answer: answers[question._id] };
    switch (question.type) {
      case 'single_correct':
      case 'multi_correct':
        return <QuizQuestion {...props} />;
      case 'coding':
        return <CodingQuestion {...props} />;
      case 'descriptive':
        return <DescriptiveQuestion {...props} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Section Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {sections.map((sec, idx) => (
          <button
            key={sec._id}
            onClick={() => {
              setSectionIndex(idx);
              setQuestionIndex(0);
            }}
            className={`px-3 py-1 rounded ${
              idx === sectionIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Question Navigation */}
      <div className="flex gap-1 p-2 flex-wrap">
        {activeSection.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setQuestionIndex(idx)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              idx === questionIndex ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Section Timer and Configuration */}
      <div className="px-4 text-sm text-gray-500 mb-2">
        <p>
          Section Duration: {activeSection.configuration?.duration_minutes} mins
        </p>
      </div>

      {/* Question Display */}
      <div className="p-4">
        <h2 className="mb-2 font-semibold">
          Q{questionIndex + 1}. {question.content.question_text}
        </h2>
        {renderQuestion()}
      </div>
    </div>
  );
};

export default Assessment;
