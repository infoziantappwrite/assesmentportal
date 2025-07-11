import axiosClient from "../api/axiosClient";

export const createAssesment = async (formData) => {
    const response = await axiosClient.post("/assessments", formData,{ withCredentials: true });
    return response.data

}
export const getallAssesment = async () => {
    const response = await axiosClient.get("/assessments", { withCredentials: true });
    return response.data
}
