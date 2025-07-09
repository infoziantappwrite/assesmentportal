import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroupById } from "../../../Controllers/groupController";
import { addStudentsToGroup } from "../../../Controllers/groupController"
import {
  ArrowLeft,
  Users,
  School,
  BadgeCheck,
  CalendarDays,
  Hash,
  Info,
  Building2,
} from "lucide-react"; // 👈 added Building2 instead of 🏢
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
        console.log(res);
        setGroup(res?.data?.group || null);
      } catch (err) {
        console.error("Failed to fetch group", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (!group)
    return (
      <div className="p-6 text-center text-red-500">Group not found</div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Back to Manage Groups
        </button>

        {/* Card */}
        <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-8 space-y-6">
          {/* Title and Status */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
  <div>
    <h2 className="text-3xl font-bold text-indigo-700">{group.name}</h2>
    <span
      className={`mt-2 inline-block px-4 py-1 text-sm font-semibold rounded-full ${
        group.is_active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {group.is_active ? "Active" : "Inactive"}
    </span>
  </div>

  {/* ✨ Edit Button */}
  <button
    onClick={() => navigate(`/admin/groups/edit/${group._id}`)}
    className="flex items-center gap-2 text-sm px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-medium transition"
  >
    <BadgeCheck size={16} className="text-indigo-600" />
    Edit Group
  </button>
  <div className="flex justify-between items-center mb-2">
  <h3 className="text-base font-semibold text-gray-800 flex items-center gap-1">
    <Users className="text-sky-600" size={18} /> Assigned Students
  </h3>
  <button
    onClick={() => setShowAddModal(true)}
    className="text-sm text-white bg-sky-500 hover:bg-sky-600 px-3 py-1 rounded-md shadow transition"
  >
    + Add Students
  </button>
</div>
</div>


          {/* Group Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <School className="text-blue-600" size={18} />
                <strong>College:</strong> {group.college_id?.name || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <Building2 className="text-teal-600" size={18} />
                <strong>Department:</strong> {group.department}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="text-purple-600" size={18} />
                <strong>Batch Year:</strong> {group.batch_year}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="text-gray-600" size={18} />
                <strong>Created:</strong>{" "}
                {dayjs(group.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <BadgeCheck className="text-green-600" size={18} />
                <strong>Group Code:</strong> {group.group_code}
              </p>
              <p className="flex items-center gap-2">
                <Users className="text-indigo-600" size={18} />
                <strong>Students:</strong> {group.student_count}
              </p>
              <p className="flex items-center gap-2">
                <Hash className="text-pink-600" size={18} />
                <strong>Group ID:</strong> {group._id}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="text-gray-600" size={18} />
                <strong>Updated:</strong>{" "}
                {dayjs(group.updatedAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <Info className="text-yellow-600" size={18} /> Description
            </h3>
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-sm text-gray-700">
              {group.description || "No description provided."}
            </div>
          </div>

          {/* Students */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <Users className="text-sky-600" size={18} /> Assigned Students
            </h3>
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 max-h-60 overflow-y-auto">
              {group.student_ids.length === 0 ? (
                <p className="text-gray-400 italic text-sm">
                  No students assigned
                </p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                  {group.student_ids.map((stu, idx) => (
                    <li key={idx}>
                       <span className="font-medium">{stu}</span>{" "}
                      {/* <span className="font-medium">{stu.name}</span>{" "}
                      <span className="text-gray-500">({stu.email})</span> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      {showAddModal && (
  <AddStudentsToGroup
    groupId={group._id}
    collegeId={group.college_id?._id}
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
