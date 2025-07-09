// src/pages/SuperAdmin/ManageColleges.jsx
import React, { useState, useEffect } from "react";
import Table from "../../Components/Table";
import CreateCollege from "./Buttons/CreateCollege";
import axios from "axios"
import ViewCollege from "./Buttons/ViewCollege";
import { useNavigate } from "react-router-dom"; // 👈 import
import { getAllColleges } from "../../Controllers/CollegeController";

const ManageColleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const navigate = useNavigate(); // 👈 init navigate

    useEffect(() => {
  const fetchColleges = async () => {
    try {
      const data = await getAllColleges();
      setColleges(data);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchColleges();
}, []);

    const columns = [
        { label: "S.No", accessor: "_id", render: (_, index) => index + 1 },
        { label: "College Name", accessor: "name" },
        { label: "Code", accessor: "code" },
       
        {
            label: "Email",
            accessor: "contact.email",
            render: (row) => row.contact?.email || "-",
        },
        { label: "Total Students", accessor: "total_students" },
        {
            label: "Status",
            accessor: "is_active",
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {row.is_active ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            label: "Actions",
            render: (row) => (
                <button
                    onClick={() => handleViewCollege(row._id)}
                    className="text-indigo-600 hover:underline text-sm font-medium"
                >
                    View
                </button>
            ),
        },
    ];

    const handleViewCollege = (id) => {
        navigate(`/admin/colleges/${id}`); // 👈 navigate to view page
    };



    return (
        <div className="relative min-h-screen px-6 py-8">

            {/* 📄 Card-like Content Box */}
            <div className="bg-white p-6 rounded-xl shadow-md relative">

                {/* 🧾 Title */}
                <h1 className="text-2xl font-bold mb-6">Manage Colleges</h1>

                {/* ➕ Button - positioned absolutely inside the box */}
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="absolute top-6 right-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
                >
                    + Create College
                </button>

                {/* 📊 Table */}
                {loading ? <p>Loading...</p> : <Table columns={columns} data={colleges} />}
            </div>

            {/* 📦 Modal */}
            {showCreateModal && (
                <CreateCollege onClose={() => setShowCreateModal(false)} />
            )}

            {selectedCollegeId && (
                <ViewCollege
                    id={selectedCollegeId}
                    onClose={() => setSelectedCollegeId(null)}
                />
            )}
        </div>

    );
};

export default ManageColleges;

