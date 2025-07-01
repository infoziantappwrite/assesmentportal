import React from 'react'

const StepInstructions = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📋 Assessment Instructions</h2>
      <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed text-base">
        <li>⏳ Total time: <strong>1 hour 30 minutes</strong>.</li>
        <li>📵 Do not refresh or leave this screen after starting the assessment.</li>
        <li>💬 The test includes objective and short answer questions.</li>
        <li>🧭 Use the <strong>Next</strong> and <strong>Back</strong> buttons to navigate.</li>
        <li>📝 All answers must be submitted before the time ends.</li>
        <li>⚠️ Do not open other tabs or windows during the test.</li>
        <li>📤 Test will be auto-submitted when time ends or when you finish.</li>
      </ul>
    </div>
  )
}

export default StepInstructions
