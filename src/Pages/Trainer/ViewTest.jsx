import React, { useState } from "react";

// --- Data (Unchanged) ---
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
            correctAnswer: "Float"
          },
          {
            text: "Which method converts JSON text to a JavaScript object?",
            options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()"],
            correctAnswer: "JSON.parse()"
          }
        ]
      },
      {
        sectionTitle: "Node.js Coding Challenge",
        sectionType: "coding",
        sectionDescription: "Candidates must solve coding challenges using Node.js",
        questions: [
          {
            text: "Write a function to reverse a string.",
            sampleInput: "\"hello\"",
            sampleOutput: "\"olleh\"",
            explanation: "Use split-reverse-join method to reverse a string."
          },
          {
            text: "Write a function to calculate the factorial of a given number.",
            sampleInput: "5",
            sampleOutput: "120",
            explanation: "Use recursion or a for-loop to calculate the factorial."
          }
        ]
      }
    ]
  }
];

const colleges = ["ABC College", "XYZ University", "PQR Institute"];
const batches = ["Batch 1", "Batch 2", "Batch 3"];

// --- Helper Components for Icons ---
const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// --- Main Component ---
const ViewTest = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [mapTest, setMapTest] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [mappedStartDate, setMappedStartDate] = useState("");
  const [mappedEndDate, setMappedEndDate] = useState("");
  const [editTest, setEditTest] = useState(null);


  const handleCloseModal = () => setSelectedTest(null);
  const handleCloseMap = () => {
    setMapTest(null);
    setSelectedCollege("");
    setSelectedBatches([]);
    setMappedStartDate("");
    setMappedEndDate("");
  };
  const handleMapSubmit = () => {
    if (!selectedCollege || selectedBatches.length === 0) {
      alert("Please select a college and at least one batch.");
      return;
    }
    if (!mappedStartDate || !mappedEndDate) {
      alert("Please select start and end timing for this mapping.");
      return;
    }
    console.log(`Mapped Test: ${mapTest.title}`);
    console.log(`College: ${selectedCollege}`);
    console.log(`Batches: ${selectedBatches.join(", ")}`);
    console.log(`Schedule: ${mappedStartDate} to ${mappedEndDate}`);
    alert(`Mapped successfully to ${selectedCollege} with batches: ${selectedBatches.join(", ")} scheduled from ${mappedStartDate} to ${mappedEndDate}`);
    handleCloseMap();
  };


  const toggleBatch = (batch) => {
    setSelectedBatches(
      selectedBatches.includes(batch)
        ? selectedBatches.filter((b) => b !== batch)
        : [...selectedBatches, batch]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Test Management
          </h1>
          <p className="text-gray-500 mt-1">View, manage, and map your assessments.</p>
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
                        onClick={() => setMapTest(test)}
                        className="flex items-center bg-purple-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-purple-600 transition-all duration-200"
                      >
                        <MapIcon /> Map
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
                            <>
                              <ul className="space-y-1 mb-2">
                                {q.options.map((opt, oidx) => (
                                  <li key={oidx} className={`text-gray-700 pl-4 py-1 rounded ${opt === q.correctAnswer ? 'bg-green-50 text-green-800 font-semibold' : ''}`}>
                                    - {opt}
                                  </li>
                                ))}
                              </ul>
                            </>
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

      {/* Map Modal */}
      {mapTest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-300 overflow-hidden flex flex-col">

            {/* header */}
            <header className="p-5 border-b flex justify-between items-center bg-purple-50">
              <h3 className="text-xl font-bold text-purple-700">Map Test: {mapTest.title}</h3>
              <button
                onClick={handleCloseMap}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <CloseIcon />
              </button>
            </header>

            {/* scrollable body */}
            <div className="p-5 space-y-6 overflow-y-auto max-h-[80vh]">

              {/* College select */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Select College</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
                >
                  <option value="">-- Select a College --</option>
                  {colleges.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Batches */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Select Batches</label>
                <div className="space-y-2 rounded-lg border border-gray-200 p-3 bg-gray-50">
                  {batches.map((b, idx) => (
                    <label
                      key={idx}
                      htmlFor={`batch-${idx}`}
                      className="flex items-center gap-3 py-1 cursor-pointer hover:bg-purple-50 rounded transition-colors"
                    >
                      <input
                        id={`batch-${idx}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={selectedBatches.includes(b)}
                        onChange={() => toggleBatch(b)}
                      />
                      <span className="text-gray-800">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Mapped Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={mappedStartDate}
                    onChange={(e) => setMappedStartDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Mapped End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={mappedEndDate}
                    onChange={(e) => setMappedEndDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
                  />
                </div>
              </div>

            </div>

            {/* footer */}
            <footer className="p-5 border-t">
              <button
                onClick={handleMapSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-all shadow"
              >
                Map Test
              </button>
            </footer>
          </div>
        </div>
      )}


      {/* Edit Modal */}
  {editTest && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
      <header className="p-5 border-b flex justify-between items-center bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-t-2xl">
        <h3 className="text-xl font-bold text-emerald-800">
          Edit Test: {editTest.title}
        </h3>
        <button
          onClick={() => setEditTest(null)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">

        {/* Test details */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold">Title</label>
          <input
            className="w-full border rounded px-3 py-2 focus:outline-emerald-500 shadow-sm"
            value={editTest.title}
            onChange={(e) =>
              setEditTest({ ...editTest, title: e.target.value })
            }
          />

          <label className="block text-sm font-semibold">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-emerald-500 shadow-sm"
            rows={3}
            value={editTest.description}
            onChange={(e) =>
              setEditTest({ ...editTest, description: e.target.value })
            }
          />

          <label className="block text-sm font-semibold">Duration (minutes)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 focus:outline-emerald-500 shadow-sm"
            value={editTest.duration}
            onChange={(e) =>
              setEditTest({ ...editTest, duration: e.target.value })
            }
          />
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-indigo-700 border-b pb-2">Sections</h4>
          {editTest.sections.map((section, sidx) => (
            <div
              key={sidx}
              className="rounded-xl border border-gray-200 p-4 bg-slate-50 shadow-inner space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold mb-1">Section Title</label>
                <input
                  className="w-full border rounded px-2 py-1 focus:outline-indigo-500"
                  value={section.sectionTitle}
                  onChange={(e) => {
                    const updatedSections = [...editTest.sections];
                    updatedSections[sidx].sectionTitle = e.target.value;
                    setEditTest({ ...editTest, sections: updatedSections });
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Section Description</label>
                <textarea
                  className="w-full border rounded px-2 py-1 focus:outline-indigo-500"
                  rows={2}
                  value={section.sectionDescription}
                  onChange={(e) => {
                    const updatedSections = [...editTest.sections];
                    updatedSections[sidx].sectionDescription = e.target.value;
                    setEditTest({ ...editTest, sections: updatedSections });
                  }}
                />
              </div>

              {/* Questions */}
              <div className="space-y-3 mt-4">
                <h5 className="text-sm font-semibold text-purple-600">Questions</h5>
                {section.questions.map((q, qidx) => (
                  <div key={qidx} className="border rounded p-3 bg-white shadow">
                    <label className="block text-xs font-semibold mb-1 text-gray-600">
                      {section.sectionType === "mcq"
                        ? `MCQ Question ${qidx + 1}`
                        : `Coding Problem ${qidx + 1}`}
                    </label>
                    <textarea
                      className="w-full border rounded mb-2 px-2 py-1 focus:outline-purple-500"
                      rows={2}
                      value={q.text}
                      onChange={(e) => {
                        const updatedSections = [...editTest.sections];
                        updatedSections[sidx].questions[qidx].text = e.target.value;
                        setEditTest({ ...editTest, sections: updatedSections });
                      }}
                    />

                    {section.sectionType === "mcq" && (
                      <div className="space-y-1">
                        {q.options.map((opt, oidx) => (
                          <div key={oidx} className="flex items-center gap-2 mb-1">
                            <input
                              className="w-full border rounded px-2 py-1 focus:outline-purple-500"
                              value={opt}
                              onChange={(e) => {
                                const updatedSections = [...editTest.sections];
                                updatedSections[sidx].questions[qidx].options[oidx] =
                                  e.target.value;
                                setEditTest({
                                  ...editTest,
                                  sections: updatedSections,
                                });
                              }}
                            />
                            <input
                              type="radio"
                              name={`correct-${sidx}-${qidx}`}
                              checked={q.correctAnswer === opt}
                              onChange={() => {
                                const updatedSections = [...editTest.sections];
                                updatedSections[sidx].questions[qidx].correctAnswer = opt;
                                setEditTest({
                                  ...editTest,
                                  sections: updatedSections,
                                });
                              }}
                              className="accent-green-600"
                            />
                            <span className="text-xs">Correct</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.sectionType === "coding" && (
                      <div className="space-y-2 text-xs mt-2">
                        <input
                          className="w-full border rounded px-2 py-1"
                          placeholder="Sample Input"
                          value={q.sampleInput}
                          onChange={(e) => {
                            const updatedSections = [...editTest.sections];
                            updatedSections[sidx].questions[qidx].sampleInput =
                              e.target.value;
                            setEditTest({
                              ...editTest,
                              sections: updatedSections,
                            });
                          }}
                        />
                        <input
                          className="w-full border rounded px-2 py-1"
                          placeholder="Sample Output"
                          value={q.sampleOutput}
                          onChange={(e) => {
                            const updatedSections = [...editTest.sections];
                            updatedSections[sidx].questions[qidx].sampleOutput =
                              e.target.value;
                            setEditTest({
                              ...editTest,
                              sections: updatedSections,
                            });
                          }}
                        />
                        <textarea
                          className="w-full border rounded px-2 py-1"
                          placeholder="Explanation"
                          rows={2}
                          value={q.explanation}
                          onChange={(e) => {
                            const updatedSections = [...editTest.sections];
                            updatedSections[sidx].questions[qidx].explanation =
                              e.target.value;
                            setEditTest({
                              ...editTest,
                              sections: updatedSections,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={() => {
            console.log("Updated Test:", editTest);
            alert("Test updated successfully!");
            setEditTest(null);
          }}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded px-4 py-3 hover:opacity-90 transition-all shadow"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default ViewTest;