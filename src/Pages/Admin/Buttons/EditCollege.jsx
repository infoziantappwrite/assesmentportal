import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const EditCollege = ({ collegeId, onClose, onUpdated }) => {
  const [form, setForm] = useState({
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
const fetchCollege = async () => {
  try {
    const res = await axios.get(
      `https://assessment-platform-jua0.onrender.com/api/v1/colleges/${collegeId}`,
      { withCredentials: true }
    );
    console.log("College API Response:", res.data); // 🔍 Check the structure
    setForm(res.data.data.college);
  } catch (err) {
    console.error("Failed to load college:", err);
  } finally {
    setLoading(false);
  }
};        
    fetchCollege();
  }, [collegeId]);

  const handleChange = (e, path) => {
    const value = e.target.value;
    if (path.includes(".")) {
      const [section, key] = path.split(".");
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [path]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `https://assessment-platform-jua0.onrender.com/api/v1/colleges/${collegeId}`,
        form,
        { withCredentials: true }
      );
      alert("College updated successfully.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update college.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-white">
        Loading college details...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          Edit College Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-700">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">College Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange(e, "name")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">College Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange(e, "code")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["street", "city", "state", "pincode", "country"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize font-medium">{field}</label>
                  <input
                    type="text"
                    value={form.address[field]}
                    onChange={(e) => handleChange(e, `address.${field}`)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["email", "phone", "website"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize font-medium">{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={form.contact[field]}
                    onChange={(e) => handleChange(e, `contact.${field}`)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Update College"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollege;
