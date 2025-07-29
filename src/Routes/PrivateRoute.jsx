import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../Components/Loader';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading , role } = useUser();

  console.log('PrivateRoute role:', role, 'allowedRoles:', allowedRoles);

  if (loading) {
    // Show a loading spinner or just null
    return <Loader />;
  }
  //console.log("PrivateRoute user:", allowedRoles,role);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  

  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   return <Navigate to="/not-authorized" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
