import React, { useState } from 'react';
import { resetUserPassword } from '../../../Controllers/userControllers';
import { useParams } from 'react-router-dom';
import { Lock, CheckCircle, XCircle, EyeOff, Eye } from 'lucide-react';

const ResetUserPassword = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    setError('');
    setStatus('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await resetUserPassword(id, newPassword);
      setStatus('Password reset successfully');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowModal(false);
        setStatus('');
      }, 2000);
    } catch {
      setError('Failed to reset password');
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-1.5 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
      >
        <Lock className="w-4 h-4" />
        Reset Password
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Reset User Password
            </h3>

            {/* Status Message */}
            {status && (
              <div className="flex items-center gap-2 mb-3 text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                {status}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                 
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                    setStatus('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetUserPassword;
