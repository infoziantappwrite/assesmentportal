import axiosClient from "../api/axiosClient";

// GET /assessments - Get all assessments

export const getMyAssignments = async () => {
  const response = await axiosClient.get(`/submissions/my-assignments`, {
    withCredentials: true,
  });
  //console.log(response.data);
  return response.data;
};

export const getSubmissionById = async (id) => {
  const response = await axiosClient.get(`/submissions/${id}`, {
    withCredentials: true,
  });
  //console.log(response.data);
  return response.data;
};


export const startSubmission = async (assignmentId) => {
  const response = await axiosClient.post(`/submissions/start/${assignmentId}`, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};


export const resumeSubmission = async (submissionId) => {
  console.log(submissionId)
  const response = await axiosClient.put(`/submissions/resume/${submissionId}`, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};

