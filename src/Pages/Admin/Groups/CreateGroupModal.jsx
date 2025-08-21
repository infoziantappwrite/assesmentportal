import React, { useEffect, useState } from "react";
import { createGroup } from "../../../Controllers/groupController";
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

  const [colleges, setColleges] = useState([]);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({}); // ✅ validation errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeRes] = await Promise.all([getAllColleges()]);
        setColleges(collegeRes.colleges || []);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Group name is required";
    if (!form.collegeId) newErrors.collegeId = "College is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.batchYear) newErrors.batchYear = "Batch year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createGroup(form);
      setStatus("Group created successfully!");

      setTimeout(() => {
        setStatus("");
      }, 2000);

      setTimeout(() => {
        onClose();
        onCreated();
      }, 2000);
    } catch (err) {
      setStatus("Failed to create group.");
      setTimeout(() => {
        setStatus("");
      }, 2000);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-2 border border-gray-300 rounded-2xl">
        <div className="relative w-full min-w-4xl bg-white p-4 max-h-[85vh] overflow-y-auto ">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-bold text-blue-500 text-center mb-4">
            Create New Group
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Group Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  className={`mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* College */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Select College <span className="text-red-500">*</span>
                </label>
                <select
                  name="collegeId"
                  value={form.collegeId}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 ${
                    errors.collegeId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                >
                  <option value="">-- Select College --</option>
                  {colleges.map((college) => (
                    <option key={college._id} value={college._id}>
                      {college.name}
                    </option>
                  ))}
                </select>
                {errors.collegeId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.collegeId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Eg: CSE"
                  className={`mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 ${
                    errors.department
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.department && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Batch Year */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Batch Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="batchYear"
                  value={form.batchYear}
                  onChange={handleChange}
                  placeholder="Eg: 2025"
                  className={`mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 ${
                    errors.batchYear
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.batchYear && (
                  <p className="text-xs text-red-500 mt-1">{errors.batchYear}</p>
                )}
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description..."
                className="mt-1 w-full px-4 py-1.5 border border-gray-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          {status && (
            <div
              className={`text-sm text-center px-4 py-2 rounded-lg font-medium ${
                status.includes("success")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {status}
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
