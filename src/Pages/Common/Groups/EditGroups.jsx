import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  GraduationCap,
  Pencil,
  XCircle,
} from "lucide-react";

const EditGroups = () => {
  const navigate = useNavigate();

  // Pre-filled mock group
  const mockGroup = {
    name: "Frontend Wizards",
    description: "Advanced React & UI/UX group.",
    collegeName: "College of Engineering, Alpha Campus",
    students: [
      { name: "Alice Kumar", email: "alice@example.com" },
      { name: "Bob Singh", email: "bob@example.com" },
    ],
  };

  const [groupName, setGroupName] = useState(mockGroup.name);
  const [description, setDescription] = useState(mockGroup.description);
  const [college, setCollege] = useState(mockGroup.collegeName);
  const [selectedFile, setSelectedFile] = useState(null);
  const [students, setStudents] = useState(mockGroup.students);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) return;
    setStudents([...students, newStudent]);
    setNewStudent({ name: "", email: "" });
  };

  const handleRemoveStudent = (index) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updating group:", {
      groupName,
      description,
      college,
      selectedFile,
      students,
    });
    // TODO: Add API update call
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen flex justify-center">
      <form
        onSubmit={handleUpdate}
        className="bg-white border border-blue-200 shadow rounded-lg p-6 w-full max-w-3xl space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Pencil size={22} /> Edit Group
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-red-500 text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-md shadow"
            >
              Update Group
            </button>
          </div>
        </div>

        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="w-full border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* College Dropdown */}
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
            <GraduationCap size={16} /> Select College
          </label>
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
            className="w-full border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Choose a college</option>
            <option value="College of Engineering, Alpha Campus">
              College of Engineering, Alpha Campus
            </option>
            <option value="Techno India University">Techno India University</option>
            <option value="Global IT Institute">Global IT Institute</option>
          </select>
        </div>

        {/* Upload Students File */}
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
            <Upload size={16} /> Replace Students File (optional)
          </label>
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-blue-800 border border-blue-200 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-blue-700 flex items-center gap-2">
              <FileText size={14} /> {selectedFile.name}
            </p>
          )}
        </div>

        {/* Student List */}
        <div>
          <h3 className="text-md font-semibold text-blue-700 mb-2">
            Students in Group
          </h3>
          {students.length === 0 ? (
            <p className="text-sm text-gray-500">
              No students in this group yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {students.map((student, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-blue-50 px-4 py-2 rounded border border-blue-100"
                >
                  <span>
                    <strong>{student.name}</strong> – {student.email}
                  </span>
                  <button
                    onClick={() => handleRemoveStudent(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    <XCircle size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Student */}
        <div>
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Add Student
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              className="border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Student Email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              className="border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="button"
            onClick={handleAddStudent}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGroups;
