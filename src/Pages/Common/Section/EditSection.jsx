import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSectionById, updateSection } from "../../../Controllers/SectionController";
import {
  ArrowLeft,
  List,
  Layers,
  Hash,
  Clock4,
  Shuffle,
  SkipForward,
  LayoutList,
  BarChart2,
  Settings2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const SECTION_TYPES = ["quiz", "survey", "assignment", "code"];

const EditSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await getSectionById(id);
        setSectionData(res?.data?.section || {});
      } catch {
        setError("Error fetching section.");
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSectionData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "sequence_order" ? parseInt(value) : value,
    }));
  };

  const handleNestedChange = (parent, name, value, isCheckbox = false) => {
    setSectionData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: isCheckbox ? value === "on" : isNaN(value) ? value : parseInt(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { assessment_id, questions, ...safeData } = sectionData;
      await updateSection(id, safeData);
      setMessage("Section updated successfully.");
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Failed to update section.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !sectionData) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Edit Section</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <List className="w-5 h-5" /> Basic Info
            </h2>

            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              name="title"
              value={sectionData.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              required
            />

            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={sectionData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* TYPE & ORDER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium">Type</label>
              <select
                name="type"
                value={sectionData.type || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              >
                <option value="" disabled>Select type</option>
                {SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Sequence Order</label>
              <input
                type="number"
                name="sequence_order"
                value={sectionData.sequence_order || 1}
                onChange={handleChange}
                min={1}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>

          {/* CONFIGURATION */}
          <div>
            <h2 className="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5" /> Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={sectionData.configuration?.duration_minutes || ""}
                  onChange={(e) => handleNestedChange("configuration", "duration_minutes", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Question Count</label>
                <input
                  type="number"
                  value={sectionData.configuration?.question_count || ""}
                  onChange={(e) => handleNestedChange("configuration", "question_count", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { label: "Shuffle Questions", name: "shuffle_questions", icon: <Shuffle className="w-4 h-4" /> },
                { label: "Allow Skip", name: "allow_skip", icon: <SkipForward className="w-4 h-4" /> },
                { label: "Show Question Palette", name: "show_question_palette", icon: <LayoutList className="w-4 h-4" /> },
              ].map(({ label, name, icon }) => (
                <label key={name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sectionData.configuration?.[name] || false}
                    onChange={(e) => handleNestedChange("configuration", name, e.target.checked, true)}
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">{icon} {label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SCORING */}
          <div>
            <h2 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5" /> Scoring
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Total Marks</label>
                <input
                  type="number"
                  value={sectionData.scoring?.total_marks || ""}
                  onChange={(e) => handleNestedChange("scoring", "total_marks", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Marks per Question</label>
                <input
                  type="number"
                  value={sectionData.scoring?.marks_per_question || ""}
                  onChange={(e) => handleNestedChange("scoring", "marks_per_question", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={sectionData.scoring?.negative_marking || false}
                onChange={(e) => handleNestedChange("scoring", "negative_marking", e.target.checked, true)}
              />
              Enable Negative Marking
            </label>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Go Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-green-600 text-white px-6 py-2 rounded-lg ${
                submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {message && (
            <div className="text-center text-sm mt-2 flex items-center justify-center gap-2">
              {message.includes("successfully") ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={message.includes("successfully") ? "text-green-600" : "text-red-500"}>
                {message}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditSection;
