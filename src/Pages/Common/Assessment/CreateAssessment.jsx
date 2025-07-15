import React, { useState } from "react";
import { createAssesment } from "../../../Controllers/AssesmentController";
import { ClipboardList, Settings, BarChart2, SlidersHorizontal } from "lucide-react"
const CreateAssessment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    configuration: {
      total_duration_minutes: 60,
      grace_period_minutes: 0,
      shuffle_sections: false,
      allow_section_navigation: true,
      show_results_immediately: false,
      allow_retake: false,
      max_attempts: 1,
    },
    scoring: {
      total_marks: 100,
      passing_marks: 40,
      negative_marking: false,
      negative_marks_per_wrong: 0,
    },
    difficulty_level: "mixed",
    is_active: true,
    is_template: false,
    is_shareable: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("configuration.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          [key]: type === "checkbox" ? checked : Number(value),
        },
      }));
    } else if (name.startsWith("scoring.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        scoring: {
          ...prev.scoring,
          [key]: type === "checkbox" ? checked : Number(value),
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
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
    setLoading(true);
    setMessage("");
    try {
      await createAssesment(formData);
      setMessage("Assessment created successfully!");
      setTimeout(() => {
        setMessage('')
      }, 3000);
      //console.log(result);
    } catch (err) {
      setMessage("Failed to create assessment.");
      setTimeout(() => {
        setMessage('')
      }, 3000);
      console.error(err.data);
    }
    setLoading(false);
  };

  return (

    <div className="p-6">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Create New Assessment</h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC INFO */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Basic Info
            </h2>

            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              required
            />

            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* CONFIGURATION */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center gap-2">
              <Settings className="w-5 h-5" /> Configuration
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Total Duration (mins)</label>
                <input
                  type="number"
                  name="configuration.total_duration_minutes"
                  value={formData.configuration.total_duration_minutes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium">Grace Period (mins)</label>
                <input
                  type="number"
                  name="configuration.grace_period_minutes"
                  value={formData.configuration.grace_period_minutes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium">Max Attempts</label>
                <input
                  type="number"
                  name="configuration.max_attempts"
                  value={formData.configuration.max_attempts}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { label: "Shuffle Sections", name: "shuffle_sections" },
                { label: "Allow Section Navigation", name: "allow_section_navigation" },
                { label: "Show Results Immediately", name: "show_results_immediately" },
                { label: "Allow Retake", name: "allow_retake" },
              ].map(({ label, name }) => (
                <label key={name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`configuration.${name}`}
                    checked={formData.configuration[name]}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* SCORING + SETTINGS */}
          <div className="grid grid-cols-2 gap-6">
            {/* SCORING */}
            <div className="border-r border-gray-300 p-4">
              <h2 className="text-xl font-semibold mb-4 text-orange-600 flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> Scoring
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-medium mb-1">Total Marks</label>
                  <input
                    type="number"
                    name="scoring.total_marks"
                    value={formData.scoring.total_marks}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium">Passing Marks</label>
                  <input
                    type="number"
                    name="scoring.passing_marks"
                    value={formData.scoring.passing_marks}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  name="scoring.negative_marking"
                  checked={formData.scoring.negative_marking}
                  onChange={handleChange}
                />
                Enable Negative Marking
              </label>

              {formData.scoring.negative_marking && (
                <div className="mt-2">
                  <label className="block font-medium">Negative Marks per Wrong</label>
                  <input
                    type="number"
                    name="scoring.negative_marks_per_wrong"
                    value={formData.scoring.negative_marks_per_wrong}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-rose-600 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" /> Assessment Settings
              </h2>

              <label className="block font-medium mb-1">Difficulty Level</label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>

              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Is Active", name: "is_active" },
                  { label: "Is Template", name: "is_template" },
                  { label: "Is Shareable", name: "is_shareable" },
                ].map(({ label, name }) => (
                  <label key={name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>

            </div>
          </div>

          {/* SUBMIT BUTTON */}
         {/* ACTION BUTTONS */}
<div className="flex justify-between items-center mt-8 flex-wrap">
  {/* Go Back (Left) */}
  <button
    type="button"
    onClick={() => window.history.back()}
    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
  >
    ← Go Back
  </button>

  {/* Clear + Submit (Right) */}
  <div className="flex gap-4">
    {/* Clear Button */}
    <button
      type="button"
      onClick={() =>
        setFormData({
          title: "",
          description: "",
          configuration: {
            total_duration_minutes: 60,
            grace_period_minutes: 0,
            shuffle_sections: false,
            allow_section_navigation: true,
            show_results_immediately: false,
            allow_retake: false,
            max_attempts: 1,
          },
          scoring: {
            total_marks: 100,
            passing_marks: 40,
            negative_marking: false,
            negative_marks_per_wrong: 0,
          },
          difficulty_level: "mixed",
          is_active: true,
          is_template: false,
          is_shareable: false,
        })
      }
      className="bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
    >
      Clear
    </button>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
    >
      {loading ? "Creating..." : "Create Assessment"}
    </button>
  </div>
</div>

{/* Feedback Message */}
{message && (
  <p
    className={`mt-4 text-sm text-center ${message.toLowerCase().includes("successfully")
      ? "text-green-600"
      : "text-red-600"
      }`}
  >
    {message}
  </p>
)}

        </form>
      </div>
    </div>

  );
};

export default CreateAssessment;
