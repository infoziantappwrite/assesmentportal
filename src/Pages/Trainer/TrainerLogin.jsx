import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TRAINER_CREDENTIALS = {
  'trainer@example.com': 'trainer123',
}

const TrainerLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message?.type === 'success') {
      const timeout = setTimeout(() => {
        setMessage(null)
        navigate('/trainer/dashboard')
      }, 2000)
      return () => clearTimeout(timeout)
    }

    if (message?.type === 'error') {
      const timeout = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timeout)
    }
  }, [message, navigate])

  const handleLogin = (e) => {
    e.preventDefault()

    if (TRAINER_CREDENTIALS[email] && TRAINER_CREDENTIALS[email] === password) {
      localStorage.setItem('trainerAuth', 'true')
      localStorage.setItem('trainerEmail', email)
      localStorage.setItem('role', 'trainer');
      setMessage({ type: 'success', text: 'Trainer login successful! Redirecting...' })
    } else {
      setMessage({ type: 'error', text: 'Invalid trainer email or password.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 text-gray-800 relative overflow-hidden">
      <div className="relative ring-1 ring-blue-300 bg-white border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-white ">
            <img src="/Logo.png" alt="Logo" className="h-14 w-auto" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">TRAINER LOGIN</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Login to access your trainer dashboard.
        </p>

        {message && (
          <div
            className={`text-sm px-4 py-2 mb-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-100 border-green-400 text-green-800'
                : 'bg-red-100 border-red-400 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter trainer email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter trainer password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default TrainerLogin
