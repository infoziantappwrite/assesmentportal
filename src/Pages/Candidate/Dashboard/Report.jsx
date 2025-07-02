import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, MinusCircle, ArrowLeft } from 'lucide-react';
import Header from './Header';

const sampleReport = {
  totalMarks: 30,
  score: 22,
  performance: 'Good',
  questions: Array.from({ length: 15 }, (_, i) => {
    const statusOptions = ['correct', 'incorrect', 'not_answered'];
    const status = statusOptions[Math.floor(Math.random() * 3)];
    return {
      id: i + 1,
      question: `Question ${i + 1}: What is the answer to question ${i + 1}?`,
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D',
        'Option E',
      ],
      selected: status === 'not_answered' ? null : Math.floor(Math.random() * 5),
      correct: Math.floor(Math.random() * 5),
      status,
      marks: status === 'correct' ? 2 : 0,
    };
  }),
};

const statusStyles = {
  correct: {
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    text: 'Correct',
    bg: 'bg-green-50 border-green-300',
  },
  incorrect: {
    icon: <XCircle className="text-red-600 w-5 h-5" />,
    text: 'Incorrect',
    bg: 'bg-red-50 border-red-300',
  },
  not_answered: {
    icon: <MinusCircle className="text-yellow-600 w-5 h-5" />,
    text: 'Not Answered',
    bg: 'bg-yellow-50 border-yellow-300',
  },
};

const performanceBadge = {
  Excellent: 'bg-green-600',
  Good: 'bg-blue-600',
  Average: 'bg-yellow-500',
  Poor: 'bg-red-600',
};

const Report = () => {
  const navigate = useNavigate();
  const { totalMarks, score, performance, questions } = sampleReport;

  return (
    <div className=' bg-gradient-to-br from-blue-50 to-teal-50'>
    <Header/>
    <div className="max-w-5xl mx-auto px-4 py-8 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Test Report</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="mb-8 border rounded-md p-4 flex justify-between items-center bg-gray-50">
        <div>
          <p className="text-lg">
            <strong>Total Marks:</strong> {totalMarks}
          </p>
          <p className="text-lg">
            <strong>Scored:</strong> {score}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded text-white text-sm font-semibold ${performanceBadge[performance]}`}
        >
          {performance}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const style = statusStyles[q.status];
          return (
            <div
              key={index}
              className={`border-l-4 ${style.bg} border ${style.bg} rounded-md p-4`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{q.question}</h3>
                <div className="flex items-center gap-2 text-sm">
                  {style.icon}
                  <span className="font-medium">{style.text}</span>
                </div>
              </div>

              <ul className="pl-4 space-y-1 text-sm">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correct;
                  const isSelected = i === q.selected;

                  return (
                    <li
                      key={i}
                      className={`p-1 rounded ${
                        isCorrect
                          ? 'bg-green-100 font-semibold'
                          : isSelected
                          ? 'bg-red-100'
                          : ''
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 text-sm">
                <strong>Marks:</strong> {q.marks}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default Report;
