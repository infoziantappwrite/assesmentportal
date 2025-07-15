import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getGroupById,
  removeStudentsFromGroup,
  removeStudentFromGroup,
  updateGroupById,       // You will need to add this in your groupController if not present
} from "../../../Controllers/groupController";
import {
  Users,
  User,
  School,
  BadgeCheck,
  CalendarDays,
  Hash,
  Info,
  Building2,
  Pencil,
  ArrowLeft,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import dayjs from "dayjs";
import AddStudentsToGroup from "./AddStudentsToGroup";
import Loader from "../../../Components/Loader";

const GroupStatusToggle = ({ groupId, isActiveInitial, onStatusChange }) => {
  const [status, setStatus] = useState(isActiveInitial);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await updateGroupById(groupId, { is_active: !status });
      setStatus(!status);
      if (onStatusChange) onStatusChange(!status);
    } catch (error) {
      alert("Failed to update group status.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4 px-2">
      <span className="text-sm font-medium text-gray-700">Group Status</span>
      <button
        onClick={toggleStatus}
        disabled={loading}
        aria-label="Toggle group status"
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
          status ? 'bg-green-500' : 'bg-gray-300'
        } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            status ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
};


const ViewGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchGroup = async () => {
    setLoading(true);
    try {
      const res = await getGroupById(id);
      setGroup(res?.data?.group || null);
    } catch (err) {
      console.error("Failed to fetch group", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;
    try {
      await removeStudentFromGroup(group._id, studentId);
      setGroup((prev) => ({
        ...prev,
        student_ids: prev.student_ids.filter((s) => s._id !== studentId),
        student_count: prev.student_count - 1,
      }));
    } catch (error) {
      console.error("Failed to remove student", error);
      alert("Something went wrong while removing the student.");
    }
  };

  const handleRemoveAllStudents = async () => {
    if (!window.confirm("Are you sure you want to remove all students from this group?")) return;
    try {
      await removeStudentsFromGroup(
        group._id,
        group.student_ids.map((s) => s._id)
      );
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

  if (loading) return <Loader />;
  if (!group)
    return <div className="p-6 text-center text-red-500">Group not found</div>;

  return (
    <div className="p-6">
      {/* Title + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* Title + Status Toggle in one row */}
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            Group Details
          </h2>
          <GroupStatusToggle
            groupId={group._id}
            isActiveInitial={group.is_active}
            onStatusChange={fetchGroup}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={() => navigate(`/admin/groups/edit/${group._id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
          >
            <Pencil size={16} />
            Edit Group
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-green-600 text-white hover:bg-green-700 text-sm"
          >
            + Add Students
          </button>
        </div>
      </div>


      {/* Group Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <School size={18} className="text-blue-500" />
              <span className="font-semibold">College:</span> {group.college_id?.name || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <Building2 size={18} className="text-teal-600" />
              <span className="font-semibold">Department:</span> {group.department}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-purple-600" />
              <span className="font-semibold">Batch Year:</span> {group.batch_year}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-gray-500" />
              <span className="font-semibold">Created:</span>{" "}
              {dayjs(group.createdAt).format("DD MMM YYYY, hh:mm A")}
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <BadgeCheck size={18} className="text-green-600" />
              <span className="font-semibold">Group Code:</span> {group.group_code}
            </p>
            <p className="flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              <span className="font-semibold">Students:</span> {group.student_count}
            </p>
            <p className="flex items-center gap-2">
              <Hash size={18} className="text-pink-600" />
              <span className="font-semibold">Group ID:</span> {group._id}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-gray-500" />
              <span className="font-semibold">Updated:</span>{" "}
              {dayjs(group.updatedAt).format("DD MMM YYYY, hh:mm A")}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-md font-semibold flex items-center gap-2 mb-2 text-gray-800">
            <Info size={18} className="text-yellow-600" /> Description
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-gray-700">
            {group.description || "No description provided."}
          </div>
        </div>

        {/* Students */}
        <div>
          <h3 className="text-md font-semibold flex items-center gap-2 mb-3 text-gray-800">
            <Users size={18} className="text-sky-600" />
            Assigned Students
          </h3>

          {group.student_ids.length > 0 && (
            <button
              onClick={handleRemoveAllStudents}
              className="mb-3 text-red-600 hover:text-red-800 text-sm font-medium border border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1 rounded"
            >
              Remove All Students
            </button>
          )}

          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 max-h-64 overflow-y-auto">
            {group.student_ids.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No students assigned to this group.
              </p>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                {group.student_ids.map((stu, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="font-medium">
                      {stu.name} ({stu.email})
                    </span>
                    <button
                      onClick={() => handleRemoveStudent(stu._id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
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
  );
};

export default ViewGroup;
