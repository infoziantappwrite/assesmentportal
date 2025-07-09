// src/Controllers/userControllers.js
import axiosClient from "../api/axiosClient";

// Get all users
export const getAllUsers = async (params = {}) => {
  const response = await axiosClient.get('/users', { params });
  console.log("Response from getAllUsers:", response.data);
  return response.data;
};


// Create a new user
export const createUser = async (userData) => {
  const response = await axiosClient.post('/users', userData);
  console.log("Response from createUser:", response.data);
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await axiosClient.get(`/users/${id}`);
  console.log(response.data)
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
export const activateUserById = async (id) => {
  const response = await axiosClient.put(`/users/${id}/activate`);
  return response.data;
};

// Reset user password
export const resetUserPassword = async (id, password) => {
  const response = await axiosClient.put(`/users/${id}/reset-password`, { password });
  return response.data;
};

// Bulk create candidates
export const createCandidatesBulk = async (bulkData) => {
  console.log("Bulk data to create candidates:", bulkData);
  const response = await axiosClient.post('/users/bulk-create', bulkData);
  //console.log("Response from createCandidatesBulk:", response.data);
  return response.data;
};
