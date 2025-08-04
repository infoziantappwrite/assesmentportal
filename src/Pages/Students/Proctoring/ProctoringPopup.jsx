import React from 'react';

const ProctoringPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px] text-center">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Proctoring Alert</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ProctoringPopup;
