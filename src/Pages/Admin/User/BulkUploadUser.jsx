import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { createCandidatesBulk } from '../../../Controllers/userControllers';

const BulkUploadUser = () => {
  const [statusMessage, setStatusMessage] = useState(null);

  const handleFileUpload = async (e) => {
    setStatusMessage(null);
    const file = e.target.files[0];

    if (!file || !file.name.endsWith('.xlsx')) {
      setStatusMessage({ type: 'error', text: 'Only .xlsx files are allowed.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          setStatusMessage({ type: 'error', text: 'The file is empty or invalid.' });
          return;
        }

        const response = await createCandidatesBulk({ users: jsonData });

        setStatusMessage({
          type: 'success',
          text: `Upload completed. ${response.createdCount} created, ${response.failed?.length || 0} failed.`,
        });
      } catch (error) {
        console.error('Upload failed:', error);
        setStatusMessage({ type: 'error', text: 'Failed to upload users. Please check file format.' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 border border-blue-200 border-dashed rounded-xl bg-blue-50/20 shadow-inner max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-3">
        <UploadCloud className="w-5 h-5 text-blue-600" />
        Bulk Upload Users
      </h3>

      {statusMessage?.text && (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm mb-4 ${
            statusMessage.type === 'success'
              ? 'text-green-700 bg-green-50 border-green-200'
              : 'text-red-700 bg-red-50 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {statusMessage.text}
        </div>
      )}

      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        className="block w-full text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />

      <p className="text-sm text-gray-500 mt-2">
        Upload an Excel <code>.xlsx</code> file with required columns:
        <span className="text-gray-700 font-medium"> name, email, password, role, dob, groupId (optional)</span>
      </p>
    </div>
  );
};

export default BulkUploadUser;
