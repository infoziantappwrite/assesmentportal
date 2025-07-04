/* eslint-disable react-refresh/only-export-components */
// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';
import { logoutUser as clearUserInfo,getUser } from '../Controllers/authController';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUser());

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    clearUserInfo();
    setUser(null);
  };

  // Get role from user
  const role = user?.role || null;

  return (
    <UserContext.Provider value={{ user, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => useContext(UserContext);
