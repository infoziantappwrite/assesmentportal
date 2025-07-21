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
  //console.log(submissionId)
  const response = await axiosClient.put(`/submissions/resume/${submissionId}`, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};

export const saveAnswer = async (submissionId, payload) => {
  const response = await axiosClient.put(`/submissions/${submissionId}/save-answer`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const getAnsweredStatus = async (submissionId, questionId) => {
  const response = await axiosClient.get(`/submissions/answered-status/${submissionId}`, {
    params: { questionId },
    withCredentials: true,
  });
  return response.data;
};


export const submitSubmission = async (submissionId) => {
  const response = await axiosClient.post(`/submissions/${submissionId}/submit`, {}, {
    withCredentials: true,
  });
  return response.data;
};




//Coding part 


// Save coding answer (draft, not final)
export const saveCodingAnswer = async (submissionId, payload) => {
  const response = await axiosClient.put(`/submissions/${submissionId}/save-answer`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// Run sample test cases before final submission
export const runSampleTestCases = async (questionId, payload) => {
  const response = await axiosClient.post(`/submissions/test-cases/${questionId}`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// Submit final code (runs hidden test cases, locks submission)
export const submitCodeForEvaluation = async (submissionId, payload) => {
  const response = await axiosClient.post(`/submissions/${submissionId}/submitCode`, payload, {
    withCredentials: true,
  });
  return response.data;
};