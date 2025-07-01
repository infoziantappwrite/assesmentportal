import React from 'react'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome to My React App
        </h1>
        <p className="text-center mb-4 text-gray-600">
          This is a simple React application built with Tailwind CSS.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => alert('Button clicked!')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Click Me!
          </button>
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-600 text-center">
          <p>✅ Enjoy building your app!</p>
          
        </div>
      </div>
    </div>
  )
}

export default App
