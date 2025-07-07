import React, { useState } from "react";
import {
  Edit3,
  Save,
  X,
  MapPin,
  Building2,
  Calendar,
  GraduationCap,
  Users,
  Eye,
} from "lucide-react";

const CollegeProfile = () => {
  const college = {
    name: "Harvard University",
    city: "Cambridge",
    state: "MA",
    established: 1636,
    type: "Private",
    description:
      "One of the oldest and most prestigious universities in the United States, known for excellence in education, research, and innovation.",
    students: "23,000+",
    ranking: "#1 University",
  };

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ ...college });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Save functionality not implemented yet.");
    setIsEdit(false);
  };

  const handleCancel = () => {
    setFormData({ ...college });
    setIsEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-6 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm mb-8 px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">College Profile</h1>
              <p className="text-sm text-gray-500">Manage institution details</p>
            </div>
          </div>

          <div>
            {!isEdit ? (
              <button
                onClick={() => setIsEdit(true)}
                className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* College Details */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6 border-b border-gray-200 pb-2">
              Institution Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    College Name
                  </label>
                  {isEdit ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                    />
                  ) : (
                    <p className="text-base font-medium bg-gray-50 px-3 py-2 rounded-md">
                      {formData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Established
                  </label>
                  {isEdit ? (
                    <input
                      name="established"
                      value={formData.established}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="number"
                    />
                  ) : (
                    <p className="text-base font-medium bg-gray-50 px-3 py-2 rounded-md">
                      {formData.established}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    City
                  </label>
                  {isEdit ? (
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                    />
                  ) : (
                    <p className="text-base font-medium bg-gray-50 px-3 py-2 rounded-md">
                      {formData.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    State
                  </label>
                  {isEdit ? (
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                    />
                  ) : (
                    <p className="text-base font-medium bg-gray-50 px-3 py-2 rounded-md">
                      {formData.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    Type
                  </label>
                  {isEdit ? (
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option>Private</option>
                      <option>Public</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50 px-3 py-2 rounded-md inline-block">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          formData.type === "Private"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {formData.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Description
                </label>
                {isEdit ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                    placeholder="Enter college description..."
                  />
                ) : (
                  <p className="bg-gray-50 px-3 py-3 rounded-md leading-relaxed text-gray-700">
                    {formData.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Quick Stats & Actions */}
          <aside className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-5 border-b border-gray-200 pb-2">
                Quick Stats
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <Users className="w-5 h-5 text-indigo-600" />,
                    label: "Students",
                    value: college.students,
                    bgColor: "bg-indigo-50",
                    textColor: "text-indigo-600",
                  },
                  {
                    icon: <GraduationCap className="w-5 h-5 text-green-600" />,
                    label: "Ranking",
                    value: college.ranking,
                    bgColor: "bg-green-50",
                    textColor: "text-green-600",
                  },
                  {
                    icon: <Calendar className="w-5 h-5 text-purple-600" />,
                    label: "Age",
                    value: `${2024 - college.established} years`,
                    bgColor: "bg-purple-50",
                    textColor: "text-purple-600",
                  },
                ].map(({ icon, label, value, bgColor, textColor }) => (
                  <div
                    key={label}
                    className={`${bgColor} flex items-center justify-between rounded-md p-3`}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      {icon}
                      {label}
                    </div>
                    <div className={`font-semibold ${textColor}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-5 border-b border-gray-200 pb-2">
                Actions
              </h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => alert("Navigate to view groups/colleges")}
                  className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md text-sm font-semibold transition"
                >
                  <Eye className="w-5 h-5" />
                  View Groups/Colleges
                </button>
                <button
                  onClick={() => alert("Generate report functionality")}
                  className="w-full flex items-center justify-center gap-3 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-3 rounded-md text-sm font-semibold transition"
                >
                  <Building2 className="w-5 h-5" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-5 border-b border-gray-200 pb-2">
                Location
              </h3>
              <div className="bg-gray-100 rounded-md h-32 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    {formData.city}, {formData.state}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfile;
