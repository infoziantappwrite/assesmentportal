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


export const startSubmission = async (assignmentId, screenResolution = "Unknown") => {
  const response = await axiosClient.post(
    `/submissions/start/${assignmentId}`,
    {
      screen_resolution: screenResolution,
    },
    {
      withCredentials: true,
    }
  );
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
// Add to your saveAnswer function temporarily
// export const saveAnswer = async (submissionId, payload) => {
//   // Simulate random failures (70% failure rate for testing)
//   if (Math.random() < 1) {
//     await new Promise(resolve => setTimeout(resolve, 20000));
//     console.log('🚨 Simulating API failure for testing');
//     throw new Error('Simulated network error');
//   }
  
//   // Simulate slow responses
//   await new Promise(resolve => setTimeout(resolve, 20000));
  
//   // Your actual API call here
//   return saveAnswerr(submissionId, payload);
// };
export const getAnsweredStatus = async (submissionId, questionId) => {
  const response = await axiosClient.post(
    `/submissions/${submissionId}/is-already-submitted`,
    { question_id: questionId }, // match the backend expected key
    { withCredentials: true }
  );
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

export const getQuestionAnswerdStatus = async (submissionId, questionId) => {
  //console.log("Fetching answer status for submission:", submissionId, "question:", questionId);

  try {
    const response = await axiosClient.get(
      `/submissions/answered-status/${submissionId}?questionId=${questionId}`,
      { withCredentials: true }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch Question status");
    }
  } catch (error) {
    console.error("Error fetching Question answer status:", error);
    throw new Error(error.response?.data?.message || "Something went wrong while fetching Question answers.");
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
export const submitCode = async (submissionId, payload) => {
  const response = await axiosClient.post(`/submissions/${submissionId}/submit`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// Final submission - evaluate with hidden test cases
export const evaluateCodingSubmission = async (submissionId, payload) => {
  const response = await axiosClient.post(`/submissions/${submissionId}/submitCode`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// GET section-wise timing by submission ID
export const getSectionTiming = async ({ sectionID, assessmentID, assignmentID, submissionID }) => {
  const response = await axiosClient.post(
    `/submissions/section-timing/${sectionID}`,
    {
      assessmentID,
      assignmentID,
      submissionID,
    },
    { withCredentials: true }
  );
  return response.data;
};


// POST section-wise timing data
export const saveSectionTiming = async (payload) => {
  const response = await axiosClient.post(`/submissions/section-timing`, payload, {
    withCredentials: true,
  });
  return response.data;
};

// POST mark question as visited
export const questionVisited = async (payload) => {
  const response = await axiosClient.post(`/submissions/visited`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const saveTimeTaken = async (payload) => {
  const response = await axiosClient.post(`/submissions/save-time-taken`, payload, {
    withCredentials: true,
  });
  return response.data;
};


export const RunCode = async ({ source_code, language_id, stdin }) => {
  console.log('source_code:', source_code);
  console.log('language_id:', language_id);
  console.log('stdin:', stdin);
  
  const response = await axiosClient.post('/compiler/', {
    source_code,
    language_id,
    stdin,
  }, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return response.data;
};