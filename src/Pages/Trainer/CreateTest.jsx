import React, { useState } from "react";
import { ArrowLeft, Save, PlusCircle, Trash2 } from "lucide-react";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [sections, setSections] = useState([
    {
      sectionTitle: "",
      sectionType: "mcq",
      sectionDescription: "",
      questions: [
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: ""
        }
      ]
    }
  ]);

  const handleSectionChange = (sidx, field, value) => {
    const updated = [...sections];
    updated[sidx][field] = value;
    setSections(updated);
  };

  const handleQuestionChange = (sidx, qidx, field, value) => {
    const updated = [...sections];
    const question = updated[sidx].questions[qidx];
    if (updated[sidx].sectionType === "mcq") {
      if (field === "text") question.text = value;
      else if (field.startsWith("option")) {
        const optIndex = parseInt(field.split("-")[1], 10);
        question.options[optIndex] = value;
      } else if (field === "correctAnswer") {
        question.correctAnswer = value;
      }
    } else {
      question[field] = value;
    }
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        sectionTitle: "",
        sectionType: "mcq",
        sectionDescription: "",
        questions: [
          {
            text: "",
            options: ["", "", "", ""],
            correctAnswer: ""
          }
        ]
      }
    ]);
  };

  const deleteSection = (sidx) => {
    const updated = [...sections];
    updated.splice(sidx, 1);
    setSections(updated);
  };

  const addQuestionToSection = (sidx) => {
    const updated = [...sections];
    if (updated[sidx].sectionType === "mcq") {
      updated[sidx].questions.push({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      });
    } else {
      updated[sidx].questions.push({
        text: "",
        sampleInput: "",
        sampleOutput: "",
        explanation: ""
      });
    }
    setSections(updated);
  };

  const deleteQuestionFromSection = (sidx, qidx) => {
    const updated = [...sections];
    updated[sidx].questions.splice(qidx, 1);
    setSections(updated);
  };

  const handleSave = () => {
    const testData = {
      title,
      description,
      duration,
      sections
    };
    console.log("Saved test:", testData);
    alert("Test saved successfully! (Check console for data)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200">
        <header className="p-6 border-b flex justify-between items-center rounded-t-3xl bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
            <ArrowLeft className="w-5 h-5" />
            <span>Create Test</span>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </header>

        <div className="p-8 space-y-10">
          {/* Test Details */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Test Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Test Title"
                className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration (minutes)"
                className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short Description"
              className="w-full mt-4 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-400 shadow-sm"
              rows={3}
            />
          </section>

          {/* Sections */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 border-b pb-2">Sections</h2>
            {sections.map((section, sidx) => (
              <div
                key={sidx}
                className="border rounded-2xl p-6 bg-slate-50 shadow-inner space-y-4 mb-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-indigo-700">Section {sidx + 1}</h3>
                  <button
                    onClick={() => deleteSection(sidx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={section.sectionTitle}
                    onChange={(e) => handleSectionChange(sidx, "sectionTitle", e.target.value)}
                    placeholder="Section Title"
                    className="rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  />
                  <select
                    value={section.sectionType}
                    onChange={(e) => handleSectionChange(sidx, "sectionType", e.target.value)}
                    className="rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-400 shadow-sm"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>

                <textarea
                  value={section.sectionDescription}
                  onChange={(e) => handleSectionChange(sidx, "sectionDescription", e.target.value)}
                  placeholder="Section Description"
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-400 shadow-sm"
                />

                {section.questions.map((q, qidx) => (
                  <div key={qidx} className="border rounded-xl p-4 bg-white shadow space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-indigo-700">
                        {section.sectionType === "mcq" ? `MCQ ${qidx + 1}` : `Coding Problem ${qidx + 1}`}
                      </span>
                      <button
                        onClick={() => deleteQuestionFromSection(sidx, qidx)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      value={q.text}
                      onChange={(e) => handleQuestionChange(sidx, qidx, "text", e.target.value)}
                      placeholder={section.sectionType === "mcq" ? "Question" : "Problem statement"}
                      className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm"
                    />

                    {section.sectionType === "mcq" && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <input
                              key={optIdx}
                              value={opt}
                              onChange={(e) =>
                                handleQuestionChange(sidx, qidx, `option-${optIdx}`, e.target.value)
                              }
                              placeholder={`Option ${optIdx + 1}`}
                              className="rounded border border-gray-300 px-3 py-2 shadow-sm"
                            />
                          ))}
                        </div>
                        <input
                          value={q.correctAnswer}
                          onChange={(e) => handleQuestionChange(sidx, qidx, "correctAnswer", e.target.value)}
                          placeholder="Correct Answer"
                          className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm"
                        />
                      </>
                    )}

                    {section.sectionType === "coding" && (
                      <>
                        <input
                          value={q.sampleInput || ""}
                          onChange={(e) => handleQuestionChange(sidx, qidx, "sampleInput", e.target.value)}
                          placeholder="Sample Input"
                          className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm"
                        />
                        <input
                          value={q.sampleOutput || ""}
                          onChange={(e) => handleQuestionChange(sidx, qidx, "sampleOutput", e.target.value)}
                          placeholder="Sample Output"
                          className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm"
                        />
                        <textarea
                          value={q.explanation || ""}
                          onChange={(e) => handleQuestionChange(sidx, qidx, "explanation", e.target.value)}
                          placeholder="Explanation"
                          className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm"
                        />
                      </>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addQuestionToSection(sidx)}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 shadow transition"
                >
                  + Add Question
                </button>
              </div>
            ))}

            <button
              onClick={addSection}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition shadow"
            >
              <PlusCircle className="w-4 h-4" /> Add Section
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
