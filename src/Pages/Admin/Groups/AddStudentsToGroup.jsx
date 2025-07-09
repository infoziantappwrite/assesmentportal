import React, { useEffect, useState } from "react";
import { getStudentsByCollegeId } from "../../../Controllers/CollegeController";
import { addStudentsToGroup } from "../../../Controllers/groupController";

const AddStudentsToGroup = ({ groupId, collegeId, existingStudentIds = [], onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudentsByCollegeId(collegeId);
        const filtered = res.filter((s) => !existingStudentIds.includes(s._id));
        setStudents(filtered);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };
    if (collegeId) fetchStudents();
  }, [collegeId, existingStudentIds]);

  const handleSubmit = async () => {
    try {
      await addStudentsToGroup(groupId, selected);
      onSuccess(selected); // inform parent to update view
    } catch (error) {
      console.error("Failed to add students", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6">
        <h2 className="text-lg font-bold mb-4 text-indigo-700">Add Students to Group</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-400">No students available for this group.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
            {students.map((stu) => (
              <label key={stu._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={stu._id}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelected((prev) =>
                      checked ? [...prev, stu._id] : prev.filter((id) => id !== stu._id)
                    );
                  }}
                />
                <span>{stu.name} <span className="text-gray-500 text-xs">({stu.email})</span></span>
              </label>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            Add Selected ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsToGroup;
