import React, { useEffect, useState } from "react";
import { createGroup } from "../../../Controllers/groupController";
import { getAllUsers } from "../../../Controllers/userControllers";
import { getAllColleges } from "../../../Controllers/CollegeController";
import { X } from "lucide-react";
import Loader from "../../../Components/Loader";

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
          getAllUsers(),
          getAllColleges(),
        ]);
        const candidates = (studentRes?.data?.users || []).filter(
          (user) => user.role === "candidate"
        );
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-5">
          🚀 Create New Group
        </h2>

        {loading && <Loader />}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter group name"
                className="mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Select College
              </label>
              <select
                name="collegeId"
                value={form.collegeId}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-1.5 border rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select College --</option>
                {colleges.map((college) => (
                  <option key={college._id} value={college._id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Eg: CSE"
                className="mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Batch Year
              </label>
              <input
                type="number"
                name="batchYear"
                value={form.batchYear}
                onChange={handleChange}
                placeholder="Eg: 2025"
                className="mt-1 w-full px-4 py-1.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

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
              className="mt-1 w-full px-4 py-1.5 border rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Assign Students
            </label>
            <div className="mt-1 h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
              {students.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  No students available
                </p>
              ) : (
                students.map((stu) => (
                  <label
                    key={stu._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.studentIds.includes(stu._id)}
                      onChange={() => handleStudentToggle(stu._id)}
                      className="accent-indigo-600"
                    />
                    <span>
                      {stu.name} ({stu.email})
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
