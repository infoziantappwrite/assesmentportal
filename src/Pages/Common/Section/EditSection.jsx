import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSectionById, updateSection } from "../../../Controllers/SectionController"; // ✅ corrected import
import { ArrowLeft } from "lucide-react";

const EditSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await getSectionById(id);
        setSectionData(res?.data?.section); // ✅ match your getSectionById response
      } catch (err) {
        console.error("Error fetching section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSectionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSection(id, sectionData); // ✅ use correct function name
      alert("Section updated successfully!");
      navigate(`/admin/sections/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update section.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!sectionData) return <div className="p-6 text-red-600">Section not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Edit Section</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={sectionData.title}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={sectionData.description}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <input
            name="type"
            value={sectionData.type}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sequence Order</label>
          <input
            type="number"
            name="sequence_order"
            value={sectionData.sequence_order}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSection;
