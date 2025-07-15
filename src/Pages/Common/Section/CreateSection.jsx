import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSection } from "../../../Controllers/SectionController";

const SECTION_TYPES = [
  { label: "Quiz", value: "quiz" },
  { label: "Survey", value: "survey" },
  { label: "Assignment", value: "assignment" },
  { label: "Code", value: "code" },
];

const CreateSection = () => {
  const { id } = useParams(); // assessment ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: SECTION_TYPES[0].value,
    sequence_order: 1,
    configuration: {
      duration_minutes: 30,
      question_count: 10,
      shuffle_questions: false,
      allow_skip: true,
      show_question_palette: true,
    },
    scoring: {
      total_marks: 100,
      marks_per_question: 10,
      negative_marking: false,
    },
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("configuration.") || name.includes("scoring.")) {
      const [parent, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [key]: type === "checkbox" ? checked : Number(value),
        },
      }));
    } else if (name === "sequence_order") {
      setFormData((prev) => ({
        ...prev,
        sequence_order: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.sequence_order) {
      setStatusMessage("❌ Please fill all required fields.");
      return;
    }

    const cleanData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      sequence_order: Number(formData.sequence_order),
      configuration: formData.configuration,
      scoring: formData.scoring,
      questions: [], // ✅ required by backend
      is_active: true,
    };

    console.log("Sending data to backend:", cleanData);


    try {
      await createSection(id, cleanData);
      setStatusMessage("✅ Section created successfully!");
      setTimeout(() => navigate(`/admin/assessments/${id}`), 1000);
    } catch (error) {
      console.error("Failed to create section:", error.response?.data || error);
      setStatusMessage("❌ Error creating section. Check your data.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Create New Section</h2>

      {statusMessage && (
        <div
          className={`mb-4 text-sm px-4 py-2 rounded shadow ${
            statusMessage.startsWith("✅") ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter section title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional instructions or overview"
          />
        </div>

        {/* Type & Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Section Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
            >
              {SECTION_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sequence Order *</label>
            <input
              name="sequence_order"
              type="number"
              value={formData.sequence_order}
              onChange={handleChange}
              required
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Duration (minutes)</label>
              <input
                name="configuration.duration_minutes"
                type="number"
                value={formData.configuration.duration_minutes}
                onChange={handleChange}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Question Count</label>
              <input
                name="configuration.question_count"
                type="number"
                value={formData.configuration.question_count}
                onChange={handleChange}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                name="configuration.shuffle_questions"
                type="checkbox"
                checked={formData.configuration.shuffle_questions}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              <label className="text-sm text-gray-700">Shuffle Questions</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                name="configuration.allow_skip"
                type="checkbox"
                checked={formData.configuration.allow_skip}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              <label className="text-sm text-gray-700">Allow Skip</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                name="configuration.show_question_palette"
                type="checkbox"
                checked={formData.configuration.show_question_palette}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              <label className="text-sm text-gray-700">Show Question Palette</label>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Scoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Total Marks</label>
              <input
                name="scoring.total_marks"
                type="number"
                value={formData.scoring.total_marks}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Marks per Question</label>
              <input
                name="scoring.marks_per_question"
                type="number"
                value={formData.scoring.marks_per_question}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                name="scoring.negative_marking"
                type="checkbox"
                checked={formData.scoring.negative_marking}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              <label className="text-sm text-gray-700">Negative Marking</label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-sm transition"
          >
            Create Section
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSection;
