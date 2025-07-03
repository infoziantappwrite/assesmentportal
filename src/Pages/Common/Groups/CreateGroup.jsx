import React, { useState } from "react";
import { Upload, FileText, GraduationCap, PlusCircle } from "lucide-react";

const CreateGroup = () => {
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [college, setCollege] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            groupName,
            description,
            selectedFile,
            college,
        });
        // Add API call logic here
    };

    return (
        <div className="p-6 bg-blue-50 min-h-screen flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-blue-200 shadow rounded-lg p-6 w-full max-w-3xl space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                        <PlusCircle size={24} /> Create New Group
                    </h2>
                    <div className="flex gap-3">
                        {/* Cancel Button (Red Outline) */}
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="border border-red-600 text-red-600 px-6 py-2 rounded-md hover:bg-red-50 transition"
                        >
                            Cancel
                        </button>

                        {/* Confirm Button (Green Gradient) */}
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-md shadow hover:from-green-400 hover:to-green-600 transition"
                        >
                            Confirm
                        </button>
                    </div>
                </div>


                {/* Group Name */}
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Group Name</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        required
                        className="w-full border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the group"
                        rows={4}
                        className="w-full border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* College Dropdown */}
                <div>
                    <label className=" text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
                        <GraduationCap size={16} /> Select College
                    </label>
                    <select
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        required
                        className="w-full border border-blue-200 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="">Choose a college</option>
                        <option value="College A">College A</option>
                        <option value="College B">College B</option>
                        <option value="College C">College C</option>
                    </select>
                </div>

                {/* Excel Upload */}
                <div>
                    <label className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
                        <Upload size={16} /> Upload Students (Excel)
                    </label>
                    <input
                        type="file"
                        accept=".xls,.xlsx,.csv"
                        onChange={handleFileChange}
                        required
                        className="block w-full text-sm text-blue-800 
               border border-blue-200 rounded-md 
               file:mr-4 file:py-2 file:px-4 
               file:rounded-md file:border-0 
               file:text-sm file:bg-blue-100 
               file:text-blue-700 hover:file:bg-blue-200"
                    />
                    {selectedFile && (
                        <p className="mt-2 text-sm text-blue-700 flex items-center gap-2">
                            <FileText size={14} /> {selectedFile.name}
                        </p>
                    )}
                </div>


                {/* Submit Button */}

            </form>
        </div>
    );
};

export default CreateGroup;
