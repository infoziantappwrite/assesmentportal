import React, { useEffect, useState } from "react";
import { createGroup } from "../../../Controllers/groupController";
import { getAllUsers } from "../../../Controllers/userControllers";
import { getAllColleges } from "../../../Controllers/CollegeController";
import { X } from "lucide-react";

const CreateGroupModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    collegeId: "",
    department: "",
    batchYear: "",
    description: "",
    studentIds: [],
  });

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const [studentRes, collegeRes] = await Promise.all([
        getAllUsers(),         // no role param here
        getAllColleges(),
      ]);

      const allUsers = studentRes?.data?.users || [];

      // ✅ Filter candidates manually on frontend
      const candidates = allUsers.filter(user => user.role === "candidate");

      setStudents(candidates);
      setColleges(collegeRes || []);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  fetchData();
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter((sid) => sid !== id)
        : [...prev.studentIds, id],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createGroup(form);
      alert("Group created successfully");
      onCreated();
      onClose();
    } catch (err) {
      alert("Failed to create group");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🚀 Create New Group</h2>

        <div className="space-y-5">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter group name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* College Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select College</label>
            <select
              name="collegeId"
              value={form.collegeId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Select College --</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Eg: CSE"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Batch Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label>
              <input
                type="number"
                name="batchYear"
                placeholder="Eg: 2025"
                value={form.batchYear}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this group..."
              rows={3}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Student Multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Students</label>
            <div className="h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
              {students.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No students found</p>
              ) : (
                students.map((stu) => (
                  <label key={stu._id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.studentIds.includes(stu._id)}
                      onChange={() => handleStudentToggle(stu._id)}
                      className="accent-indigo-600"
                    />
                    <span className="text-gray-700">
                      {stu.name} ({stu.email})
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
