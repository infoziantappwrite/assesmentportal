import React, { useState } from 'react';
import { FileBarChart, ChevronDown, Check } from 'lucide-react';
import { generateAssignmentReport, generateCollegeReport, generateUserReport } from '../../../Controllers/reportsController';

const exportFormats = Object.freeze({
    PDF: 'pdf',
    CSV: 'csv',
    EXCEL: 'excel'
});

const GenerateReportButton = ({ reportType, payload }) => {
    const [selectedFormat, setSelectedFormat] = useState(exportFormats.PDF);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        console.log(`Generating ${selectedFormat} report:`, { reportType, payload });

        try {
            if (reportType === 'assignment_report') {
                const result = await generateAssignmentReport(payload._id, selectedFormat);
                console.log('Assignment report generated:', result);
            } else if (reportType === 'college_report') {
                const result = await generateCollegeReport(payload._id, selectedFormat);
                console.log('College report generated:', result);
            } else if (reportType === 'user_activity') {
                const result = await generateUserReport(payload._id, selectedFormat);
                console.log('User report generated:', result);
            } else {
                console.error('Unknown report type');
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Report generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative inline-flex items-center gap-0.5">
            {/* Format Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${isDropdownOpen
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                        } border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                    {selectedFormat.toUpperCase()}
                    <ChevronDown
                        size={16}
                        className={`ml-1.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {/* Dropdown Menu - Now appears above when near bottom */}
                {isDropdownOpen && (
                    <div className="absolute left-0 z-50 w-32 origin-bottom rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-100"
                        style={{
                            top: '100%', // Default: show below
                            bottom: 'auto',
                            marginTop: '0.25rem'
                        }}
                        ref={(node) => {
                            if (node) {
                                const rect = node.getBoundingClientRect();
                                const viewportHeight = window.innerHeight;

                                // If there's not enough space below, show above
                                if (rect.bottom > viewportHeight) {
                                    node.style.top = 'auto';
                                    node.style.bottom = '100%';
                                    node.style.marginTop = '0';
                                    node.style.marginBottom = '0.25rem';
                                }
                            }
                        }}
                    >
                        <div className="py-1">
                            {Object.entries(exportFormats).map(([key, value]) => (
                                <button
                                    key={value}
                                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${selectedFormat === value
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => {
                                        setSelectedFormat(value);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {selectedFormat === value && (
                                        <Check size={14} className="mr-2 text-blue-500" />
                                    )}
                                    <span className={selectedFormat === value ? 'ml-6' : 'ml-8'}>
                                        {key}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button - Improved green states */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating || showSuccess}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${showSuccess
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                        : isGenerating
                            ? 'bg-emerald-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 text-white'
                    }`}
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : showSuccess ? (
                    <>
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default GenerateReportButton;