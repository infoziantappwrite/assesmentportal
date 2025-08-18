import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createQuestionInSection } from "../../../Controllers/QuestionController";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";


const defaultQuestionData = (order = 1) => ({
  title: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  marks: 1, // Default to 1 mark per question
  sequence_order: order,
  difficulty: "easy",
  statusMessage: "",
  loading: false,
  submitted: false,
});

const AddQuestionToSection = () => {
  const { id: sectionID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();   
  const totalMarks = location.state?.totalMarks;
  const existingQuestionCount = location.state?.questionCount || 0;
  const marksPerQuestion = 1; // Assuming 1 mark per question as per your data

  const [questions, setQuestions] = useState([defaultQuestionData(existingQuestionCount + 1)]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [mode, setMode] = useState("form");
  const [bulkInput, setBulkInput] = useState("");
  const [currentTotalMarks, setCurrentTotalMarks] = useState(0);
  const [marksError, setMarksError] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState(
    Math.floor((totalMarks - (existingQuestionCount * marksPerQuestion)) / marksPerQuestion)
  );

  // Calculate current total marks and remaining questions whenever questions change
  useEffect(() => {
    const sum = questions.reduce((total, q) => total + (q.submitted ? 0 : q.marks), 0);
    setCurrentTotalMarks(sum);
    
    const remaining = Math.floor(
      (totalMarks - (existingQuestionCount * marksPerQuestion) - sum) / marksPerQuestion
    );
    setRemainingQuestions(remaining);
    
    if (sum > (totalMarks - (existingQuestionCount * marksPerQuestion))) {
      setMarksError(`Cannot exceed total section marks! (${totalMarks} total, ${existingQuestionCount * marksPerQuestion} already used)`);
    } else {
      setMarksError("");
    }
  }, [questions, totalMarks, existingQuestionCount, marksPerQuestion]);

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
    if (remainingQuestions <= 0) {
      setMarksError(`Cannot add more questions. Maximum ${totalMarks} marks reached.`);
      return;
    }
    
    const nextOrder = existingQuestionCount + questions.length + 1;
    setQuestions([...questions, defaultQuestionData(nextOrder)]);
  };

  const handleSubmitAll = async () => {
    if (marksError) {
      toast.error("Please fix the marks allocation before submitting.");
      return;
    }

    setGlobalLoading(true);
    const updated = [...questions];

    for (let i = 0; i < updated.length; i++) {
      const q = updated[i];
      if (q.submitted) continue;

      // Validate question before submission
      if (!q.title.trim()) {
        updated[i].statusMessage = "❌ Question title is required";
        continue;
      }
      
      if (q.options.some(opt => !opt.trim())) {
        updated[i].statusMessage = "❌ All options must be filled";
        continue;
      }

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

    setQuestions(updated);
    setGlobalLoading(false);
    
    // Check if all questions are submitted
    if (updated.every(q => q.submitted)) {
      toast.success("🎉 All questions submitted successfully!");
      navigate(-1); // Go back to previous page
    }
  };

  const parseBulkInput = () => {
    const blocks = bulkInput.trim().split(/\n(?=Question\s+\d+)/i);
    const parsedQuestions = [];
    let totalParsedMarks = 0;

    blocks.forEach((block, i) => {
      if (remainingQuestions <= 0) {
        toast.error(`Cannot add more questions. Maximum ${totalMarks} marks reached.`);
        return;
      }

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
      const order = existingQuestionCount + i + 1;
      const difficulty = getField("Difficulty")?.split("Difficulty")[1]?.trim() || "easy";

      if (
        title &&
        [opt1, opt2, opt3, opt4].every(Boolean) &&
        correctOption >= 0 &&
        correctOption <= 3
      ) {
        if (totalParsedMarks + marks > (totalMarks - (existingQuestionCount * marksPerQuestion))) {
          toast.warn(`Skipping question ${i+1} as it would exceed remaining marks`);
          return;
        }
        
        parsedQuestions.push({
          ...defaultQuestionData(order),
          title,
          options: [opt1, opt2, opt3, opt4],
          correctOptionIndex: correctOption,
          marks,
          sequence_order: order,
          difficulty,
        });
        
        totalParsedMarks += marks;
      }
    });

    if (parsedQuestions.length > 0) {
      setQuestions(parsedQuestions);
      setMode("form");
      toast.success(`✅ Parsed ${parsedQuestions.length} questions`);
    } else {
      toast.error("No valid questions parsed. Please check the format.");
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

      {totalMarks && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
<p className="font-semibold text-blue-800">
          Section Status: Total Marks: {totalMarks} | 
          Existing Questions: {existingQuestionCount} | 
          Adding: {questions.length} questions | 
          Can Add: {remainingQuestions} more questions
        </p>
          {marksError && (
            <p className="text-red-600 mt-1 font-medium">{marksError}</p>
          )}
        </div>
      )}

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
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-semibold">Notes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each question must start with "Question X"</li>
              <li>Required fields are marked with *</li>
              <li>Correct Option should be the option number (1-4)</li>
              {totalMarks && <li>Total marks of all questions cannot exceed {totalMarks}</li>}
            </ul>
          </div>
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
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Question {index + 1}
                </h3>
                {!q.submitted && (
                  <button
                    onClick={() => {
                      if (questions.length > 1) {
                        setQuestions(questions.filter((_, i) => i !== index));
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

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
                    disabled={q.submitted}
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
                        disabled={q.submitted}
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
                        disabled={q.submitted}
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
                        handleChange(index, "marks", parseInt(e.target.value) || 0)
                      }
                      min="1"
                      disabled={q.submitted}
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
                      min="1"
                      disabled={q.submitted}
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
                    disabled={q.submitted}
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
              disabled={!!marksError || (totalMarks && currentTotalMarks >= totalMarks)}
              className={`text-indigo-600 font-medium ${marksError || (totalMarks && currentTotalMarks >= totalMarks) ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
            >
              ➕ Add Another Question
            </button>

            <button
              onClick={handleSubmitAll}
              disabled={globalLoading || !!marksError || currentTotalMarks === 0}
              className={`bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md shadow ${
                globalLoading || marksError || currentTotalMarks === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
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