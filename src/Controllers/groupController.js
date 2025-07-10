import axiosClient from "../api/axiosClient";

// Get all groups
export const getAllGroups = async (params = {}) => {
  try {
    const response = await axiosClient.get("/groups", { params });
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error("Error in getAllGroups:", error);
    throw error;
  }
};

// Create new group
export const createGroup = async (groupData) => {
  try {
    const response = await axiosClient.post("/groups", groupData);
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

// Get group by ID
export const getGroupById = async (id) => {
  try {
    const response = await axiosClient.get(`/groups/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getGroupById:", error);
    throw error;
  }
};

// ✅ Add this
export const updateGroupById = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/groups/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
};


export const deleteGroupById = async (id) => {
  return await axiosClient.delete(`/groups/${id}`);
};

export const addStudentsToGroup = async (groupId, studentIds) => {
  return axiosClient.post(`/groups/${groupId}/students`, { studentIds });
};

export const removeStudentFromGroup = async (groupId, studentId) => {
  const res = await axiosClient.delete(`/groups/${groupId}/students/${studentId}`);
  return res.data;
};

export const removeStudentsFromGroup = async (groupId, studentIds) => {
  console.log(groupId);
  console.log(studentIds);
  
  
  return await axiosClient.delete(`/groups/${groupId}/students`, {
    data: { studentIds },
  });
};