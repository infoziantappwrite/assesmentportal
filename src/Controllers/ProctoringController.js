import axiosClient from "../api/axiosClient";

// Log an event
export const logEvent = async (payload) => {
  try {
    const response = await axiosClient.post(`/proctoring/log-event`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in logEvent", error);
    throw error;
  }
};

// Get violations
export const getViolations = async (submissionId) => {
  try {
    const response = await axiosClient.get(`/proctoring/violations/${submissionId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in getViolations", error);
    throw error;
  }
};

// Unblock a student
export const unblockStudent = async (studentId, assignmentId) => {
  try {
    const response = await axiosClient.put(
      `/proctoring/student/${studentId}/unblock`,
      { assignmentId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in unblockStudent", error);
    throw error;
  }
};
