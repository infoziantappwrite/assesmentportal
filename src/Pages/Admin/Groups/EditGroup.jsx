import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X,
  PencilLine,
  FileText,
  Tag,
  School,
  CalendarDays,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getGroupById, updateGroupById } from "../../../Controllers/groupController";
import Loader from "../../../Components/Loader";

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
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // ✅ Status message

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
        setStatus({ type: "error", message: "Failed to load group data." });
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
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await updateGroupById(id, form);
      setStatus({ type: "success", message: "Group updated successfully." });
      setTimeout(() => setStatus({ type: "", message: "" }), 2300);
    } catch (error) {
      console.error("Failed to update group", error);
      setStatus({ type: "error", message: "Failed to update group." });
      setTimeout(() => setStatus({ type: "", message: "" }), 2300);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className=""><Loader /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative">
        {/* ❌ Cancel Button */}
        <button
          onClick={() => navigate(`/admin/groups/${id}`)}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-600 transition"
          title="Cancel and go back"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 📝 Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PencilLine className="w-6 h-6 text-blue-600" />
            Edit Group
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              ID: {id?.slice(-6)?.toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Update group information below.</p>
        </div>

        {/* ✅ Status Message */}
        {status.message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border
              ${status.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
              }`}
          >
            {status.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {status.message}
          </div>
        )}

        {/* 📋 Form */}
       <form onSubmit={handleSubmit} className="space-y-6 bg-white  p-">
  {/* Group Name & Code */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Group Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
      <div className="relative">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter group name"
          required
        />
        <PencilLine className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>
    </div>

    {/* Group Code */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Group Code</label>
      <div className="relative">
        <input
          type="text"
          name="group_code"
          value={form.group_code}
          onChange={handleChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Auto or manually filled"
          required
        />
        <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>
    </div>
  </div>

  {/* Department & Batch */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Department */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
      <div className="relative">
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. CSE"
          required
        />
        <School className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>
    </div>

    {/* Batch Year */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
      <div className="relative">
        <input
          type="number"
          name="batch_year"
          value={form.batch_year}
          onChange={handleChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 2025"
          required
        />
        <CalendarDays className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>
    </div>
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <div className="relative">
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        placeholder="Brief description..."
      />
      <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
    </div>
  </div>

<div className="flex justify-between items-center w-full mt-4">
  {/* Active Toggle (left aligned) */}
  <div className="flex items-center gap-2">
   
    <input
      type="checkbox"
      name="is_active"
      checked={form.is_active}
      onChange={handleChange}
      className="h-4 w-4 accent-blue-600"
    />
    <label htmlFor="is_active" className="text-sm text-gray-700">
      Active
    </label>
  </div>

  {/* Submit Button (right aligned) */}
  <button
    type="submit"
    disabled={submitting}
    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
  >
    {submitting ? "Updating..." : "Update Group"}
  </button>
</div>

</form>

      </div>
    </div>
  );
};

export default EditGroup;
