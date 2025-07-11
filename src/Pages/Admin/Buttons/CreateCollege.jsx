import React, { useState } from "react";
import {
  X,
  School,
  MapPin,
  Phone,
  Globe,
  Mail,
} from "lucide-react";
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
  const [status, setStatus] = useState("");

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
      await createCollege(formData);
      setStatus("College created successfully!");
      setTimeout(() => {
        setStatus("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error creating college:", err);
      setStatus("Failed to create college.");
      setTimeout(() => setStatus(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-2 border border-gray-300 rounded-2xl shadow-md">
        <div className="relative w-full bg-white p-4 max-h-[85vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          >
            <X size={22} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
              <School size={22} />
            </div>
            <h2 className="text-xl font-bold text-blue-500">Create New College</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-700">
            {/* College Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "name", icon: <School size={18} />, label: "College Name" },
                { name: "code", icon: <School size={18} />, label: "College Code" },
              ].map(({ name, icon, label }) => (
                <div key={name} className="space-y-1 focus-within:text-indigo-600">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-indigo-500">{icon}</span>
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={label}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 focus-within:text-rose-500">
                <MapPin size={18} className="text-rose-500" />
                Address
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {["street", "city", "state", "pincode", "country"].map((field) => (
                  <div key={field} className="focus-within:text-rose-500 space-y-1">
                    <input
                      type="text"
                      name={`address.${field}`}
                      value={formData.address[field]}
                      onChange={handleChange}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 focus-within:text-emerald-500">
                <Phone size={18} className="text-emerald-500" />
                Contact Details
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "email", icon: <Mail size={16} />, placeholder: "Email", type: "email" },
                  { name: "phone", icon: <Phone size={16} />, placeholder: "Phone", type: "text" },
                ].map(({ name, icon, placeholder, type }) => (
                  <div key={name} className="space-y-1 focus-within:text-emerald-500">
                    <input
                      type={type}
                      name={`contact.${name}`}
                      value={formData.contact[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                ))}
                {/* Website (col-span-2) */}
                <div className="sm:col-span-2 focus-within:text-emerald-500">
                  <input
                    type="url"
                    name="contact.website"
                    value={formData.contact.website}
                    onChange={handleChange}
                    placeholder="Website"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Toggle Active */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-sm font-medium text-gray-700">Mark this college as Active</span>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  formData.is_active ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.is_active ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Status */}
            {status && (
              <div
                className={`text-sm text-center px-4 py-2 rounded-lg font-medium ${
                  status.includes("success")
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {status}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCollege;
