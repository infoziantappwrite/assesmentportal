import axiosClient from "../api/axiosClient";

// GET /assignments - Get all assignments with pagination/filtering
export const getAllAssignments = async (params = {}) => {
  //console.log(params)
  const response = await axiosClient.get("/assignments", {
    params,
    withCredentials: true,
  });
  //console.log(response.data)
  return response.data;
};

// POST /assignments - Create a new assignment
export const createAssignment = async (data) => {
  console.log(data)
  const response = await axiosClient.post("/assignments", data, {
    withCredentials: true,
  });
  return response.data;
};

// GET /assignments/:id - Get assignment by ID
export const getAssignmentById = async (id) => {
  const response = await axiosClient.get(`/assignments/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

// PUT /assignments/:id - Update assignment
export const updateAssignment = async (id, data) => {
  const response = await axiosClient.put(`/assignments/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

// DELETE /assignments/:id - Cancel assignment
export const cancelAssignment = async (id) => {
  const response = await axiosClient.delete(`/assignments/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

// POST /assignments/:id/activate - Activate assignment
export const activateAssignment = async (id) => {
  const response = await axiosClient.post(`/assignments/${id}/activate`, {}, {
    withCredentials: true,
  });
  return response.data;
};

// GET /assignments/:id/eligible-students - Get eligible students
export const getEligibleStudents = async (id) => {
  const response = await axiosClient.get(`/assignments/${id}/eligible-students`, {
    withCredentials: true,
  });
  return response.data;
};

// GET /assignments/:id/submissions - Get all submissions
export const getSubmissions = async (id,status, page = 1, limit = 10) => {
  //console.log(status)
  const response = await axiosClient.get(`/assignments/${id}/submissions`, {
    withCredentials: true,
    params: { status,page, limit },
  });
  //console.log(response)
    
  return response.data;
};

// POST /assignments/:id/extend-deadline - Extend deadline
export const extendDeadline = async (id, data) => {
  const response = await axiosClient.post(`/assignments/${id}/extend-deadline`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const changeAssignmentStatus = async (id, status) => {
  const response = await axiosClient.post(`/assignments/${id}/update-status`, { status }, {
    withCredentials: true,
  });
  return response.data;
};


// GET /results/submission/:submissionId - Calculate & fetch results for a submission
export const calculateResultsForSubmission = async (submissionId) => {
  const response = await axiosClient.get(`/results/submission/${submissionId}`, {
    withCredentials: true,
  });

  console.log(response);
  
  return response.data;
};

// GET /results/assignment/:assignmentId - Get overall results for an assignment
export const getAssignmentResults = async (assignmentId) => {
  const response = await axiosClient.get(`/results/assignment/${assignmentId}`, {
    withCredentials: true,
  });
  //console.log(response);
  
  return response.data;
};

// POST /assignments/:id/submit-all - Submit all in-progress submissions
export const submitAllSubmissions = async (assignmentId) => {
  const response = await axiosClient.post(`/assignments/${assignmentId}/submit-all`, {}, {
    withCredentials: true,
  });
  return response.data;
};

