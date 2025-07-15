import axiosClient from "../api/axiosClient";

// GET /assessments - Get all assessments
export const getallAssesment = async (params = {}) => {
  const response = await axiosClient.get(`/assessments`, {
    params, // send query as object
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};



// POST /assessments - Create a new assessment
export const createAssesment = async (formData) => {
  const response = await axiosClient.post("/assessments", formData, { withCredentials: true });
  return response.data;
};

// GET /assessments/:id - Get specific assessment details
export const getAssessmentById = async (id) => {
  const response = await axiosClient.get(`/assessments/${id}`, { withCredentials: true });
  return response.data;
};

// PUT /assessments/:id - Update assessment
export const updateAssessment = async (id, formData) => {
  const response = await axiosClient.put(`/assessments/${id}`, formData, { withCredentials: true });
  return response.data;
};

// DELETE /assessments/:id - Soft delete assessment
export const deleteAssessment = async (id) => {
  const response = await axiosClient.delete(`/assessments/${id}`, { withCredentials: true });
  console.log(response);
  
  return response.data;
};

// POST /assessments/:id/clone - Clone an assessment
export const cloneAssessment = async (id) => {
  const response = await axiosClient.post(`/assessments/${id}/clone`, {}, { withCredentials: true });
  return response.data;
};

// PUT /assessments/:id/activate - Toggle assessment active status
export const toggleAssessmentStatus = async (id, isActive) => {
  const response = await axiosClient.put(
    `/assessments/${id}/activate`,
    { isActive }, // ✅ correct body
    { withCredentials: true }
  );
  return response.data;
};

// GET /assessments/:id/preview - Preview assessment
export const previewAssessment = async (id) => {
  const response = await axiosClient.get(`/assessments/${id}/preview`, { withCredentials: true });
  console.log(response);
  
  return response.data;
};

// POST /assessments/:id/assign-sections - Assign sections to assessment
export const assignSectionsToAssessment = async (id, sectionData) => {
  const response = await axiosClient.post(`/assessments/${id}/assign-sections`, sectionData, {
    withCredentials: true,
  });
  return response.data;
};

