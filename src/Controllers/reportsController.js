import axiosClient from "../api/axiosClient";

// ✅ GET /reports/export-options
export const getExportOptions = async () => {
  const response = await axiosClient.get(`/reports/export-options`, {
    withCredentials: true,
  });
  return response.data;
};

// ✅ POST /reports/generate
export const generateReport = async (payload) => {
  const response = await axiosClient.post(`/reports/generate`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// ✅ POST /reports/assignment/:assignmentId
// POST /reports/assignment/:assignmentId
export const generateAssignmentReport = async (assignmentId, format = 'excel') => {
  const response = await axiosClient.post(`/reports/assignment/${assignmentId}`, {
    format,
    filters: {}, // optional
    includeDetails: true,
  }, {
    withCredentials: true,
  });
  return response.data;
};


// ✅ POST /reports/review/:submissionId
export const generateReviewReport = async (submissionId) => {
  const response = await axiosClient.post(`/reports/review/${submissionId}`, {}, {
    withCredentials: true,
  });
  return response.data;
};

// ✅ POST /reports/college/:collegeId
export const generateCollegeReport = async (collegeId, format = 'excel') => {
  const response = await axiosClient.post(`/reports/college/${collegeId}`, {
    format,
    filters: {},
    includeDetails: true,
  }, {
    withCredentials: true,
  });
  return response.data;
};


// ✅ GET /reports/status/:exportLogId
export const getReportStatus = async (exportLogId) => {
  const response = await axiosClient.get(`/reports/status/${exportLogId}`, {
    withCredentials: true,
  });
  return response.data;
};

// ✅ GET /reports/download/:exportLogId
export const downloadReport = async (exportLogId) => {
  try {
    const response = await axiosClient.get(`/reports/download/${exportLogId}`, {
      responseType: 'blob',
      withCredentials: true,
    });

    // Extract filename and content type from headers
    const contentDisposition = response.headers['content-disposition'];
    const contentType = response.headers['content-type'];

    let filename = 'report';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Determine file extension based on content type
    let extension = '.csv'; // default to CSV
    if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      extension = '.xlsx';
    } else if (contentType.includes('application/vnd.ms-excel')) {
      extension = '.xls';
    }

    // Ensure filename has correct extension
    if (!filename.endsWith(extension)) {
      filename = `${filename}${extension}`;
    }

    // Create blob URL and trigger download
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Download failed:', error);
    
    // Handle error response with JSON body
    if (error.response && error.response.data instanceof Blob) {
      try {
        const errorData = JSON.parse(await error.response.data.text());
        throw new Error(errorData.message || 'Download failed');
      } catch (e) {
        throw new Error('Failed to parse error response');
      }
    }
    
    throw error;
  }
};

// ✅ GET /reports/history
export const getExportHistory = async () => {
  const response = await axiosClient.get(`/reports/history`, {
    withCredentials: true,
  });
  return response.data;
};

// ✅ DELETE /reports/:exportLogId
export const deleteExportLog = async (exportLogId) => {
  const response = await axiosClient.delete(`/reports/${exportLogId}`, {
    withCredentials: true,
  });
  return response.data;
};