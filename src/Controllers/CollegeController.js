
import axiosClient from "../api/axiosClient";

export const getAllColleges = async () => {
  const res = await axiosClient.get(`/colleges`, { withCredentials: true });
  return res.data.data.colleges || [];
};

export const getCollegeById = async (id) => {
  const res = await axiosClient.get(`/colleges/${id}`, { withCredentials: true });
  return res.data.data.college;
};

export const getStudentsByCollegeId = async (id) => {
  const res = await axiosClient.get(`/colleges/${id}/students`, {
    withCredentials: true,
  });
  return res.data.data.students || [];
};

export const createCollege = async (formData) => {
  const res = await axiosClient.post(`/colleges`, formData, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteCollege = async (id) => {
  const res = await axiosClient.delete(`/colleges/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const assignCollegeRepresentative = async (collegeId, representativeID) => {
  const res = await axiosClient.post(
    `/colleges/${collegeId}/assign-representative`,
    { representativeID },
    { withCredentials: true }
  );
  return res.data;
};

