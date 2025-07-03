import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  ClipboardList,
  BarChart2,
} from "lucide-react";

const mockGroup = {
  name: "Group A",
  department: "CSE",
  batchYear: 2022,
  collegeName: "College Alpha",
  students: [
    { id: 1, name: "Alice Kumar", email: "alice@example.com" },
    { id: 2, name: "Bob Singh", email: "bob@example.com" },
  ],
  testsCompleted: [
    { id: 101, title: "Java Basics", date: "2024-05-10" },
    { id: 102, title: "React Assessment", date: "2024-06-18" },
  ],
};

const ViewGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-blue-50 min-h-screen flex justify-center">
      <div className="w-full max-w-5xl space-y-6">

        {/* Group Info */}
        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-4">
            <Users size={22} /> Group Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-blue-800">Name:</span> {mockGroup.name}
            </div>
            <div>
              <span className="font-medium text-blue-800">Department:</span> {mockGroup.department}
            </div>
            <div>
              <span className="font-medium text-blue-800">Batch Year:</span> {mockGroup.batchYear}
            </div>
            <div className="col-span-2">
              <span className="font-medium text-blue-800">College:</span> {mockGroup.collegeName}
            </div>
          </div>
        </div>

        {/* Students Table */}
       {/* Students Table */}
<div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
  <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
    <GraduationCap size={20} /> Students
  </h3>
  <div className="overflow-x-auto rounded-md border border-gray-200">
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="bg-blue-100 text-blue-800">
        <tr>
          <th className="px-4 py-2 border-b border-gray-200">Name</th>
          <th className="px-4 py-2 border-b border-gray-200">Email</th>
          <th className="px-4 py-2 border-b border-gray-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        {mockGroup.students.map((student) => (
          <tr key={student.id} className="hover:bg-blue-50 transition">
            <td className="px-4 py-2 border-b border-gray-100">{student.name}</td>
            <td className="px-4 py-2 border-b border-gray-100">{student.email}</td>
            <td className="px-4 py-2 border-b border-gray-100">
              <button
                onClick={() => navigate(`/view-student/${student.id}`)}
                className="flex items-center gap-1 text-sm text-blue-700 px-3 py-1 border border-blue-500 rounded hover:bg-blue-100 transition"
              >
                <Users size={14} /> View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Completed Tests Table */}
        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
            <ClipboardList size={20} /> Completed Tests
          </h3>
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-200">Test Title</th>
                  <th className="px-4 py-2 border-b border-gray-200">Date</th>
                  <th className="px-4 py-2 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockGroup.testsCompleted.map((test) => (
                  <tr key={test.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 border-b border-gray-100">{test.title}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{test.date}</td>
                    <td className="px-4 py-2 border-b border-gray-100">
                      <button
                        onClick={() => navigate(`/group-test-results/${test.id}`)}
                        className="flex items-center gap-1 text-sm text-blue-700 px-3 py-1 border border-blue-500 rounded hover:bg-blue-100 transition"
                      >
                        <BarChart2 size={16} /> See Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewGroup;
