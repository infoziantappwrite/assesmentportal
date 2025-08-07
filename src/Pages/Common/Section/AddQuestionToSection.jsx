// Keep all your current imports
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createQuestionInSection } from "../../../Controllers/QuestionController";
import { ArrowLeft, PlusCircle } from "lucide-react";

// Reuse your defaultQuestionData helper
const defaultQuestionData = (order = 1) => ({
  title: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  marks: 1,
  sequence_order: order,
  difficulty: "easy",
  statusMessage: "",
  loading: false,
  submitted: false,
});

const AddQuestionToSection = () => {
  const { id: sectionID } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([defaultQuestionData(1)]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [mode, setMode] = useState("form"); // "form" | "bulk"
  const [bulkInput, setBulkInput] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctOptionIndex = optIndex;
    setQuestions(updated);
  };

  const handleAddAnother = () => {
    const nextOrder = questions.length + 1;
    setQuestions([...questions, defaultQuestionData(nextOrder)]);
  };

  const handleSubmitAll = async () => {
    setGlobalLoading(true);
    const updated = [...questions];

    for (let i = 0; i < updated.length; i++) {
      const q = updated[i];
      if (q.submitted) continue;

      updated[i].loading = true;
      updated[i].statusMessage = "";

      try {
        const options = q.options.map((text, idx) => ({
          option_id: `opt${idx + 1}`,
          text: text.trim(),
          is_correct: idx === q.correctOptionIndex,
        }));

        const correct_answers = [options[q.correctOptionIndex].option_id];

        const questionPayload = {
          type: "single_correct",
          content: {
            question_text: q.title.trim(),
          },
          options,
          correct_answers,
          marks: q.marks,
          sequence_order: q.sequence_order,
          difficulty: q.difficulty,
        };

        await createQuestionInSection(sectionID, questionPayload);
        updated[i].statusMessage = "✅ Added successfully";
        updated[i].submitted = true;
      } catch (err) {
        updated[i].statusMessage =
          err.response?.data?.message || "❌ Failed to add.";
      } finally {
        updated[i].loading = false;
      }
    }

    setQuestions([...updated]);
    setGlobalLoading(false);
  };

  const parseBulkInput = () => {
    const blocks = bulkInput.trim().split(/\n(?=Question\s+\d+)/i);
    const parsedQuestions = [];

    blocks.forEach((block, i) => {
      const lines = block.trim().split("\n");

      const getField = (prefix) =>
        lines.find((line) => line.toLowerCase().startsWith(prefix.toLowerCase()));

      const title = getField("Title *")?.split("Title *")[1]?.trim();
      const opt1 = getField("Option 1")?.split("Option 1")[1]?.trim();
      const opt2 = getField("Option 2")?.split("Option 2")[1]?.trim();
      const opt3 = getField("Option 3")?.split("Option 3")[1]?.trim();
      const opt4 = getField("Option 4")?.split("Option 4")[1]?.trim();
      const correctOption = parseInt(getField("Correct Option")?.split("Correct Option")[1]?.trim()) - 1;
      const marks = parseInt(getField("Marks *")?.split("Marks *")[1]?.trim()) || 1;
      const order = parseInt(getField("Sequence Order *")?.split("Sequence Order *")[1]?.trim()) || i + 1;
      const difficulty = getField("Difficulty")?.split("Difficulty")[1]?.trim() || "easy";

      if (
        title &&
        [opt1, opt2, opt3, opt4].every(Boolean) &&
        correctOption >= 0 &&
        correctOption <= 3
      ) {
        parsedQuestions.push({
          ...defaultQuestionData(order),
          title,
          options: [opt1, opt2, opt3, opt4],
          correctOptionIndex: correctOption,
          marks,
          sequence_order: order,
          difficulty,
        });
      }
    });

    if (parsedQuestions.length > 0) {
      setQuestions(parsedQuestions);
      setMode("form"); // switch back to form mode
    } else {
      alert("No valid questions parsed. Please check the format.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Questions to Section
        </h2>
        <div className="space-x-3">
          <button
            onClick={() => setMode("form")}
            className={`px-3 py-1 rounded-md text-sm ${
              mode === "form" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Form Mode
          </button>
          <button
            onClick={() => setMode("bulk")}
            className={`px-3 py-1 rounded-md text-sm ${
              mode === "bulk" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Bulk Paste Mode
          </button>
        </div>
      </div>

      {mode === "bulk" ? (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <label className="block font-semibold text-gray-700 mb-2">
            Paste Questions (Format below):
          </label>
          <textarea
            rows={15}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full border px-4 py-2 rounded-md text-sm font-mono"
            placeholder={`Question 1\nTitle * What is 2 + 2?\nOptions *\nOption 1 2\nOption 2 3\nOption 3 4\nOption 4 5\nCorrect Option 3\nMarks * 1\nSequence Order * 1\nDifficulty easy\n\nQuestion 2\nTitle * What is capital of France?\nOptions *\nOption 1 Berlin\nOption 2 Paris\nOption 3 Rome\nOption 4 Madrid\nCorrect Option 2\nMarks * 1\nSequence Order * 2\nDifficulty easy`}
          />
          <button
            onClick={parseBulkInput}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow"
          >
            📄 Parse Questions
          </button>
        </div>
      ) : (
        <>
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white p-6 mb-6 shadow rounded-xl border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Question {index + 1}
              </h3>

              {q.statusMessage && (
                <div
                  className={`mb-4 px-4 py-2 rounded text-white text-sm shadow ${
                    q.statusMessage.startsWith("✅") ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {q.statusMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md"
                    value={q.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Options *
                  </label>
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center mb-2 gap-2">
                      <input
                        type="radio"
                        name={`correctOption-${index}`}
                        checked={q.correctOptionIndex === idx}
                        onChange={() => handleCorrectOption(index, idx)}
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, idx, e.target.value)
                        }
                        placeholder={`Option ${idx + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Marks *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-md"
                      value={q.marks}
                      onChange={(e) =>
                        handleChange(index, "marks", parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Sequence Order *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-md"
                      value={q.sequence_order}
                      onChange={(e) =>
                        handleChange(index, "sequence_order", parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Difficulty
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-md"
                    value={q.difficulty}
                    onChange={(e) =>
                      handleChange(index, "difficulty", e.target.value)
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={handleAddAnother}
              className="text-indigo-600 font-medium hover:underline"
            >
              ➕ Add Another Question
            </button>

            <button
              onClick={handleSubmitAll}
              disabled={globalLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow disabled:opacity-50"
            >
              {globalLoading ? "Submitting..." : "🚀 Submit All Questions"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddQuestionToSection;