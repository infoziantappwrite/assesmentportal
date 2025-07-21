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
  //console.log(response.data);
  return response.data;
};


export const resumeSubmission = async (submissionId) => {
  //console.log(submissionId)
  const response = await axiosClient.put(`/submissions/resume/${submissionId}`, {
    withCredentials: true,
  });
  //console.log(response.data);
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
  //console.log(response.data);
  return response.data;
};

// GET /submissions/my-submissions
export const getSubmissions = async () => {
  try {
    const response = await axiosClient.get('/submissions/my-submissions', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong while fetching submissions.');
  }
};

// GET /submissions/section-scores/{submissionID}
export const getSubmissionReport = async (submissionID) => {
  try {
    const response = await axiosClient.get(`/submissions/section-scores/${submissionID}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching submission report:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch submission report');
  }
};

export const getSectionWiseStatus = async (submissionID) => {
  try {
    const response = await axiosClient.get(`/submissions/section-wise-status/${submissionID}`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.data; // Keyed by section_id: answers[]
    } else {
      throw new Error(response.data.message || 'Failed to fetch section-wise status');
    }
  } catch (error) {
    console.error('Error fetching section-wise answer status:', error);
    throw new Error(error.response?.data?.message || 'Something went wrong while fetching section answers.');
  }
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
