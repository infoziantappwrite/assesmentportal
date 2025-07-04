import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate email submission
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md ring-1 ring-blue-300 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your registered email to receive reset instructions.
        </p>

        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-800 text-sm px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            If this email is registered, a reset link has been sent to your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
