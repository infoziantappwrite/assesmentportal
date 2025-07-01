import React, { useEffect, useState } from 'react'

const TOTAL_TIME = 90 * 60 // 1.5 hours in seconds
const TIMER_KEY = 'assessment_timer_seconds'

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const stored = localStorage.getItem(TIMER_KEY)
    return stored ? parseInt(stored, 10) : TOTAL_TIME
  })

  useEffect(() => {
    if (secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const updated = prev - 1
        localStorage.setItem(TIMER_KEY, updated)
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft])

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <div className="text-sm text-gray-700 font-medium bg-gray-100 px-4 py-1 rounded">
      ⏱ {formatTime(secondsLeft)}
    </div>
  )
}

export default Timer
