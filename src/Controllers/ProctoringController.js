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

// Unblock all students for an assignment
export const unblockAllStudents = async (assignmentId) => {
  try {
    const response = await axiosClient.put(
      `/proctoring/assignment/${assignmentId}/unblock`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in unblockAllStudents", error);
    throw error;
  }
};

// Get proctoring violations for a submission
export const getViolationsBySubmission = async (submissionId) => {
  try {
    const response = await axiosClient.get(
      `/proctoring/violations/${submissionId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getViolationsBySubmission", error);
    throw error;
  }
};

// Get student's proctoring history
export const getStudentHistory = async (studentId) => {
  try {
    const response = await axiosClient.get(
      `/proctoring/student/${studentId}/history`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getStudentHistory", error);
    throw error;
  }
};

// Review and take action on a proctoring violation
export const reviewViolation = async (violationId, action, notes) => {
  try {
    const response = await axiosClient.put(
      `/proctoring/violations/${violationId}/review`,
      { action, notes },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in reviewViolation", error);
    throw error;
  }
};
