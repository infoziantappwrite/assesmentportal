const StepOverview = ({ onStartTest }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">🧾 Overview of the Test</h2>
      <div className="text-gray-700 space-y-3 mb-6 text-base text-left max-w-xl mx-auto">
        <p><strong>Total Sections:</strong> 1</p>
        <p><strong>Types of Questions:</strong> MCQs, short answers</p>
        <p><strong>Duration:</strong> 1 hour 30 minutes</p>
        <p><strong>Note:</strong> Once started, the timer begins and cannot be paused.</p>
      </div>
      <button
        onClick={onStartTest}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
      >
        🚀 Start Test
      </button>
    </div>
  )
}

export default StepOverview
