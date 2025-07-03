import React, { useState } from "react";
import {
  Save,
  X,
  Building2,
  Hash,
  MapPin,
  Phone,
  User,
  GraduationCap,
  Landmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateCollege = () => {
  const [formData, setFormData] = useState({
    name: "",
    groupName: "",
    code: "",
    address: "",
    contact: "",
    representativeId: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`College Created:\n${JSON.stringify(formData, null, 2)}`);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      groupName: "",
      code: "",
      address: "",
      contact: "",
      representativeId: "",
    });
  };

  const fields = [
    {
      name: "name",
      label: "College Name",
      icon: <Building2 size={18} />,
      type: "text",
    },
    {
      name: "groupName",
      label: "Group Name",
      icon: <Landmark size={18} />,
      type: "text",
    },
    {
      name: "code",
      label: "College Code",
      icon: <Hash size={18} />,
      type: "text",
    },
    {
      name: "contact",
      label: "Contact Number",
      icon: <Phone size={18} />,
      type: "tel",
    },
    {
      name: "representativeId",
      label: "Representative ID",
      icon: <User size={18} />,
      type: "text",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b pb-4 border-gray-100">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl shadow-sm">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">Create New College</h1>
            <p className="text-sm text-gray-500">Fill in the details to register a college.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ name, label, icon, type }) => (
              <div key={name}>
                <label className="text-sm text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-600 p-1.5 rounded-md">
                    {icon}
                  </span>
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  required
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition shadow-sm"
                />
              </div>
            ))}
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-700 font-medium mb-1 flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-600 p-1.5 rounded-md">
                <MapPin size={18} />
              </span>
              Address
            </label>
            <textarea
              name="address"
              required
              placeholder="Enter full address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none transition shadow-sm"
            />
          </div>

          {/* Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition shadow-sm"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition shadow-md"
            >
              <Save size={18} />
              Create College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollege;
