// src/utils/authUtils.js

export const saveUserData = (user) => {
  localStorage.setItem('userInfo', JSON.stringify(user));
};

export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user?.role || null;
};

export const clearUserData = () => {
  localStorage.removeItem('userInfo');
};

export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('userInfo'));
};
