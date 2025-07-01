import React, { useState } from 'react'

const StepTest = () => {
  const [answers, setAnswers] = useState({})

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🧪 Test Questions</h2>

      <div className="space-y-6">
        {/* Question 1 */}
        <div>
          <p className="font-medium text-gray-800 mb-1">Q1. What does HTML stand for?</p>
          <div className="space-y-2 ml-4">
            <label className="block">
              <input
                type="radio"
                name="q1"
                value="HyperText Markup Language"
                onChange={handleChange}
                className="mr-2"
              />
              HyperText Markup Language
            </label>
            <label className="block">
              <input
                type="radio"
                name="q1"
                value="Home Tool Markup Language"
                onChange={handleChange}
                className="mr-2"
              />
              Home Tool Markup Language
            </label>
            <label className="block">
              <input
                type="radio"
                name="q1"
                value="Hyperlinks and Text Markup Language"
                onChange={handleChange}
                className="mr-2"
              />
              Hyperlinks and Text Markup Language
            </label>
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <p className="font-medium text-gray-800 mb-1">Q2. Write a short explanation of what CSS is.</p>
          <textarea
            name="q2"
            rows="4"
            onChange={handleChange}
            className="w-full p-3 border rounded-md text-sm text-gray-700"
            placeholder="Your answer here..."
          ></textarea>
        </div>
      </div>
    </div>
  )
}

export default StepTest
