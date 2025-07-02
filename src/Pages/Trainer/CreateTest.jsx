import React, { useState } from "react";

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
      if (field === "text") question.text = value;
      else if (field === "sampleInput") question.sampleInput = value;
      else if (field === "sampleOutput") question.sampleOutput = value;
      else if (field === "explanation") question.explanation = value;
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
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-blue-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-8 space-y-10 border border-slate-200">

        {/* header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-4xl font-bold text-indigo-700">Create Test</h1>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:opacity-90 transition shadow"
          >
            Save Test
          </button>
        </div>

        {/* test details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-700">Test Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium text-gray-600 mb-1 block">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Test title"
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="font-medium text-gray-600 mb-1 block">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="font-medium text-gray-600 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2">Sections</h2>
          {sections.map((section, sidx) => (
            <div
              key={sidx}
              className="border rounded-2xl p-6 bg-indigo-50 shadow-inner space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-indigo-800">
                  Section {sidx + 1}
                </h3>
                <button
                  onClick={() => deleteSection(sidx)}
                  className="text-red-600 hover:underline text-xs"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={section.sectionTitle}
                  onChange={(e) =>
                    handleSectionChange(sidx, "sectionTitle", e.target.value)
                  }
                  placeholder="Section title"
                  className="rounded border px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
                <select
                  value={section.sectionType}
                  onChange={(e) =>
                    handleSectionChange(sidx, "sectionType", e.target.value)
                  }
                  className="rounded border px-4 py-2 focus:ring-2 focus:ring-purple-400"
                >
                  <option value="mcq">MCQ</option>
                  <option value="coding">Coding</option>
                </select>
              </div>
              <textarea
                value={section.sectionDescription}
                onChange={(e) =>
                  handleSectionChange(sidx, "sectionDescription", e.target.value)
                }
                placeholder="Section description"
                className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-purple-400"
              />

              {/* questions */}
              {section.questions.map((q, qidx) => (
                <div
                  key={qidx}
                  className="border rounded-xl p-4 bg-white shadow space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">
                      {section.sectionType === "mcq"
                        ? `MCQ ${qidx + 1}`
                        : `Coding Problem ${qidx + 1}`}
                    </span>
                    <button
                      onClick={() => deleteQuestionFromSection(sidx, qidx)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    value={q.text}
                    onChange={(e) =>
                      handleQuestionChange(sidx, qidx, "text", e.target.value)
                    }
                    placeholder={section.sectionType === "mcq" ? "Question" : "Problem statement"}
                    className="w-full rounded border px-3 py-2"
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
                            className="rounded border px-3 py-2"
                          />
                        ))}
                      </div>
                      <input
                        value={q.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(sidx, qidx, "correctAnswer", e.target.value)
                        }
                        placeholder="Correct answer"
                        className="w-full rounded border px-3 py-2"
                      />
                    </>
                  )}
                  {section.sectionType === "coding" && (
                    <>
                      <input
                        value={q.sampleInput || ""}
                        onChange={(e) =>
                          handleQuestionChange(sidx, qidx, "sampleInput", e.target.value)
                        }
                        placeholder="Sample input"
                        className="w-full rounded border px-3 py-2"
                      />
                      <input
                        value={q.sampleOutput || ""}
                        onChange={(e) =>
                          handleQuestionChange(sidx, qidx, "sampleOutput", e.target.value)
                        }
                        placeholder="Sample output"
                        className="w-full rounded border px-3 py-2"
                      />
                      <textarea
                        value={q.explanation || ""}
                        onChange={(e) =>
                          handleQuestionChange(sidx, qidx, "explanation", e.target.value)
                        }
                        placeholder="Explanation"
                        className="w-full rounded border px-3 py-2"
                      />
                    </>
                  )}
                </div>
              ))}
              <button
                onClick={() => addQuestionToSection(sidx)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:opacity-90 mt-2 shadow"
              >
                + Add Question
              </button>
            </div>
          ))}
          <button
            onClick={addSection}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:opacity-90 mt-2 shadow"
          >
            + Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
