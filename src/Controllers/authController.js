// src/controllers/authController.js

import { USERS } from '../data/loginData';

/**
 * Simulates login against local mock data
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export const loginUser = (email, password) => {
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
   localStorage.setItem('userInfo', JSON.stringify(user));

  return {
    success: true,
    message: 'Login successful',
    user,
  };
};

/**
 * Logout user by clearing localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

/**
 * Get current logged-in user from localStorage
 * @returns {object|null}
 */
export const getUser = () => {
  const stored = localStorage.getItem('userInfo');
  return stored ? JSON.parse(stored) : null;
};