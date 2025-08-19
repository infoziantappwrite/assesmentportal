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
  const questionBlocks = bulkInput.trim().split(/\n(?=Question\s+\d+)/i);
  const parsedQuestions = [];
  let totalParsedMarks = 0;

  questionBlocks.forEach((block, blockIndex) => {
    if (remainingQuestions <= 0) return;

    const lines = block.split('\n');
    const questionData = {
      ...defaultQuestionData(existingQuestionCount + blockIndex + 1),
      title: "",
      options: ["", "", "", ""],
      correctOptionIndex: -1,
      marks: 1,
      difficulty: "easy"
    };

    let currentSection = null;
    let currentOptionIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;

      // Handle multi-line content by checking if the next line is part of current content
      while (i + 1 < lines.length && 
             !lines[i + 1].trim().match(/^(Question|Title|Options|Correct Option|Marks|Sequence Order|Difficulty|Option [1-4])/i) &&
             lines[i + 1].trim() !== "") {
        line += '\n' + lines[i + 1].trim();
        i++;
      }

      // Detect sections
      if (line.match(/^Question\s+\d+/i)) {
        continue;
      }
      else if (line.match(/^Title\s*\*/i)) {
        questionData.title = line.replace(/^Title\s*\*\s*/, '').trim();
      }
      else if (line.match(/^Options\s*\*/i)) {
        currentSection = 'options';
      }
      else if (line.match(/^Correct\s+Option/i)) {
        const value = line.replace(/^Correct\s+Option\s*/i, '').trim();
        questionData.correctOptionIndex = parseInt(value) - 1;
      }
      else if (line.match(/^Marks\s*\*/i)) {
        const value = line.replace(/^Marks\s*\*\s*/i, '').trim();
        questionData.marks = parseInt(value) || 1;
      }
      else if (line.match(/^Sequence\s+Order\s*\*/i)) {
        const value = line.replace(/^Sequence\s+Order\s*\*\s*/i, '').trim();
        questionData.sequence_order = parseInt(value) || questionData.sequence_order;
      }
      else if (line.match(/^Difficulty/i)) {
        questionData.difficulty = line.replace(/^Difficulty\s*/i, '').trim() || "easy";
      }
      else if (line.match(/^Option\s+[1-4]/i)) {
        const match = line.match(/^Option\s+([1-4])/i);
        if (match) {
          const optionNum = parseInt(match[1]) - 1;
          const optionText = line.replace(/^Option\s+[1-4]\s*/i, '').trim();
          questionData.options[optionNum] = optionText;
        }
      }
      else if (questionData.title && currentSection !== 'options') {
        // If we have text that doesn't match any pattern, add it to the title
        questionData.title += '\n' + line;
      }
    }

    // Validate and add question
    if (questionData.title.trim() &&
        questionData.options.every(opt => opt.trim()) &&
        questionData.correctOptionIndex >= 0 &&
        questionData.correctOptionIndex <= 3) {

      if (totalParsedMarks + questionData.marks > (totalMarks - (existingQuestionCount * marksPerQuestion))) {
        toast.warn(`Skipping question ${blockIndex + 1} - exceeds remaining marks`);
        return;
      }

      parsedQuestions.push(questionData);
      totalParsedMarks += questionData.marks;
    } else {
      console.log("Invalid question data:", questionData);
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
            className={`px-3 py-1 rounded-md text-sm ${mode === "form" ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
          >
            Form Mode
          </button>
          <button
            onClick={() => setMode("bulk")}
            className={`px-3 py-1 rounded-md text-sm ${mode === "bulk" ? "bg-indigo-600 text-white" : "bg-gray-200"
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
            Paste Questions (Use the format below):
          </label>

          {/* Format example that's easy to copy */}
          <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200 font-mono text-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600">Copy this format:</span>
              <button
                onClick={() => {
                  const textToCopy = `Question 1
Title * What is 2 + 2?
Options *
Option 1 2
Option 2 3
Option 3 4
Option 4 5
Correct Option 3
Marks * 1
Sequence Order * 1
Difficulty easy

Question 2
Title * What is capital of France?
Options *
Option 1 Berlin
Option 2 Paris
Option 3 Rome
Option 4 Madrid
Correct Option 2
Marks * 1
Sequence Order * 2
Difficulty easy`;
                  navigator.clipboard.writeText(textToCopy);
                  toast.success("Format copied to clipboard!");
                }}
                className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Format
              </button>
            </div>
     <pre className="whitespace-pre-wrap">
{`Question 1
Title * What is 2 + 2?
a=10;
b=5;
Options *
Option 1 2
Option 2 3
Option 3 4
Option 4 5
Correct Option 3
Marks * 1
Sequence Order * 1
Difficulty easy

Question 2
Title * What is capital of France?
Options *
Option 1 Berlin
Option 2 Paris
Option 3 Rome
Option 4 Madrid
Correct Option 2
Marks * 1
Sequence Order * 2
Difficulty easy`}
</pre>
          </div>

          {/* Input area */}
          <textarea
            rows={15}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full border px-4 py-2 rounded-md text-sm font-mono"
            placeholder="Paste your questions here using the format above..."
          />

          {/* Format instructions */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📝 Format Instructions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-700">Required Fields:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>Title *</code> - The question text (supports multiple lines)</li>
                  <li><code>Options *</code> - Header before options</li>
                  <li><code>Option 1</code> to <code>Option 4</code> - All four options</li>
                  <li><code>Correct Option</code> - Number (1-4)</li>
                  <li><code>Marks *</code> - Points for this question</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-700">Optional Fields:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>Sequence Order *</code> - Display order</li>
                  <li><code>Difficulty</code> - easy/medium/hard</li>
                </ul>
                <p className="mt-2 font-medium text-blue-700">Multi-line Support:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Title can span multiple lines after "Title *"</li>
                  <li>Options can also span multiple lines</li>
                  <li>Blank lines between questions are required</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={parseBulkInput}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Parse Questions
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
                  className={`mb-4 px-4 py-2 rounded text-white text-sm shadow ${q.statusMessage.startsWith("✅") ? "bg-green-500" : "bg-red-500"
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
    <textarea
      className="w-full px-4 py-2 border rounded-md"
      value={q.title}
      onChange={(e) => handleChange(index, "title", e.target.value)}
      rows="3"
      required
      disabled={q.submitted}
      placeholder="Enter your question text here..."
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700">
      Options *
    </label>
    {q.options.map((opt, idx) => (
      <div key={idx} className="flex items-start mb-2 gap-2">
        <input
          type="radio"
          name={`correctOption-${index}`}
          checked={q.correctOptionIndex === idx}
          onChange={() => handleCorrectOption(index, idx)}
          disabled={q.submitted}
          className="mt-2"
        />
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          value={opt}
          onChange={(e) => handleOptionChange(index, idx, e.target.value)}
          placeholder={`Option ${idx + 1}`}
          rows="2"
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
              className={`bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md shadow ${globalLoading || marksError || currentTotalMarks === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
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