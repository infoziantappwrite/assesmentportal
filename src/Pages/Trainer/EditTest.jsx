import React from 'react';

const EditTest = ({ editTest, setEditTest }) => {
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div>
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
      </div>
    </div>
  );
};

export default EditTest;
