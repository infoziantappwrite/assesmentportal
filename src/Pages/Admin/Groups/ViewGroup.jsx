import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getGroupById,
  removeStudentsFromGroup,
  removeStudentFromGroup,
} from "../../../Controllers/groupController";
import {
  ArrowLeft,
  Users,
  School,
  BadgeCheck,
  CalendarDays,
  Hash,
  Info,
  Building2,
} from "lucide-react";
import dayjs from "dayjs";
import AddStudentsToGroup from "./AddStudentsToGroup";

const ViewGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await getGroupById(id);
        setGroup(res?.data?.group || null);
      } catch (err) {
        console.error("Failed to fetch group", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleRemoveStudent = async (studentId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to remove this student?");
      if (!confirmed) return;

      await removeStudentFromGroup(group._id, studentId);

      setGroup((prev) => ({
        ...prev,
        student_ids: prev.student_ids.filter((id) => id !== studentId),
        student_count: prev.student_count - 1,
      }));
    } catch (error) {
      console.error("Failed to remove student", error);
      alert("Something went wrong while removing the student.");
    }
  };

  const handleRemoveAllStudents = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to remove all students from this group?");
      if (!confirmed) return;

      await removeStudentsFromGroup(group._id, group.student_ids);

      setGroup((prev) => ({
        ...prev,
        student_ids: [],
        student_count: 0,
      }));
    } catch (error) {
      console.error("Failed to remove all students", error);
      alert("Something went wrong while removing students.");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (!group) return <div className="p-6 text-center text-red-500">Group not found</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-[1400px] mx-auto space-y-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-700 transition"
        >
          <ArrowLeft size={18} /> Back to Manage Groups
        </button>

        <div className="bg-white w-full rounded-xl shadow-md border border-blue-100 px-8 py-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-4xl font-extrabold text-indigo-800">{group.name}</h2>
              <span
                className={`mt-2 inline-block px-4 py-1 text-base font-medium rounded-full ${
                  group.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {group.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-green-500 text-white text-base rounded-lg font-medium hover:bg-green-600 transition shadow"
              >
                + Add Students
              </button>
              <button
                onClick={() => navigate(`/admin/groups/edit/${group._id}`)}
                className="px-5 py-2.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-base rounded-lg font-medium flex items-center gap-2 shadow"
              >
                <BadgeCheck size={18} /> Edit Group
              </button>
            </div>
          </div>

          <hr className="border-t border-blue-100" />

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base text-gray-700">
            <div className="space-y-3">
              <p className="flex items-center gap-3">
                <School className="text-blue-600" size={20} />
                <span className="font-semibold">College:</span> {group.college_id?.name || "N/A"}
              </p>
              <p className="flex items-center gap-3">
                <Building2 className="text-teal-600" size={20} />
                <span className="font-semibold">Department:</span> {group.department}
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays className="text-purple-600" size={20} />
                <span className="font-semibold">Batch Year:</span> {group.batch_year}
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays className="text-gray-600" size={20} />
                <span className="font-semibold">Created:</span>{" "}
                {dayjs(group.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>

            <div className="space-y-3">
              <p className="flex items-center gap-3">
                <BadgeCheck className="text-green-600" size={20} />
                <span className="font-semibold">Group Code:</span> {group.group_code}
              </p>
              <p className="flex items-center gap-3">
                <Users className="text-indigo-600" size={20} />
                <span className="font-semibold">Students:</span> {group.student_count}
              </p>
              <p className="flex items-center gap-3">
                <Hash className="text-pink-600" size={20} />
                <span className="font-semibold">Group ID:</span> {group._id}
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays className="text-gray-600" size={20} />
                <span className="font-semibold">Updated:</span>{" "}
                {dayjs(group.updatedAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
          </div>

          <hr className="border-t border-blue-100" />

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Info className="text-yellow-600" size={20} />
              Description
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-5 text-base text-gray-700">
              {group.description || "No description provided."}
            </div>
          </div>

          {/* Students */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="text-sky-600" size={20} />
              Assigned Students
            </h3>

            {group.student_ids.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={handleRemoveAllStudents}
                  className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1 rounded"
                >
                  Remove All Students
                </button>
              </div>
            )}

            <div className="bg-sky-50 border border-sky-100 rounded-lg p-5 max-h-72 overflow-y-auto">
              {group.student_ids.length === 0 ? (
                <p className="text-base text-gray-500 italic">No students assigned to this group.</p>
              ) : (
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-800">
                  {group.student_ids.map((stu, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="font-medium">{stu}</span>
                      <button
                        onClick={() => handleRemoveStudent(stu)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Add Students Modal */}
        {showAddModal && (
          <AddStudentsToGroup
            groupId={group._id}
            existingStudentIds={group.student_ids}
            onClose={() => setShowAddModal(false)}
            onSuccess={(newIds) => {
              setGroup((prev) => ({
                ...prev,
                student_ids: [...prev.student_ids, ...newIds],
                student_count: prev.student_count + newIds.length,
              }));
              setShowAddModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ViewGroup;
