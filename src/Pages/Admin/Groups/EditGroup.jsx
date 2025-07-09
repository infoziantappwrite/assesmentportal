import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroupById, updateGroupById } from "../../../Controllers/groupController";
import { X } from "lucide-react"; // optional icon

const EditGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    department: "",
    batch_year: "",
    group_code: "",
    description: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGroupById(id);
        const group = res?.data?.group;
        if (group) {
          setForm({
            name: group.name,
            department: group.department,
            batch_year: group.batch_year,
            group_code: group.group_code,
            description: group.description,
            is_active: group.is_active,
          });
        }
      } catch (error) {
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGroupById(id, form);
      alert("Group updated successfully!");
      navigate(`/admin/groups/${id}`);
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative border-l-4 border-indigo-500">

        {/* ❌ Cancel Button */}
        <button
          onClick={() => navigate(`/admin/groups/${id}`)}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-600 transition"
          title="Cancel and go back"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            ✏️ Edit Group
            <span className="text-sm text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              ID: {id.slice(-6).toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Update group information below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Department + Batch Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter department"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
              <input
                type="number"
                name="batch_year"
                value={form.batch_year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. 2025"
                required
              />
            </div>
          </div>

          {/* Group Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Code</label>
            <input
              type="text"
              name="group_code"
              value={form.group_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Auto or manually filled"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter group description"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
            >
              ✅ Update Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGroup;
