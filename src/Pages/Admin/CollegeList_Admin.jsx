import React, { useState } from "react";
import { Eye, Edit3, MapPin, GraduationCap, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi"

const colleges = [
  { id: 1, name: "Harvard University", city: "Cambridge", state: "MA", established: 1636, type: "Private" },
  { id: 2, name: "Stanford University", city: "Stanford", state: "CA", established: 1885, type: "Private" },
  { id: 3, name: "MIT", city: "Cambridge", state: "MA", established: 1861, type: "Private" },
  { id: 4, name: "UC Berkeley", city: "Berkeley", state: "CA", established: 1868, type: "Public" },
  { id: 5, name: "Princeton University", city: "Princeton", state: "NJ", established: 1746, type: "Private" },
];

const CollegeList = () => {
  const [viewCollege, setViewCollege] = useState(null);
  const [editCollege, setEditCollege] = useState(null);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiBookOpen className="text-teal-600" />
          College Directory
        </h2>
      </div>
          <p className="text-gray-500 mt-1">Explore premier colleges and their details</p>
        </header>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Colleges</h2>
          <button
            onClick={() => navigate("/admin/create/college")}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-indigo-600 hover:to-teal-500 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            + Add College
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-left text-gray-600">#</th>
                <th className="p-4 font-semibold text-left text-gray-600">Name</th>
                <th className="p-4 font-semibold text-left text-gray-600">Location</th>
                <th className="p-4 font-semibold text-left text-gray-600">Established</th>
                <th className="p-4 font-semibold text-left text-gray-600">Type</th>
                <th className="p-4 font-semibold text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {colleges.map((college, idx) => (
                <tr key={college.id} className="hover:bg-sky-50/50 transition-colors duration-200">
                  <td className="p-4 text-gray-500">{idx + 1}</td>
                  <td className="p-4 text-gray-800 font-medium">{college.name}</td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {college.city}, {college.state}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{college.established}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        college.type === "Private"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {college.type}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setViewCollege(college)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditCollege(college)}
                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== View College Modal ===== */}
      {viewCollege && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setViewCollege(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-blue-700">{viewCollege.name}</h2>
              <p className="text-sm text-gray-500">College Details</p>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-600">Location:</span>{" "}
                {viewCollege.city}, {viewCollege.state}
              </div>
              <div>
                <span className="font-medium text-gray-600">Established:</span>{" "}
                {viewCollege.established}
              </div>
              <div>
                <span className="font-medium text-gray-600">Type:</span>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    viewCollege.type === "Private"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {viewCollege.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ===== Edit College Modal ===== */}
      {editCollege && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setEditCollege(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-emerald-600 mb-1">Edit College</h2>
            <p className="text-sm text-gray-500 mb-6">Update the college information</p>

            <form className="space-y-4">
              <input
                defaultValue={editCollege.name}
                placeholder="College Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  defaultValue={editCollege.city}
                  placeholder="City"
                  className="border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                <input
                  defaultValue={editCollege.state}
                  placeholder="State"
                  className="border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              <input
                type="number"
                defaultValue={editCollege.established}
                placeholder="Established Year"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />

              <select
                defaultValue={editCollege.type}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              >
                <option>Private</option>
                <option>Public</option>
              </select>

              <button
                type="button"
                onClick={() => alert("Save functionality not implemented")}
                className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium px-4 py-3 rounded-lg shadow transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CollegeList;
