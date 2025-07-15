import axiosClient from "../api/axiosClient";

// 🔹 GET all questions in a section
export const getQuestionsBySection = async (sectionID) => {
  const response = await axiosClient.get(`/questions/sections/${sectionID}/questions`, {
    withCredentials: true,
  });
  return response.data;
};

// 🔹 POST a new question to a section
export const createQuestionInSection = async (sectionID, questionData) => {
  const response = await axiosClient.post(
    `/questions/sections/${sectionID}/questions`,
    questionData,
    { withCredentials: true }
  );
  return response.data;
};

// 🔹 GET question by ID
export const getQuestionById = async (id) => {
  const response = await axiosClient.get(`/questions/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

// 🔹 PUT update question by ID
export const updateQuestion = async (id, updatedData) => {
  const response = await axiosClient.put(`/questions/${id}`, updatedData, {
    withCredentials: true,
  });
  return response.data;
};

// 🔹 DELETE question by ID
export const deleteQuestion = async (id) => {
  const response = await axiosClient.delete(`/questions/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

// 🔹 POST bulk import questions (via file upload)
export const bulkImportQuestions = async (formData) => {
  const response = await axiosClient.post("/questions/bulk-import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return response.data;
};

// 🔹 POST add test cases to a coding question
export const addTestCasesToCodingQuestion = async (questionId, testCases) => {
  const response = await axiosClient.post(
    `/questions/${questionId}/test-cases`,
    testCases,
    { withCredentials: true }
  );
  return response.data;
};

// 🔹 PUT reorder a question (change sequence)
export const reorderQuestion = async (questionId, newOrderData) => {
  const response = await axiosClient.put(
    `/questions/${questionId}/reorder`,
    newOrderData,
    { withCredentials: true }
  );
  return response.data;
};
