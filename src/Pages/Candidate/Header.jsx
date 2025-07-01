import React, { useEffect, useState } from 'react'

const TOTAL_TIME = 90 * 60 // 1.5 hours in seconds
const TIMER_KEY = 'assessment_timer_seconds'

const Header = ({ onEndTest, start = false }) => {

  const email = localStorage.getItem('userEmail') || 'guest@example.com'
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const stored = localStorage.getItem(TIMER_KEY)
    return stored ? parseInt(stored, 10) : TOTAL_TIME
  })
useEffect(() => {
  if (!start || secondsLeft <= 0) return

  const interval = setInterval(() => {
    setSecondsLeft((prev) => {
      const next = prev - 1
      localStorage.setItem(TIMER_KEY, next)
      return next
    })
  }, 1000)

  return () => clearInterval(interval)
}, [start, secondsLeft])


  // Format to HH:MM:SS
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  // Handle test end
  const handleEndTest = () => {
  const confirmEnd = window.confirm('Are you sure you want to end the test?')
  if (confirmEnd) {
    localStorage.setItem(TIMER_KEY, TOTAL_TIME.toString()) // 🔁 Reset timer
    if (typeof onEndTest === 'function') {
      onEndTest()
    }
  }
}


  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-6 flex items-center justify-between">
      {/* Left: Logo and Welcome */}
      <div className="flex items-center gap-4">
        <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
        <div className="text-gray-800 text-sm">
          <p className="font-semibold">Welcome 👋</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      {/* Right: Timer + End Test */}
      <div className="flex items-center gap-6">
        {/* Timer */}
        <div className="bg-gray-100 text-gray-700 px-4 py-1 rounded text-sm font-semibold">
          ⏱ {formatTime(secondsLeft)}
        </div>

        {/* End Test Button */}
        <button
          onClick={handleEndTest}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          End Test
        </button>
      </div>
    </header>
  )
}

export default Header
