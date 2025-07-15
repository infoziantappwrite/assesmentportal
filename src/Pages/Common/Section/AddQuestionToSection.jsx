import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createQuestionInSection } from "../../../Controllers/QuestionController";
import { ArrowLeft, PlusCircle } from "lucide-react";

const AddQuestionToSection = () => {
  const { id: sectionID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    marks: 1,
    sequence_order: 1,
    difficulty: "easy",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const options = formData.options.map((text, idx) => ({
        option_id: `opt${idx + 1}`,
        text: text.trim(),
        is_correct: idx === formData.correctOptionIndex,
      }));

      const correct_answers = [options[formData.correctOptionIndex].option_id];

      const questionPayload = {
        type: "single_correct",
        content: {
          question_text: formData.title.trim(),
        },
        options,
        correct_answers,
        marks: formData.marks,
        sequence_order: formData.sequence_order,
        difficulty: formData.difficulty,
      };

      await createQuestionInSection(sectionID, questionPayload);

      setStatusMessage("✅ Question added successfully.");
      setFormData({
        title: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        marks: 1,
        sequence_order: formData.sequence_order + 1,
        difficulty: "easy",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      const msg =
        err.response?.data?.message || "❌ Failed to add question. Please try again.";
      setStatusMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white p-6 shadow rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Question to Section
        </h2>

        {statusMessage && (
          <div
            className={`mb-4 px-4 py-2 rounded text-white text-sm shadow ${
              statusMessage.startsWith("✅") ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Question Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Options *
            </label>
            {formData.options.map((opt, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={formData.correctOptionIndex === idx}
                  onChange={() =>
                    setFormData({ ...formData, correctOptionIndex: idx })
                  }
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
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
                value={formData.marks}
                onChange={(e) =>
                  setFormData({ ...formData, marks: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Sequence Order *
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md"
                value={formData.sequence_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sequence_order: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Difficulty
            </label>
            <select
              className="w-full px-4 py-2 border rounded-md"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md shadow disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionToSection;
