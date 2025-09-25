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

// POST /reports/assignment/:assignmentId
export const generateAssignmentReport = async (finalPayload, format = "excel") => {
  // Build request body
  const requestBody = {
    format,
    includeDetails: true,
  };

  if (finalPayload.targetColleges?.length) {
    requestBody.targetColleges = finalPayload.targetColleges;
  }
  if (finalPayload.targetGroups?.length) {
    requestBody.targetGroups = finalPayload.targetGroups;
  }
  if (finalPayload.targetStudents?.length) {
    requestBody.targetStudents = finalPayload.targetStudents;
  }

  const response = await axiosClient.post(
    `/reports/assignment/${finalPayload.assignmentId}`,
    requestBody,
    { withCredentials: true }
  );

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

  // POST /reports/user/:userId
  export const generateUserReport = async (userId, format = 'excel') => {
  const response = await axiosClient.post(
    `/reports/user/${userId}`,
    {
      format,
      filters: {},           // Customize if needed
      includeDetails: true,  // Include detailed data in report
    },
    {
      withCredentials: true, // For session/cookie-based auth
    }
  );
  return response.data;
};


export const generateUserActivityReport = async (submissionId, format = 'excel') => {
  const response = await axiosClient.post(`/reports/user-activity/${submissionId}`, {
    format,
    filters: {}, // You can extend this later if you want filtering
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
export const downloadReport = async (exportLogId, name) => {
  try {
    const response = await axiosClient.get(`/reports/download/${exportLogId}`, {
      responseType: 'blob',
      withCredentials: true,
    });

    // Extract filename and content type from headers
    const contentDisposition = response.headers['content-disposition'];
    const contentType = response.headers['content-type'];
    let filename = name.split("_").map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ") || 'report';
    if (contentDisposition && !name) {
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
  console.log(response);
  
  return response.data;
};

// ✅ DELETE /reports/:exportLogId
export const deleteExportLog = async (exportLogId) => {
  const response = await axiosClient.delete(`/reports/${exportLogId}`, {
    withCredentials: true,
  });
  return response.data;
};