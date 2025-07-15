import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../Controllers/userControllers"; // use correct path
import { addStudentsToGroup } from "../../../Controllers/groupController";

const AddStudentsToGroup = ({
  groupId,
  existingStudentIds = [],
  onClose,
  onSuccess,
}) => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchAllStudents = async () => {
    try {
      const response = await getAllUsers(); // full response
      const allUsers = response?.data?.users || []; // extract users safely

      const filteredStudents = allUsers
        .filter((user) => user.role === "candidate") // Only students/candidates
        .filter((stu) => !existingStudentIds.includes(stu._id)); // Not already assigned

      setStudents(filteredStudents);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAllStudents();
}, [existingStudentIds]);


  const handleSubmit = async () => {
    try {
      await addStudentsToGroup(groupId, selected);
      onSuccess(selected);
    } catch (err) {
      console.error("Error adding students to group", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 border">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Add Students to Group</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No students available to add.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 border p-3 rounded-md">
            {students.map((stu) => (
              <label key={stu._id} className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-md">
                <input
                  type="checkbox"
                  value={stu._id}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelected((prev) =>
                      checked ? [...prev, stu._id] : prev.filter((id) => id !== stu._id)
                    );
                  }}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm">
                  {stu.name}{" "}
                  <span className="text-xs text-gray-500">({stu.email})</span>
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border text-sm rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className={`px-4 py-2 text-sm rounded-md text-white ${
              selected.length > 0 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-300 cursor-not-allowed"
            }`}
          >
            Add Selected ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsToGroup;
