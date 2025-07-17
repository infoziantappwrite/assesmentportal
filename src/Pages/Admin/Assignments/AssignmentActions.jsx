import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  XCircle,
  CheckCircle,
  Clock,
  ClipboardList,
} from "lucide-react";
import {
  cancelAssignment,
  activateAssignment,
  extendDeadline,
  getAssignmentById,  
} from "../../../Controllers/AssignmentControllers";

const AssignmentActions = ({ id, role = "admin", fetchAssignment }) => {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [extendData, setExtendData] = useState({
    newEndTime: "",
    gracePeriodMinutes: 0,
  });
  const [showExtendModal, setShowExtendModal] = useState(false);

  // Fetch assignment details on mount or when id changes
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAssignmentById(id);
        const assignmentData = res.message.assignment;
        setAssignment(assignmentData);
      } catch (err) {
        setError("Failed to fetch assignment details.");
      }
    }
    fetchData();
  }, [id]);


  const normalizedStatus = assignment?.status?.trim().toLowerCase() || "";

  useEffect(() => {
    if (message || error) {
      const timeout = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, error]);

  const handleToggleStatus = async () => {
    setError("");
    try {
      if (normalizedStatus === "active") {
        await cancelAssignment(id);
        setMessage("Assignment cancelled.");
      } else {
        await activateAssignment(id);
        setMessage("Assignment activated.");
      }
      // Re-fetch after update
      const res = await getAssignmentById(id);
      setAssignment(res.message.assignment);
      fetchAssignment?.(); 
    } catch (err) {
      console.error(err);
      setError("Action failed. Please try again.");
    }
  };

  const handleExtend = async () => {
    setError("");
    if (!extendData.newEndTime) return setError("Please select new end time.");

    try {
      await extendDeadline(id, extendData);
      setMessage("Deadline extended successfully.");
      closeExtendModal();
      // Re-fetch after update
      const res = await getAssignmentById(id);
      setAssignment(res.assignment);
    } catch (err) {
      console.error(err);
      setError("Failed to extend deadline.");
    }
  };

  const openExtendModal = () => {
    setError("");
    setShowExtendModal(true);
  };

  const closeExtendModal = () => {
    setShowExtendModal(false);
    setExtendData({ newEndTime: "", gracePeriodMinutes: 0 });
    setError("");
  };

  if (!assignment) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading assignment details...
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      {/* Left Title */}
      <div className="flex items-center gap-2 text-xl text-green-700 font-semibold">
        <ClipboardList className="w-6 h-6" />
        Assignment Details
      </div>

      {/* Right Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
          onClick={() => navigate("/admin/assignments")}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={() => navigate(`/${role}/assignments/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>

        {/* Toggle Cancel/Activate button */}
        <button
          onClick={handleToggleStatus}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm ${
            normalizedStatus === "active"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {normalizedStatus === "active" ? (
            <>
              <XCircle className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Activate
            </>
          )}
        </button>

        <button
          onClick={openExtendModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
        >
          <Clock className="w-4 h-4" />
          Extend Deadline
        </button>
      </div>

      {/* Success & Error Messages */}
      {message && (
        <div className="w-full text-center mt-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
          {message}
        </div>
      )}

      {error && (
        <div className="w-full text-center mt-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Modal with blurred background */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Extend Assignment Deadline
            </h2>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">New End Time</label>
              <input
                type="datetime-local"
                value={extendData.newEndTime}
                onChange={(e) =>
                  setExtendData((prev) => ({ ...prev, newEndTime: e.target.value }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              <label className="text-sm font-medium text-gray-700">Grace Period (mins)</label>
              <input
                type="number"
                min="0"
                value={extendData.gracePeriodMinutes}
                onChange={(e) =>
                  setExtendData((prev) => ({
                    ...prev,
                    gracePeriodMinutes: parseInt(e.target.value),
                  }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeExtendModal}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtend}
                  className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentActions;
