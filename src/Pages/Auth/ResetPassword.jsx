import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { resetPasswordAPI } from '../../Controllers/authController';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Reset token is missing.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await resetPasswordAPI(token, password);

    if (result.success) {
      setSubmitted(true);
      setError(null);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md ring-1 ring-blue-300 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter a new password to reset your account.
        </p>

        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-800 text-sm px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Password has been successfully reset.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-100 border border-red-400 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
