import axiosClient from "../api/axiosClient";

// Get all groups
export const logEvent = async (payload) => {
    //console.log(payload)
    try {
        
        const response = await axiosClient.post(`/proctoring/log-event`, payload, {
            withCredentials: true,
        });
        //console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error in logevent", error);
        throw error;
    }
};

export const getViolations = async (submissionId) => {
        const response = await axiosClient.get(`/proctoring/violations/${submissionId}`, {
            withCredentials: true,
        });
        return response.data;

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