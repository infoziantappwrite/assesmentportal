import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft, School, Mail, Phone, Globe, Users, BadgeCheck,
    CalendarDays, Hash, MapPin, Clock4, Trash2, Pencil
} from "lucide-react";
import EditCollege from "./EditCollege"; // adjust path

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
            navigate("/superadmin/manage-colleges");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to deactivate college.");
        }
    };

    if (loading) return <div className="p-10 text-gray-600">Loading...</div>;
    if (!college) return <div className="p-10 text-red-600">College not found</div>;

    const {
        name, code, address, contact, total_students,
        is_active, createdAt, updatedAt, _id
    } = college;

    return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow flex items-center gap-2 text-sm"
                            onClick={() => setShowEdit(true)}
                        >
                            <Pencil size={16} /> Edit
                        </button>

                        <button
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow flex items-center gap-2 text-sm"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 size={16} /> Deactivate
                        </button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* College Info */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <School className="text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-800">College Info</h2>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p><strong>ID:</strong> {_id}</p>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Code:</strong> {code}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {is_active ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Address + Contact */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-rose-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Address & Contact</h2>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p>{`${address.street}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`}</p>
                            <p><Mail className="inline mr-1" size={14} /> {contact.email}</p>
                            <p><Phone className="inline mr-1" size={14} /> {contact.phone}</p>
                            <p>
                                <Globe className="inline mr-1" size={14} />
                                <a href={contact.website} target="_blank" className="text-blue-600 underline">{contact.website}</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700">
                        <Users className="text-yellow-500 mb-1" />
                        <strong>Total Students:</strong> {total_students}
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700">
                        <CalendarDays className="text-purple-500 mb-1" />
                        <strong>Created:</strong> {new Date(createdAt).toLocaleString()}
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700">
                        <Clock4 className="text-orange-500 mb-1" />
                        <strong>Last Updated:</strong> {new Date(updatedAt).toLocaleString()}
                    </div>
                </div>

                {/* Students List */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users size={20} /> Assigned Students ({students.length})
                    </h3>
                    {students.length === 0 ? (
                        <p className="text-sm text-gray-500">No students assigned to this college yet.</p>
                    ) : (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {students.map((stu) => (
                                <li key={stu._id}>{stu.name} ({stu.email})</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center">
                        <h2 className="text-lg font-semibold text-red-600 mb-4">Confirm Deactivation</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            Are you sure you want to deactivate this college? This will mark the college as inactive.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
