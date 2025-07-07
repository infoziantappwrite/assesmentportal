import React, { useState } from "react";
import { FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditTest from "./EditTest";

// Dummy data
const tests = [
  {
    id: 1,
    title: "Full Stack Developer Assessment",
    description:
      "A test to evaluate candidates for a Full Stack Developer role including coding and MCQs.",
    duration: 120,
    active: true,
    startDate: "2025-07-05T10:00",
    endDate: "2025-07-05T12:00",
    sections: [
      {
        sectionTitle: "JavaScript Basics",
        sectionType: "mcq",
        sectionDescription: "Multiple choice questions on core JavaScript concepts",
        questions: [
          {
            text: "Which of the following is NOT a JavaScript data type?",
            options: ["String", "Boolean", "Float", "Undefined"],
            correctAnswer: "Float",
          },
          {
            text: "Which method converts JSON text to a JavaScript object?",
            options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()"],
            correctAnswer: "JSON.parse()",
          },
        ],
      },
      {
        sectionTitle: "Node.js Coding Challenge",
        sectionType: "coding",
        sectionDescription: "Candidates must solve coding challenges using Node.js",
        questions: [
          {
            text: "Write a function to reverse a string.",
            sampleInput: '"hello"',
            sampleOutput: '"olleh"',
            explanation: "Use split-reverse-join method to reverse a string.",
          },
          {
            text: "Write a function to calculate the factorial of a given number.",
            sampleInput: "5",
            sampleOutput: "120",
            explanation: "Use recursion or a for-loop to calculate the factorial.",
          },
        ],
      },
    ],
  },
];

// Icons
const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ViewTest = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [editTest, setEditTest] = useState(null);
  const navigate = useNavigate();

  const handleCloseModal = () => setSelectedTest(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Test Management
            </h1>
            <p className="text-gray-500 mt-1">View and manage your assessments.</p>
          </div>
          <button
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
            onClick={() => navigate("/trainer/create-test")}
          >
            <FilePlus className="w-5 h-5" />
            Create Assessment
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-left text-gray-600">#</th>
                <th className="p-4 font-semibold text-left text-gray-600">Title</th>
                <th className="p-4 font-semibold text-left text-gray-600">Duration</th>
                <th className="p-4 font-semibold text-center text-gray-600">Status</th>
                <th className="p-4 font-semibold text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.map((test, idx) => (
                <tr key={test.id} className="hover:bg-sky-50/50 transition-colors duration-200">
                  <td className="p-4 text-gray-500">{idx + 1}</td>
                  <td className="p-4 text-gray-800 font-medium">{test.title}</td>
                  <td className="p-4 text-gray-600">{test.duration} min</td>
                  <td className="p-4 text-center">
                    {test.active ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
                      >
                        <ViewIcon /> View
                      </button>
                      <button
                        onClick={() => setEditTest(test)}
                        className="flex items-center bg-emerald-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-200"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-gray-300 flex flex-col">
            <header className="p-4 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-blue-700">{selectedTest.title}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <CloseIcon />
              </button>
            </header>
            <div className="p-6 overflow-y-auto">
              <p className="text-gray-700 mb-4">{selectedTest.description}</p>
              <div className="flex space-x-8 mb-6 text-sm">
                <p className="text-gray-500">Duration: <span className="font-semibold text-gray-800">{selectedTest.duration} minutes</span></p>
                <p className="text-gray-500">Schedule: <span className="font-semibold text-gray-800">{new Date(selectedTest.startDate).toLocaleString()} to {new Date(selectedTest.endDate).toLocaleString()}</span></p>
              </div>

              <div className="space-y-6">
                {selectedTest.sections.map((section, sidx) => (
                  <div key={sidx} className="border rounded-lg bg-slate-50">
                    <div className="p-4 border-b">
                      <h4 className="text-lg font-semibold text-indigo-700">Section {sidx + 1}: {section.sectionTitle}</h4>
                      <p className="text-sm text-gray-600 mt-1">{section.sectionDescription}</p>
                    </div>
                    <div className="p-4 space-y-4">
                      {section.questions.map((q, qidx) => (
                        <div key={qidx} className="border rounded p-4 bg-white shadow-sm">
                          <p className="font-medium text-gray-800 mb-2">
                            {section.sectionType === "mcq" ? `Q${qidx + 1}: ${q.text}` : `Problem ${qidx + 1}: ${q.text}`}
                          </p>
                          {section.sectionType === "mcq" && (
                            <ul className="space-y-1 mb-2">
                              {q.options.map((opt, oidx) => (
                                <li key={oidx} className={`text-gray-700 pl-4 py-1 rounded ${opt === q.correctAnswer ? 'bg-green-50 text-green-800 font-semibold' : ''}`}>
                                  - {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                          {section.sectionType === "coding" && (
                            <div className="text-sm space-y-2 bg-gray-800 text-white rounded p-3 font-mono">
                              <p><span className="text-gray-400">Sample Input:</span> {q.sampleInput}</p>
                              <p><span className="text-gray-400">Sample Output:</span> {q.sampleOutput}</p>
                              <p><span className="text-gray-400">Explanation:</span> {q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTest && (
        <EditTest editTest={editTest} setEditTest={setEditTest} />
      )}
    </div>
  );
};

export default ViewTest;
