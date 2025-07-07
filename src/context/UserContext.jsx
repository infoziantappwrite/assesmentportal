/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUser, logoutUser } from '../Controllers/authController'; // import logoutUser

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // blocks routing until user fetch completes

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUser(); // fetch from /auth/me
        if (userData) {
          setUser(userData); // set user if logged in
        }
      } catch {
        // optionally handle error
      } finally {
        setLoading(false); // unblock UI after attempt
      }
    };

    loadUser();
  }, []);
  const login = (userData) => {
    setUser(userData); // set user after successful login
  };
  
  
  const logout = async () => {
    try {
      await logoutUser(); // call backend to clear cookies
    } catch (err) {
      console.error('Logout failed:', err);
    }
    setUser(null); // clear user from context
  };

  const role = user?.role || null;

  return (
    <UserContext.Provider value={{ user, role, loading, logout,login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
