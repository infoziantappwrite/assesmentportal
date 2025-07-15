import axiosClient from "../api/axiosClient";

// 🔹 GET all sections of a specific assessment
export const getSectionsByAssessmentId = async (assessmentID) => {
  const res = await axiosClient.get(`/sections/assessments/${assessmentID}/sections`, {
    withCredentials: true,
  });
  return res.data;
};

// 🔹 POST create a new section for an assessment
export const createSection = async (assessmentID, formData) => {
  const res = await axiosClient.post(`/sections/assessments/${assessmentID}/sections`, formData, {
    withCredentials: true,
  });
  return res.data;
};

// 🔹 GET a specific section by ID
export const getSectionById = async (id) => {
  const res = await axiosClient.get(`/sections/${id}`, {
    withCredentials: true,
  });
  
  return res.data;
};

// 🔹 PUT update a section by ID
export const updateSection = async (id, formData) => {
  const res = await axiosClient.put(`/sections/${id}`, formData, {
    withCredentials: true,
  });
  return res.data;
};

// 🔹 DELETE a section by ID
export const deleteSection = async (id) => {
  const res = await axiosClient.delete(`/sections/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

// 🔹 PUT reorder section
export const reorderSection = async (id, orderData) => {
  const res = await axiosClient.put(`/sections/${id}/reorder`, orderData, {
    withCredentials: true,
  });
  return res.data;
};

// 🔹 PUT toggle section status
export const updateSectionStatus = async (id, status) => {
  const res = await axiosClient.put(`/sections/${id}/status`, { status }, {
    withCredentials: true,
  });
  return res.data;
};

// 🔹 POST add question to section
export const addQuestionToSection = async (sectionId, questionData) => {
  const res = await axiosClient.post(`/sections/${sectionId}/questions`, questionData, {
    withCredentials: true,
  });
  return res.data;
};
