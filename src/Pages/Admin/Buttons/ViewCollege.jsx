import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  School, Mail, Phone, Globe, Users,
  CalendarDays, MapPin, Clock4, Pencil, User2
} from "lucide-react";
import EditCollege from "./EditCollege";
import {
  getCollegeById,
  deleteCollege,
} from "../../../Controllers/CollegeController";
import { getAllUsers } from "../../../Controllers/userControllers";
import Loader from "../../../Components/Loader";
import CollegeStatusToggle from "../College/CollegeStatusToggle";

const ViewCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [representative, setRepresentative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const collegeData = await getCollegeById(id);
        setCollege(collegeData);
      } catch (err) {
        console.error("Failed to fetch college:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [id]);

  useEffect(() => {
    const fetchRepresentative = async () => {
      if (!college?.representative_id) return;
      try {
        const allUsersRes = await getAllUsers();
        const usersArray = allUsersRes?.data?.users || [];
        const repUser = usersArray.find(user => user._id === college.representative_id);
        setRepresentative(repUser || null);
      } catch (err) {
        console.error("Failed to fetch representative user:", err);
      }
    };

    fetchRepresentative();
  }, [college]);

  const handleDelete = async () => {
    try {
      await deleteCollege(id);
      alert("College deactivated successfully.");
      navigate("/admin/manage-colleges");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to deactivate college.");
    }
  };

  if (loading) return <Loader />;
  if (!college) return <div className="p-10 text-red-600 text-lg font-semibold">College not found</div>;

  const {
    name, code, address, contact, total_students,
    is_active, createdAt, updatedAt
  } = college;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-slate-100 to-white p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <User2 className="w-6 h-6 text-blue-600" />
              College Details
            </h2>
            <CollegeStatusToggle
              collegeId={college._id}
              isActiveInitial={is_active}
              fetchCollege={async () => {
                const res = await getCollegeById(id);
                setCollege(res);
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
              onClick={() => setShowEdit(true)}
            >
              <Pencil size={16} /> Edit
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 transition">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <School size={22} />
              <h2 className="text-2xl font-semibold tracking-wide">Basic Info</h2>
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

          <div className="bg-white rounded-2xl p-6">
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
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl text-sm space-y-1">
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


{!representative && (
  <div className="bg-white rounded-2xl p-6 text-gray-500 italic">
    No representative assigned for this college.
  </div>
)}
        {/* Assigned Representative */}
        {representative && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-xl font-semibold tracking-wide mb-3 flex items-center gap-2 text-gray-800">
              <Users size={20} /> Assigned Representative
            </h3>
            <p className="text-sm text-slate-700 space-y-1">
              <span className="block"><span className="font-medium">Name:</span> {representative.name}</span>
              <span className="block"><span className="font-medium">Email:</span> {representative.email}</span>
            </p>
          </div>
        )}
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
