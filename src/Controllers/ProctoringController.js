import axiosClient from "../api/axiosClient";

// Get all groups
export const logEvent = async (payload) => {
    //console.log(payload)
    try {
        
        const response = await axiosClient.post(`/proctoring/log-event`, payload, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error in logevent", error);
        throw error;
    }
};