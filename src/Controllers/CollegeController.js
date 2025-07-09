import axios from "axios";

const API_BASE = "https://assessment-platform-jua0.onrender.com/api/v1";

export const getAllColleges = async () => {
  const res = await axios.get(`${API_BASE}/colleges`, { withCredentials: true });
  return res.data.data.colleges || [];
};

export const getCollegeById = async (id) => {
  const res = await axios.get(`${API_BASE}/colleges/${id}`, { withCredentials: true });
  return res.data.data.college;
};

export const getStudentsByCollegeId = async (id) => {
  const res = await axios.get(`${API_BASE}/colleges/${id}/students`, {
    withCredentials: true,
  });
  return res.data.data.students || [];
};

export const createCollege = async (formData) => {
  const res = await axios.post(`${API_BASE}/colleges`, formData, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteCollege = async (id) => {
  const res = await axios.delete(`${API_BASE}/colleges/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
