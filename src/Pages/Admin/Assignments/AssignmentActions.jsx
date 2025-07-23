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
  changeAssignmentStatus,
} from "../../../Controllers/AssignmentControllers";
 
const AssignmentActions = ({ id, role = "admin", fetchAssignment }) => {
  const AssignmentStatus = Object.freeze({
    DRAFT: "draft",
    SCHEDULED: "scheduled",
    ACTIVE: "active",
    COMPLETED: "completed",
    EXPIRED: "expired",
    CANCELLED: "cancelled",
  });
 
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [extendData, setExtendData] = useState({
    newEndTime: "",
    gracePeriodMinutes: 0,
  });
  const [showExtendModal, setShowExtendModal] = useState(false);
 
  // Modal control for status change
  const [showStatusModal, setShowStatusModal] = useState(false);
  // Temporarily holds status selected inside modal
  const [tempStatus, setTempStatus] = useState("");
 
  // Fetch assignment details on mount or when id changes
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAssignmentById(id);
        const assignmentData = res.data.assignment;
        setAssignment(assignmentData);
        setTempStatus(assignmentData.status || AssignmentStatus.DRAFT);
      } catch (err) {
        setError("Failed to fetch assignment details.");
      }
    }
    fetchData();
  }, [id]);
 
  const normalizedStatus = assignment?.status?.trim().toLowerCase() || "";
 
  // Clear messages after 3 seconds
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
      const res = await getAssignmentById(id);
      setAssignment(res.data.assignment);
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
      const res = await getAssignmentById(id);
      setAssignment(res.message.assignment);
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
 
  // Open Status modal and reset error
  const openStatusModal = () => {
    setTempStatus(assignment.status || AssignmentStatus.DRAFT);
    setError("");
    setShowStatusModal(true);
  };
 
  const closeStatusModal = () => {
    setShowStatusModal(false);
    setError("");
  };
 
  const handleConfirmStatusChange = async () => {
    setError("");
    if (!tempStatus) {
      setError("Please select a status.");
      return;
    }
    if (tempStatus === assignment.status) {
      setError("Please select a different status.");
      return;
    }
    try {
      await changeAssignmentStatus(id, tempStatus);
      setMessage(`Assignment status updated to ${tempStatus}.`);
      const res = await getAssignmentById(id);
      setAssignment(res.message.assignment);
      fetchAssignment?.();
      closeStatusModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };
 
 
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      {/* Left Title */}
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
        <ClipboardList className="w-6 h-6 text-blue-600" />
        Assignment Details
      </h2>
 
      {/* Right Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
          onClick={() => navigate("/admin/assignments")}
        >
          <ArrowLeft size={16} /> Back
        </button>
 
        {/* Button to open Status Change Modal */}
        <button
          onClick={openStatusModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          Change Status
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
          disabled={
            normalizedStatus !== "active" && !(normalizedStatus === "draft" || normalizedStatus === "cancelled")
          }
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm ${
            normalizedStatus === "active"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          } ${
            normalizedStatus !== "active" && !(normalizedStatus === "draft" || normalizedStatus === "cancelled")
              ? "opacity-20 cursor-not-allowed"
              : ""
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
 
      {/* Modal: Extend Deadline */}
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
                    gracePeriodMinutes: parseInt(e.target.value, 10) || 0,
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
 
      {/* Modal: Change Status */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">
              Change Assignment Status
            </h2>
            <select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
            >
              {Object.values(AssignmentStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
 
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
 
            <div className="flex justify-end gap-3">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default AssignmentActions;