import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessmentById, updateAssessment } from "../../../Controllers/AssesmentController";
import Loader from "../../../Components/Loader";
import {
  ClipboardList,
  Settings,
  BarChart2,
  SlidersHorizontal
} from "lucide-react";
import { toast } from "react-toastify";

const EditAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAssessmentById(id);
        const assessment = res?.data?.assessment || {};

        // Ensure nested objects exist to avoid errors in inputs
        setFormData({
          ...assessment,
          configuration: assessment.configuration || {},
          scoring: assessment.scoring || {},
        });
      } catch {
        setMessage("Error fetching assessment.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const sanitizeFormData = (data) => {
  // Deep clone the object so we don't mutate state directly
  const cleaned = JSON.parse(JSON.stringify(data));

  // Convert configuration numeric fields
  if (cleaned.configuration) {
    cleaned.configuration.total_duration_minutes = cleaned.configuration.total_duration_minutes
      ? Number(cleaned.configuration.total_duration_minutes)
      : null;

    cleaned.configuration.grace_period_minutes = cleaned.configuration.grace_period_minutes
      ? Number(cleaned.configuration.grace_period_minutes)
      : null;

    cleaned.configuration.max_attempts = cleaned.configuration.max_attempts
      ? Number(cleaned.configuration.max_attempts)
      : null;

    // Booleans are fine as you handle them in the checkbox change
  }

  // Convert scoring numeric fields
  if (cleaned.scoring) {
    cleaned.scoring.total_marks = cleaned.scoring.total_marks
      ? Number(cleaned.scoring.total_marks)
      : null;

    cleaned.scoring.passing_marks = cleaned.scoring.passing_marks
      ? Number(cleaned.scoring.passing_marks)
      : null;

    cleaned.scoring.negative_marking = !!cleaned.scoring.negative_marking;

    cleaned.scoring.negative_marks_per_wrong = cleaned.scoring.negative_marks_per_wrong
      ? Number(cleaned.scoring.negative_marks_per_wrong)
      : null;
  }

  // Convert top-level booleans if needed
  cleaned.is_active = !!cleaned.is_active;
  cleaned.is_template = !!cleaned.is_template;
  cleaned.is_shareable = !!cleaned.is_shareable;

  return cleaned;
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    // Map sections array to array of strings (IDs)
    const cleanSections = Array.isArray(formData.sections)
      ? formData.sections
          .map((section) => {
            // if section is string (already ID), keep it
            if (typeof section === "string") return section;
            // otherwise, get the id field
            return section.id || "";
          })
          .filter((id) => id !== "") // remove empty strings
      : [];

    // Ensure all configuration numbers are actually numbers
    const cleanConfig = {
      ...formData.configuration,
      total_duration_minutes: Number(formData.configuration?.total_duration_minutes || 0),
      grace_period_minutes: Number(formData.configuration?.grace_period_minutes || 0),
      max_attempts: Number(formData.configuration?.max_attempts || 1),
    };

    // Ensure all scoring numbers are actually numbers
    const cleanScoring = {
      ...formData.scoring,
      total_marks: Number(formData.scoring?.total_marks || 0),
      passing_marks: Number(formData.scoring?.passing_marks || 0),
      negative_marks_per_wrong: Number(formData.scoring?.negative_marks_per_wrong ?? 0),
    };

    const dataToSend = {
      ...formData,
      sections: cleanSections,
      configuration: cleanConfig,
      scoring: cleanScoring,
    };

    console.log("Data sent to backend:", JSON.stringify(dataToSend, null, 2));

    await updateAssessment(id, dataToSend);

    toast.success("✅ Assessment updated successfully!", { autoClose: 2000 });
    setTimeout(() => navigate(-1), 2000);
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Backend response error data:", error.response.data);
     toast.error(`❌ Failed to update: ${error.response.data.message || "Server error"}`, {
        autoClose: 3000,
      });
    } else {
      console.error("Update error:", error);
      toast.error("❌ Failed to update assessment.", {
        autoClose: 3000,
      });
    }
  } finally {
    setSubmitting(false);
  }
};



  if (loading || !formData) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">Edit Assessment</h1>

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
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              required
            />

            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
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
                  value={formData.configuration.total_duration_minutes || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium">Grace Period (mins)</label>
                <input
                  type="number"
                  name="configuration.grace_period_minutes"
                  value={formData.configuration.grace_period_minutes || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium">Max Attempts</label>
                <input
                  type="number"
                  name="configuration.max_attempts"
                  value={formData.configuration.max_attempts || ""}
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
                    checked={!!formData.configuration[name]}
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
            <div className="border-r border-gray-300 pr-4">
              <h2 className="text-xl font-semibold mb-4 text-orange-600 flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> Scoring
              </h2>

              <label className="block mb-1 font-medium">Total Marks</label>
              <input
                type="number"
                name="scoring.total_marks"
                value={formData.scoring.total_marks || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg mb-3"
              />

              <label className="block mb-1 font-medium">Passing Marks</label>
              <input
                type="number"
                name="scoring.passing_marks"
                value={formData.scoring.passing_marks || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg mb-3"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="scoring.negative_marking"
                  checked={!!formData.scoring.negative_marking}
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
                    value={formData.scoring.negative_marks_per_wrong || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-rose-600 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" /> Assessment Settings
              </h2>

              <label className="block font-medium mb-1">Difficulty Level</label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level || "easy"}
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
                      checked={!!formData[name]}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Go Back
            </button>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                {submitting ? "Updating..." : "Update Assessment"}
              </button>
            </div>
          </div>

          {message && (
            <p className={`text-center text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditAssessment;
