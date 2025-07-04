import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // adjust path if needed

/**
 * @param {Array|string} allowedRoles - roles that can access the route
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useUser();
  console.log('PrivateRoute user:', user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
