import React, { useState } from "react";
import { Eye, Edit3, MapPin, GraduationCap, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            College Directory
          </h1>
          <p className="text-gray-500 mt-1">Explore premier colleges and their details</p>
        </header>

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
                        disabled
                        className="bg-gray-400 text-gray-700 px-3 py-2 rounded-lg shadow-md cursor-not-allowed opacity-70"
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

      {/* View Modal */}
      {viewCollege && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-gray-300 p-6 relative">
            <button onClick={() => setViewCollege(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-blue-700 mb-4">{viewCollege.name}</h3>
            <div className="space-y-3 text-gray-700 text-sm">
              <p><strong>Location:</strong> {viewCollege.city}, {viewCollege.state}</p>
              <p><strong>Established:</strong> {viewCollege.established}</p>
              <p>
                <strong>Type:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    viewCollege.type === "Private"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {viewCollege.type}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCollege && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-gray-200 p-6 relative">
            <button onClick={() => setEditCollege(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-emerald-700 mb-4">Edit College</h3>
            <form className="space-y-4">
              <input defaultValue={editCollege.name} className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input defaultValue={editCollege.city} className="border rounded px-3 py-2 shadow-sm" />
                <input defaultValue={editCollege.state} className="border rounded px-3 py-2 shadow-sm" />
              </div>
              <input type="number" defaultValue={editCollege.established} className="w-full border rounded px-3 py-2 shadow-sm" />
              <select defaultValue={editCollege.type} className="w-full border rounded px-3 py-2 shadow-sm">
                <option>Private</option>
                <option>Public</option>
              </select>
              <button
                type="button"
                onClick={() => alert("Save functionality not implemented")}
                className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:opacity-90 transition"
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
