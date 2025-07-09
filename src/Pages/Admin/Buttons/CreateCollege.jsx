import React, { useState } from "react";
import { X, School, MapPin, Mail, Phone, Globe, CheckCircle } from "lucide-react";
import axios from "axios";
import { createCollege } from "../../../Controllers/CollegeController";

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
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [key]: value },
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
    await createCollege(formData); // ✅ use the controller method
    alert("College created successfully!");
    onClose();
  } catch (err) {
    console.error("Error creating college:", err);
    alert("Failed to create college.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-[95%] sm:w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-1 flex items-center gap-2">
          <School className="text-blue-500" /> Create New College
        </h2>
        <p className="text-sm text-gray-500 mb-6">Fill in the form below to add a new college.</p>

        <form className="space-y-6 text-sm text-gray-700" onSubmit={handleSubmit}>
          {/* College Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <School size={18} className="text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-800">College Info</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="College Name"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="College Code"
                className="border rounded-lg px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-rose-500" />
              <h3 className="text-base font-semibold text-gray-800">Address</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {["street", "city", "state", "pincode", "country"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={`address.${field}`}
                  value={formData.address[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 ${field === "country" ? "sm:col-span-2" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-emerald-500" />
              <h3 className="text-base font-semibold text-gray-800">Contact</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="text"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="url"
                name="contact.website"
                value={formData.contact.website}
                onChange={handleChange}
                placeholder="Website"
                className="border rounded-lg px-3 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">Mark this college as Active</span>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${formData.is_active ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.is_active ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
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
