import React, { useState } from 'react';
import { submitAllSubmissions } from '../../../Controllers/AssignmentControllers';
import NotificationMessage from '../../../Components/NotificationMessage';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmButtonColor = "red" }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-opacity-10 backdrop-blur-sm"></div>
    <div className="relative bg-white rounded-lg shadow-lg p-6 w-100 max-w-full z-10 border border-gray-400">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="mb-5 text-gray-700">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded text-white transition ${
            confirmButtonColor === "green" 
              ? "bg-green-600 hover:bg-green-700" 
              : confirmButtonColor === "blue"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const SubmitAllButton = ({ assignmentId, onSuccess }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const handleConfirmSubmitAll = async () => {
    setModalOpen(false);
    try {
      const res = await submitAllSubmissions(assignmentId);
      showNotification('success', res.message || 'All submissions submitted.');
      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to submit all.');
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="text-xs px-4 py-2 rounded-2xl bg-blue-600 text-white font-medium whitespace-nowrap cursor-pointer transition-colors hover:bg-blue-800"
      >
        Submit All
      </button>

      {modalOpen && (
        <ConfirmationModal
          title="Confirm Submit All"
          message="Are you sure you want to submit ALL active submissions? This action cannot be undo."
          onConfirm={handleConfirmSubmitAll}
          onCancel={() => setModalOpen(false)}
          confirmButtonColor="blue"
        />
      )}

      {notification.show && (
        <NotificationMessage
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </>
  );
};

export default SubmitAllButton;
