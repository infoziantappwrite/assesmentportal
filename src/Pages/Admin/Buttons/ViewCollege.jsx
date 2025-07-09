import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft, School, Mail, Phone, Globe, Users, BadgeCheck,
  CalendarDays, Hash, MapPin, Clock4, Trash2, Pencil
} from "lucide-react";
import EditCollege from "./EditCollege";

const ViewCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const res = await axios.get(
          `https://assessment-platform-jua0.onrender.com/api/v1/colleges/${id}`,
          { withCredentials: true }
        );
        setCollege(res.data.data.college);
      } catch (err) {
        console.error("Failed to fetch college:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `https://assessment-platform-jua0.onrender.com/api/v1/colleges/${id}/students`,
          { withCredentials: true }
        );
        setStudents(res.data.data.students || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchCollegeDetails();
    fetchStudents();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://assessment-platform-jua0.onrender.com/api/v1/colleges/${id}`, {
        withCredentials: true,
      });
      alert("College deactivated successfully.");
      navigate("/admin/manage-colleges");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to deactivate college.");
    }
  };

  if (loading) return <div className="p-10 text-gray-600 text-lg font-medium tracking-wide">Loading...</div>;
  if (!college) return <div className="p-10 text-red-600 text-lg font-semibold">College not found</div>;

  const {
    name, code, address, contact, total_students,
    is_active, createdAt, updatedAt, _id
  } = college;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-slate-100 to-white p-8 font-sans text-gray-800">
  <div className="max-w-6xl mx-auto space-y-10">

    {/* Header */}
    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-all"
      >
        <ArrowLeft size={18} /> <span className="font-medium">Back</span>
      </button>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
          onClick={() => setShowEdit(true)}
        >
          <Pencil size={16} /> Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={16} /> Deactivate
        </button>
      </div>
    </div>

    {/* Info Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* College Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          <School size={22} />
          <h2 className="text-2xl font-semibold tracking-wide">College Info</h2>
        </div>
        <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
          <p><span className="font-semibold">Name:</span> {name}</p>
          <p><span className="font-semibold">Code:</span> {code}</p>
          <p>
            <span className="font-semibold">Status:</span>
            <span className={`ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {is_active ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-4 text-rose-500">
          <MapPin size={22} />
          <h2 className="text-2xl font-semibold tracking-wide">Address & Contact</h2>
        </div>
        <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
          <p>{`${address.street}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`}</p>
          <p><Mail size={14} className="inline mr-1 text-gray-500" /> {contact.email}</p>
          <p><Phone size={14} className="inline mr-1 text-gray-500" /> {contact.phone}</p>
          <p>
            <Globe size={14} className="inline mr-1 text-gray-500" />
            <a href={contact.website} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 transition">
              {contact.website}
            </a>
          </p>
        </div>
      </div>
    </div>

    {/* Statistics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl shadow border border-yellow-200 text-sm space-y-1">
        <Users className="text-yellow-600 mb-1" />
        <p><span className="font-semibold">Total Students:</span> {total_students}</p>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl shadow border border-purple-200 text-sm space-y-1">
        <CalendarDays className="text-purple-600 mb-1" />
        <p><span className="font-semibold">Created:</span> {new Date(createdAt).toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-xl shadow border border-orange-200 text-sm space-y-1">
        <Clock4 className="text-orange-600 mb-1" />
        <p><span className="font-semibold">Last Updated:</span> {new Date(updatedAt).toLocaleString()}</p>
      </div>
    </div>

    {/* Students List */}
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <h3 className="text-xl font-semibold tracking-wide mb-3 flex items-center gap-2 text-gray-800">
        <Users size={20} /> Assigned Students <span className="text-sm text-slate-500">({students.length})</span>
      </h3>
      {students.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No students assigned to this college yet.</p>
      ) : (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {students.map((stu) => (
            <li key={stu._id}>
              <span className="font-medium">{stu.name}</span> <span className="text-gray-500">({stu.email})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Delete Modal */}
  {showDeleteConfirm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Deactivation</h2>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to deactivate this college? It will be marked as inactive.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={handleDelete}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  )}

  {showEdit && (
    <EditCollege
      collegeId={id}
      onClose={() => setShowEdit(false)}
      onUpdated={() => window.location.reload()}
    />
  )}
</div>

  );
};

export default ViewCollege;
