// src/Controllers/userControllers.js
import axiosClient from "../api/axiosClient";

// Get all users
export const getAllUsers = async (params = {}) => {
  const response = await axiosClient.get('/users', { params });
  //console.log("Response from getAllUsers:", response.data);
  return response.data;
};


// Create a new user
export const createUser = async (userData) => {
  const response = await axiosClient.post('/users', userData);
  //console.log("Response from createUser:", response.data);
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await axiosClient.get(`/users/${id}`);
  //console.log(response.data)
  return response.data;
};

// Update user by ID
export const updateUserById = async (id, userData) => {
  const response = await axiosClient.put(`/users/${id}`, userData);
  return response.data;
};

// Delete user by ID
export const deleteUserById = async (id) => {
  
  const response = await axiosClient.delete(`/users/${id}`);
  
  return response.data;
};

// Activate user by ID
// frontend: userControllers.js
export const activateUserById = async (id, status) => {
  const response = await axiosClient.put(
    `/users/${id}/activate`,
    { status }, // ✅ send properly structured body
    { withCredentials: true } // optional if needed
  );
  return response.data;
};


// Reset user password
export const resetUserPassword = async (id, password) => {
  const response = await axiosClient.put(`/users/${id}/reset-password`, { password });
  return response.data;
};

// Bulk create candidates
export const createCandidatesBulk = async (bulkData) => {
  //console.log("Bulk data to create candidates:", bulkData);
  const response = await axiosClient.post('/users/bulk-create', bulkData);
  //console.log("Response from createCandidatesBulk:", response.data);
  return response.data;
};

// Get assigned colleges
export const getAssignedColleges = async (userId) => {
  const response = await axiosClient.get(`/users/${userId}/assigned-colleges`);
  return response.data;
};

// Add assigned colleges
export const addAssignedColleges = async (userId, collegeIds) => {
  const response = await axiosClient.post(`/users/${userId}/assigned-colleges`, { collegeIds });
  return response.data;
};

// Remove specific assigned colleges
export const removeAssignedColleges = async (userId, collegeIds) => {
  const response = await axiosClient.put(`/users/${userId}/assigned-colleges`, { collegeIds });
  return response.data;
};

// Delete all assigned colleges
export const deleteAssignedColleges = async (userId) => {
  const response = await axiosClient.delete(`/users/${userId}/assigned-colleges`);
  return response.data;
};

// Get assigned groups
export const getAssignedGroups = async (userId) => {
  const response = await axiosClient.get(`/users/${userId}/assigned-groups`);
  return response.data;
};

// Add assigned groups
export const addAssignedGroups = async (userId, groupIds) => {
  const response = await axiosClient.post(`/users/${userId}/assigned-groups`, { groupIds });
  return response.data;
};

// Remove specific assigned groups
export const removeAssignedGroups = async (userId, groupIds) => {
  const response = await axiosClient.put(`/users/${userId}/assigned-groups`, { groupIds });
  return response.data;
};

// Delete all assigned groups
export const deleteAssignedGroups = async (userId) => {
  const response = await axiosClient.delete(`/users/${userId}/assigned-groups`);
  return response.data;
};
