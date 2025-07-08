import React from 'react';
import { UploadCloud } from 'lucide-react';

const BulkUploadUser = () => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log('Selected File:', file);

    // TODO: Parse file and send API request to /bulk-create
  };

  return (
    <div className="p-6 border border-blue-200 border-dashed rounded-xl bg-blue-50/20 shadow-inner">
      <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-3">
        <UploadCloud className="w-5 h-5 text-blue-600" />
        Bulk Upload Users
      </h3>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        className="block w-full text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />

      <p className="text-sm text-gray-500 mt-2">
        Accepted formats: <span className="font-medium text-gray-600">.csv, .xlsx</span>
      </p>
    </div>
  );
};

export default BulkUploadUser;
