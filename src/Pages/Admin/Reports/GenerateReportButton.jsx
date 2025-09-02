import React, { useState,useEffect } from "react";
import { FileBarChart, ChevronDown, Check, X } from "lucide-react";
import {
  generateAssignmentReport,
  generateCollegeReport,
  generateUserReport,
} from "../../../Controllers/reportsController";
import TargetSelectionModal from "./TargetSelectionModal";

// Export formats
const exportFormats = Object.freeze({
  PDF: "pdf",
  CSV: "csv",
  EXCEL: "excel",
});



// --------------------- Generate Report Button ---------------------
const GenerateReportButton = ({ reportType, payload }) => {
  const [selectedFormat, setSelectedFormat] = useState(exportFormats.PDF);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState({
    colleges: [],
    groups: [],
    students: [],
  });
  //console.log(payload);
   useEffect(() => {
    if (
      !showTargetModal &&
      (selectedTargets.colleges.length > 0 ||
        selectedTargets.groups.length > 0 ||
        selectedTargets.students.length > 0)
    ) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTargets, showTargetModal]);

  const handleGenerate = async () => {
    if (reportType === "assignment_report") {
      if (
        selectedTargets.colleges.length === 0 &&
        selectedTargets.groups.length === 0 &&
        selectedTargets.students.length === 0
      ) {
        setShowTargetModal(true);
        return;
      }
    }

    setIsGenerating(true);

    try {
      if (reportType === "assignment_report") {
        const finalPayload = {
          assignmentId: payload._id,
          format: selectedFormat,
          includeDetails: true,
          targetColleges:
            selectedTargets.colleges.length > 0 ? selectedTargets.colleges : undefined,
          targetGroups:
            selectedTargets.groups.length > 0 ? selectedTargets.groups : undefined,
          targetStudents:
            selectedTargets.students.length > 0 ? selectedTargets.students : undefined,
        };

        await generateAssignmentReport(finalPayload);
        setSelectedTargets({ colleges: [], groups: [], students: [] });
      } else if (reportType === "college_report") {
        await generateCollegeReport(payload._id, selectedFormat);
      } else if (reportType === "user_activity") {
        await generateUserReport(payload._id, selectedFormat);
      } else {
        console.error("Unknown report type");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="relative inline-flex items-center gap-0.5">
        {/* Format Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-l-lg ${
              isDropdownOpen
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
            }`}
          >
            {selectedFormat.toUpperCase()}
            <ChevronDown
              size={16}
              className={`ml-1.5 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 z-50 w-32 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md">
              <div className="py-1">
                {Object.entries(exportFormats).map(([key, value]) => (
                  <button
                    key={value}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      selectedFormat === value
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedFormat(value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {selectedFormat === value && (
                      <Check size={14} className="mr-2 text-blue-500" />
                    )}
                    {key}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || showSuccess}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-lg text-white ${
            showSuccess
              ? "bg-emerald-600"
              : isGenerating
              ? "bg-emerald-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
                />
              </svg>
              Generating...
            </>
          ) : showSuccess ? (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Success!
            </>
          ) : (
            <>
              <FileBarChart size={16} className="-ml-1 mr-2" />
              Generate
            </>
          )}
        </button>

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      {/* Target Selection Modal */}
      {showTargetModal && (
        <TargetSelectionModal
          colleges={payload.target.college_ids || []}
          groups={payload.target.group_ids || []}
          students={payload.target.student_ids || []}
          selectedTargets={selectedTargets}
          onClose={() => {
            setShowTargetModal(false);
            setSelectedTargets({ colleges: [], groups: [], students: [] }); // clear on close
          }}
          onConfirm={(newTargets) => {
            setSelectedTargets(newTargets); // state update triggers useEffect
            setShowTargetModal(false);
          }}
        />
      )}
    </>
  );
};

export default GenerateReportButton;
