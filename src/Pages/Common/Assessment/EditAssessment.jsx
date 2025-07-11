import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessmentById, updateAssessment } from "../../../Controllers/AssesmentController";
import Loader from "../../../Components/Loader"; // Optional

const EditAssessment = () => {
  const { id } = useParams(); // 👈 fetch :id from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAssessmentById(id);
        setFormData(res?.data?.assessment);
       // console.log(res)
      } catch  {
        setMessage("Error fetching assessment.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For nested fields like configuration.total_duration_minutes
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
      await updateAssessment(id, formData);
      setMessage(" Assessment updated successfully.");
      setTimeout(() => navigate(-1), 2000);
    } catch  {
      setMessage(" Failed to update assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !formData) return <p className="text-sm text-gray-500">Loading assessment...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-green-700">Edit Assessment</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow border border-gray-200">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Total Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">Duration (mins)</label>
          <input
            type="number"
            name="configuration.total_duration_minutes"
            value={formData.configuration.total_duration_minutes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 accent-green-600"
          />
          <label className="text-sm">Active</label>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            {submitting ? "Updating..." : "Update Assessment"}
          </button>
          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditAssessment;
