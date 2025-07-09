import React, { useEffect, useState } from "react";
import { Eye, PlusCircle, Trash2 } from "lucide-react";
import { getAllGroups, deleteGroupById } from "../../../Controllers/groupController";
import CreateGroupModal from "./CreateGroupModal";
import Table from "../../../Components/Table"; // ✅ adjust path if needed
import { useNavigate } from "react-router-dom";



const ManageGroup = () => {
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate()

    const fetchGroups = async () => {
        try {
            const res = await getAllGroups();
            setGroups(res?.data?.groups || []);
        } catch (err) {
            console.error("Failed to fetch groups:", err);
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this group?");
        if (!confirm) return;

        try {
            await deleteGroupById(id);
            alert("Group deleted successfully!");
            fetchGroups(); // refresh list
        } catch (error) {
            console.error("Failed to delete group:", error);
            alert("Failed to delete group");
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const columns = [
        { label: "Group Name", accessor: "name" },
        { label: "Department", accessor: "department" },
        { label: "Batch Year", accessor: "batch_year" },
        {
            label: "Students",
            render: (row) => <span>{row.student_count || 0}</span>,
        },
        {
            label: "Actions",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <button
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                        onClick={() => navigate(`/admin/groups/${row._id}`)}
                    >
                        <Eye size={16} /> View
                    </button>
                    <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                        onClick={() => handleDelete(row._id)}
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            ),
        }

    ];

    return (
        <div className="min-h-screen p-6 bg-gradient-to-tr from-slate-100 via-white to-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Groups</h1>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <PlusCircle size={18} /> Create Group
                    </button>
                </div>

                {/* Reusable Table */}
                <Table columns={columns} data={groups} noDataText="No groups found." />

                {showCreateModal && (
                    <CreateGroupModal
                        onClose={() => setShowCreateModal(false)}
                        onCreated={fetchGroups}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageGroup;
