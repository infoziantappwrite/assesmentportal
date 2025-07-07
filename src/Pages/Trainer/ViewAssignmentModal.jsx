import React from "react";
import { X } from "lucide-react";

const ViewAssignmentModal = ({ assignment, onClose }) => {
  if (!assignment) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        <header className="p-5 border-b flex justify-between items-center bg-indigo-50">
          <h3 className="text-xl font-bold text-indigo-700">Assignment Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-5 space-y-4 text-sm text-gray-700">
          <p><strong>Test:</strong> {assignment.testTitle}</p>
          <p><strong>College:</strong> {assignment.college}</p>
          <p><strong>Batches:</strong> {assignment.batches.join(", ")}</p>
          <p><strong>Start:</strong> {new Date(assignment.startDate).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(assignment.endDate).toLocaleString()}</p>
        </div>

        <footer className="p-5 border-t">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ViewAssignmentModal;
