/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  LoaderCircle,
} from "lucide-react";
import { X, RefreshCcw } from "lucide-react";
import { createCandidatesBulk } from "../../../Controllers/userControllers";

const BulkUploadUser = () => {
  const [previewData, setPreviewData] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [failedUsers, setFailedUsers] = useState([]);
  const fileInputRef = useRef(null);

  // 🔹 Email validation (no space, no uppercase, valid format)
  const validateEmail = (email) => {
    if (!email) return false;
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/; // only lowercase + valid format
    return regex.test(email);
  };

  const handleFileUpload = (e) => {
    setStatusMessage(null);
    const file = e.target.files[0];

    if (!file || !file.name.endsWith(".xlsx")) {
      setStatusMessage({
        type: "error",
        text: "Only .xlsx files are allowed.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          setStatusMessage({
            type: "error",
            text: "The file is empty or invalid.",
          });
          return;
        }

        setPreviewData(jsonData);
      } catch {
        setStatusMessage({ type: "error", text: "Failed to read file." });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    // 🔹 validate before uploading
    const invalidEmails = previewData
      .map((row) => row.email?.trim())
      .filter((email) => !validateEmail(email));

    if (invalidEmails.length > 0) {
      setStatusMessage({
        type: "error",
        text: `Invalid email(s): ${invalidEmails.join(", ")}`,
      });
      return;
    }

    setUploading(true);
    setStatusMessage(null);
    try {
      const res = await createCandidatesBulk({ users: previewData });

      const created = res?.data?.candidates || [];
      const failed = res?.data?.failed || [];

      setCreatedUsers(created);
      setFailedUsers(failed);

      setStatusMessage({
        type: "success",
        text: `${res?.data?.createdCount || 0} users created. ${failed.length ? `${failed.length} failed.` : ""
          }`,
      });

      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        setStatusMessage(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: "Upload failed. Check your file.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadCreated = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(createdUsers);
    XLSX.utils.book_append_sheet(wb, ws, "Created Users");
    XLSX.writeFile(wb, "created_users.xlsx");
  };

  const handleRefresh = () => {
    setStatusMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="p-6 border border-blue-200 border-dashed rounded-xl bg-blue-50/20 shadow-inner max-w-6xl mx-auto">
      <h3 className="text-lg font-semibold text-blue-700 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          Bulk Upload Users
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </h3>


      {/* Status Message */}
      {statusMessage?.text && (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm mb-4 ${statusMessage.type === "success"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
            }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Upload Input */}
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="block w-full text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />

      <p className="text-sm text-gray-500 mt-2">
        Upload an Excel <code>.xlsx</code> file with columns:{" "}
        <span className="text-gray-700 font-medium">
          name, email, password, roll_number, role (optional, default CANDIDATE), groupId (optional), collegeId (optional)
        </span>
      </p>

      {/* Preview Modal */}
     {previewData.length > 0 && (
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl border border-gray-200 p-6 relative max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={() => setPreviewData([])}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
      >
        <XCircle className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Preview ({previewData.length} Users)
        </h4>

        {/* Check if any invalid emails exist */}
        {previewData.some((row) => !validateEmail(row.email)) ? (
          <span className="text-red-600 font-medium text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2 mr-6">
            ⚠️ Invalid emails detected. Please fix before upload.
          </span>
        ) : (
          <button
            onClick={handleConfirmUpload}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50  mr-6 "
          >
            {uploading ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Confirm Upload
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-inner">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
            <tr>
              {Object.keys(previewData[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 border-b border-r border-gray-200 font-medium"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, i) => (
              <tr key={i} className="even:bg-gray-50 text-gray-800">
                {Object.entries(row).map(([k, val], idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-2 border-t border-r border-gray-200 ${
                      k === "email" && !validateEmail(val)
                        ? "bg-red-100 text-red-700 font-medium"
                        : ""
                    }`}
                  >
                    {val || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}


      {/* Download Created Users */}
      {createdUsers.length > 0 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleDownloadCreated}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download Created Users
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUploadUser;
