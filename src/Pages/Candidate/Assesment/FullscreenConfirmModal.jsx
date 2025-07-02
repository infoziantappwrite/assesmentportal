import React from 'react';
import { X, Monitor } from 'lucide-react';

const FullscreenConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white bg-gradient-to-br from-white via-slate-50 to-gray-100 p-6 rounded-xl shadow-2xl max-w-sm w-full text-center relative border border-gray-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon + Heading */}
        <div className="flex flex-col items-center mb-3">
          <Monitor className="w-8 h-8 text-blue-600 mb-2" />
          <h2 className="text-lg font-bold text-gray-800">Enter Fullscreen Mode</h2>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5">
          This test requires fullscreen access. Please allow fullscreen mode to continue.
        </p>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full py-2 px-4 rounded text-sm font-semibold bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition"
        >
          Allow & Start Test
        </button>
      </div>
    </div>
  );
};

export default FullscreenConfirmModal;
