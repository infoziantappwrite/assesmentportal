import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Search, X, Filter, Pencil } from "lucide-react";
import sampleStudents from "./sampleStudents";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", collegeName: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const role = localStorage.getItem("role");
  const collegeId = localStorage.getItem("collegeId");
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = sampleStudents;
    if (role === "college") {
      filtered = sampleStudents.filter((student) => student.collegeId === collegeId);
    }
    setStudents(filtered);
  }, [role, collegeId]);

  const handleFilterChange = (e) => {
    setSelectedCollege(e.target.value);
  };

  const filteredStudents = students
    .filter((s) => selectedCollege === "all" || s.collegeName === selectedCollege)
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.collegeName.toLowerCase().includes(search.toLowerCase())
    );

  const handleCreateOrEdit = () => {
    if (isEditing) {
      const updated = [...students];
      updated[editIndex] = { ...updated[editIndex], ...newStudent };
      setStudents(updated);
    } else {
      const newId = sampleStudents.length + 1;
      const student = {
        id: newId,
        ...newStudent,
        collegeId: `CID${newId}`,
      };
      sampleStudents.push(student);
      setStudents((prev) => [...prev, student]);
    }
    setShowModal(false);
    setNewStudent({ name: "", email: "", collegeName: "" });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (student, index) => {
    setNewStudent({ name: student.name, email: student.email, collegeName: student.collegeName });
    setEditIndex(index);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f9fcff] p-6 flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-blue-700 flex items-center gap-2">
            <Users size={24} /> Manage Students
          </h2>

          {role === "admin" && (
            <button
              onClick={() => {
                setIsEditing(false);
                setNewStudent({ name: "", email: "", collegeName: "" });
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-md shadow-sm"
            >
              <Plus size={16} /> Create Student
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or college"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {(role === "admin" || role === "trainer") && (
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <select
                value={selectedCollege}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">All Colleges</option>
                {[...new Set(sampleStudents.map((s) => s.collegeName))].map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm bg-white border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">College</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-blue-50">
                    <td className="px-5 py-3">{student.name}</td>
                    <td className="px-5 py-3">{student.email}</td>
                    <td className="px-5 py-3">{student.collegeName}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/college/students/${student.id}`)}
                          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md"
                        >
                          View
                        </button>
                        {role === "admin" && (
                          <button
                            onClick={() => handleEdit(student, index)}
                            className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md flex items-center gap-1"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-6 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {isEditing ? "Edit Student" : "Create Student"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={newStudent.collegeName}
                  onChange={(e) => setNewStudent({ ...newStudent, collegeName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select College</option>
                  {[...new Set(sampleStudents.map((s) => s.collegeName))].map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateOrEdit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  {isEditing ? "Update Student" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;
