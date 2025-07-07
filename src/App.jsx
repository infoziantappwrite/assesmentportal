import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Importing pages
import Login from './Pages/Auth/Login';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import PageNotFound from './Components/PageNotFound';
import ResetPassword from './Pages/Auth/ResetPassword';
import PrivateRoute from './Routes/PrivateRoute';
import ProtectedLayout from './Components/ProtectedLayout';
import NotAuthorized from './Components/NotAuthorized';
import Profile from './Pages/Common/Profile/Profile';

//import Student routes
import Dashboard from "./Pages/Students/Dashboard/Dashboard";
import Assesment from "./Pages/Students/Assesment/Assesment";
import Report from "./Pages/Students/Dashboard/Report"



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
       <Route element={<PrivateRoute />}>
    <Route path="/my-profile" element={<Profile />} />
  </Route>



      {/* Private Student Routes */}
      <Route element={<PrivateRoute allowedRoles={['candidate']} />}>
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assesment" element={<Assesment />} />
        <Route path="/report" element={<Report />} />
      </Route>


      {/* Private College Routes */}
      <Route element={<PrivateRoute allowedRoles={['college']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more college-specific routes here */}
          <Route path="/college/dashboard" element={<div>College Dashboard</div>} />
          <Route path="/college/courses" element={<div>College Courses</div>} />
          <Route path="/college/trainers" element={<div>College Trainers</div>} />
          <Route path="/college/students" element={<div>College Students</div>} />
          <Route path="/college/assessments" element={<div>College Assessments</div>} />
          <Route path="/college/submissions" element={<div>College Submissions</div>} />
          <Route path="/college/groups" element={<div>College Groups</div>} />
          <Route path="/college/analytics" element={<div>College Analytics</div>} />
          <Route path="/college/reports" element={<div>College Reports</div>} />
          <Route path="/college/profile" element={<div>College Profile</div>} />
        </Route>
      </Route>


      {/* Private Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more admin-specific routes here */}
          <Route path="/admin/dashboard" element={<div>Super Admin Dashboard</div>} />
          <Route path="/admin/colleges" element={<div>Manage Colleges</div>} />
          <Route path="/admin/users" element={<div>Manage Users</div>} />
          <Route path="/admin/reports" element={<div>Reports</div>} />
          <Route path="/admin/settings" element={<div>Settings</div>} />
        </Route>
      </Route>



      {/* Private Trainer Routes */}
      <Route element={<PrivateRoute allowedRoles={['trainer']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more trainer-specific routes here */}
          <Route path="/trainer/dashboard" element={<div>Trainer Dashboard</div>} />
          <Route path="/trainer/groups" element={<div>Trainer Groups</div>} />
          <Route path="/trainer/assessments" element={<div>Trainer Assessments</div>} />
          <Route path="/trainer/assignments" element={<div>Trainer Assignments</div>} />
          <Route path="/trainer/submissions" element={<div>Trainer Submissions</div>} />
          <Route path="/trainer/students" element={<div>Trainer Students</div>} />
          <Route path="/trainer/analytics" element={<div>Trainer Analytics</div>} />
          <Route path="/trainer/reports" element={<div>Trainer Reports</div>} />
          <Route path="/trainer/profile" element={<div>Trainer Profile</div>} />
        </Route>
      </Route>



      {/* Catch-all route for 404 Page Not Found */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
