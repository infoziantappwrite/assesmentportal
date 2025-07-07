// src/Controllers/authController.js
import axiosClient from "../api/axiosClient";

/**
 * Login user — backend sets token & refreshToken cookies
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axiosClient.post("/auth/login", { email, password });

    const { success, message, data } = response.data;
    //console.log("loginUser response:", response.data);

    if (success && data?.user) {
      return {
        success: true,
        message,
        user: data.user,
      };
    }

    return {
      success: false,
      message: message || "Login failed",
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
    };
  }
};

/**
 * Logout user — calls /auth/logout, backend clears cookies
 */
export const logoutUser = async () => {
  try {
    await axiosClient.post("/auth/logout");
    //console.log("User logged out successfully");
    return { success: true };
  } catch  {
    //console.error("logoutUser failed:", error);
    return {
      success: false,
      message: "Logout failed",
    };
  }
};

/**
 * Get logged-in user — calls /auth/me
 */
export const getUser = async () => {
  try {
    const response = await axiosClient.get("/auth/me");
    return response.data?.data?.user || null;
  } catch  {
    //console.error("getUser failed:", error);
    return null;
  }
};

/**
 * Refresh token — calls /auth/refresh (cookies)
 */
export const refreshToken = async () => {
  try {
    const response = await axiosClient.post("/auth/refresh");
    //onsole.log("refreshToken response:", response.data);

    const { success } = response.data;

    if (success) {
      return { success: true };
    }

    return {
      success: false,
      message: "Token refresh failed",
    };
  } catch  {
    //console.error("refreshToken failed:", error);
    return {
      success: false,
      message: "Token refresh error",
    };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    console.log('requestPasswordReset response:', response.data);
    return {
      success: true,
      message: response.data?.message || 'Reset link sent.',
    };
  } catch (error) {
    console.error('requestPasswordReset error:', error);
    return {
      success: false,
      message:
        error?.response?.data?.message || 'Failed to send reset link. Please try again.',
    };
  }
};

/**
 * Reset password by sending token and new password
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const resetPasswordAPI = async (token, newPassword) => {
  try {
    const response = await axiosClient.post('/auth/reset-password', {
      token,
      newPassword,
    });

    return {
      success: true,
      message: response.data?.message || 'Password reset successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Failed to reset password. Please try again.',
    };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axiosClient.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return { success: true, message: response.data.message };
  } catch (err) {
    return {
      success: false,
      message:
        err?.response?.data?.message || "Failed to change password. Please try again.",
    };
  }
};