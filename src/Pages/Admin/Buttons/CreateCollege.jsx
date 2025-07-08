import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const CreateCollege = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
        },
        contact: {
            email: "",
            phone: "",
            website: "",
        },
        is_active: true,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested address and contact fields
        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value,
                },
            }));
        } else if (name.startsWith("contact.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    [key]: value,
                },
            }));
        } else if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                "https://assessment-platform-jua0.onrender.com/api/v1/colleges",
                formData,
                { withCredentials: true }
            );

            console.log("College created:", res.data);
            alert("College created successfully!");
            onClose();
        } catch (err) {
            console.error("Error creating college:", err.response?.data || err.message);
            alert("Failed to create college.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-[95%] sm:w-[600px] max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-blue-700">Create New College</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Please fill in the details below to add a new college.
                </p>

                <form className="space-y-6 text-sm text-gray-700" onSubmit={handleSubmit}>
                    {/* College Info */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">College Information</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="College Name"
                                className="border rounded-lg px-3 py-2"
                            />
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="College Code"
                                className="border rounded-lg px-3 py-2 uppercase"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2 border-t pt-4">Address</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {["street", "city", "state", "pincode", "country"].map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    name={`address.${field}`}
                                    value={formData.address[field]}
                                    onChange={handleChange}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className={`border rounded-lg px-3 py-2 ${field === "country" ? "col-span-2" : ""}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2 border-t pt-4">Contact</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="email"
                                name="contact.email"
                                value={formData.contact.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="border rounded-lg px-3 py-2"
                            />
                            <input
                                type="text"
                                name="contact.phone"
                                value={formData.contact.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="border rounded-lg px-3 py-2"
                            />
                            <input
                                type="url"
                                name="contact.website"
                                value={formData.contact.website}
                                onChange={handleChange}
                                placeholder="Website"
                                className="border rounded-lg px-3 py-2 col-span-2"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="border-t pt-4">
                        <label className="inline-flex items-center gap-2">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-700 font-medium">Mark this college as Active</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))
                                    }
                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${formData.is_active ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.is_active ? "translate-x-6" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>

                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCollege;
