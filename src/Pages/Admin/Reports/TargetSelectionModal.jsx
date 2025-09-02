// --------------------- Target Selection Modal ---------------------
import React, { useState } from "react";
import { X } from "lucide-react";

const TargetSelectionModal = ({
  colleges,
  groups,
  students,
  selectedTargets,
  onClose,
  onConfirm,
}) => {
  const [tempSelection, setTempSelection] = useState(selectedTargets);

  const toggleSelection = (type, id) => {
    setTempSelection((prev) => {
      const updated = { ...prev };
      if (updated[type].includes(id)) {
        updated[type] = updated[type].filter((x) => x !== id);
      } else {
        updated[type] = [...updated[type], id];
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
          Select Targets
        </h2>

        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          {/* Colleges */}
          {colleges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Colleges
              </h3>
              <div className="space-y-2">
                {colleges.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-green-600"
                      checked={tempSelection.colleges.includes(c._id)}
                      onChange={() => toggleSelection("colleges", c._id)}
                    />
                    <span className="text-gray-800">{c.name || "Unnamed College"}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Groups */}
          {groups.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Groups</h3>
              <div className="space-y-2">
                {groups.map((g) => (
                  <label
                    key={g._id}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-green-600"
                      checked={tempSelection.groups.includes(g._id)}
                      onChange={() => toggleSelection("groups", g._id)}
                    />
                    <span className="text-gray-800">{g.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {students.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Students</h3>
              <div className="space-y-2">
                {students.map((s) => (
                  <label
                    key={s._id}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-green-600"
                      checked={tempSelection.students.includes(s._id)}
                      onChange={() => toggleSelection("students", s._id)}
                    />
                    <span className="text-gray-800">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(tempSelection)}
            className="px-5 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetSelectionModal;
