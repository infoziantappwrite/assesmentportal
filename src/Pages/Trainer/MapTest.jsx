// MapTest.jsx
import React from 'react';
import { X } from "lucide-react";

const MapTest = ({
  mapTest,
  handleCloseMap,
  colleges,
  batches,
  selectedCollege,
  selectedBatches,
  toggleBatch,
  mappedStartDate,
  mappedEndDate,
  setSelectedCollege,
  setMappedStartDate,
  setMappedEndDate,
  handleMapSubmit,
   children
}) => {
  if (!mapTest) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
        <header className="p-5 border-b flex justify-between items-center bg-purple-50">
          <h3 className="text-xl font-bold text-purple-700">Map Test: {mapTest.title}</h3>
          <button onClick={handleCloseMap} className="text-gray-400 hover:text-red-500 transition-colors">
           <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-5 space-y-6 overflow-y-auto max-h-[80vh]">
           {children} 
          {/* College Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Select College</label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
            >
              <option value="">-- Select a College --</option>
              {colleges.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Batch Checkboxes */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Select Batches</label>
            <div className="space-y-2 rounded-lg border border-gray-200 p-3 bg-gray-50">
              {batches.map((b, idx) => (
                <label
                  key={idx}
                  htmlFor={`batch-${idx}`}
                  className="flex items-center gap-3 py-1 cursor-pointer hover:bg-purple-50 rounded transition-colors"
                >
                  <input
                    id={`batch-${idx}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    checked={selectedBatches.includes(b)}
                    onChange={() => toggleBatch(b)}
                  />
                  <span className="text-gray-800">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule Timing */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Mapped Start Date & Time</label>
              <input
                type="datetime-local"
                value={mappedStartDate}
                onChange={(e) => setMappedStartDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Mapped End Date & Time</label>
              <input
                type="datetime-local"
                value={mappedEndDate}
                onChange={(e) => setMappedEndDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <footer className="p-5 border-t">
          <button
            onClick={handleMapSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-all shadow"
          >
            Map Test
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MapTest;
