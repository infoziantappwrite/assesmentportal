import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Loader from "../../../Components/Loader";
import {
  getCollegeById,
  updateCollege,
} from "../../../Controllers/CollegeController";

const EditCollege = () => {
  const { id: collegeId } = useParams();
  const navigate = useNavigate();

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
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const data = await getCollegeById(collegeId);
        setForm(data);
      } catch (err) {
        console.error("Failed to load college:", err);
        setStatus({ type: "error", message: "Failed to load college data." });
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
    setStatus({ type: "", message: "" });

    try {
      await updateCollege(collegeId, form);
      setStatus({ type: "success", message: "College updated successfully." });
      setTimeout(() => setStatus({ type: "", message: "" }), 2300);
    } catch (err) {
      console.error("Update error:", err);
      setStatus({ type: "error", message: "Failed to update college." });
      setTimeout(() => setStatus({ type: "", message: "" }), 2300);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-slate-100 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">Edit College Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-700">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">College Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange(e, "name")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">College Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange(e, "code")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update College"}
            </button>
          </div>

          {/* ✅ Status Message */}
          {status.message && (
            <div
              className={`mt-4 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border 
              ${status.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
                }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditCollege;
