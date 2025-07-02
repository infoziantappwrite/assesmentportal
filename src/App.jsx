// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './Pages/Candidate/Login'
import Assesment from "./Pages/Candidate/Assesment/Assesment";
import Dashboard from './Pages/Candidate/Dashboard/Dashboard';
import Report from './Pages/Candidate/Dashboard/Report';
import CollegeLogin from "./Pages/College/CollegeLogin"
import AdminLogin from "./Pages/Admin/AdminLogin"
import Assesment from "./Pages/Candidate/Assesment"
import DashboardLayout from './Pages/Dashboard/DashboardLayout'

//College side
import CollegeTestList from './Pages/College/CollegeTestList'
import CandidateList from './Pages/College/CandidateList'
import CandidatePerformance from './Pages/College/CandidatePerformance'
//Trainer side
import Trainer from "./Pages/Trainer/Trainer"
import Dashboard from './Pages/Trainer/Dashboard'
import CreateTest from './Pages/Trainer/CreateTest'
import ViewTest from './Pages/Trainer/ViewTest'
import TrainerLogin from './Pages/Trainer/TrainerLogin'


const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/report" element={<Report />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<Assesment />} />
      
      {/* Add more routes as needed */}
      <Route path="/college-login" element={<CollegeLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/assesment" element={<Assesment />} />

      {/* Dashboard routes with layout */}
      <Route element={<DashboardLayout />}>
        {/* Candidate Routes */}
        <Route path="candidate/dashboard" element={<><h2>Candidate Dashboard</h2></>} />
        <Route path="candidate/assessments" element={<><h2>Candidate Assessments</h2></>} />
        <Route path="candidate/results" element={<><h2>Candidate Results</h2></>} />
        <Route path="candidate/courses" element={<><h2>Candidate Courses</h2></>} />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<><h2>Admin Dashboard</h2></>} />
        <Route path="admin/manage-candidates" element={<><h2>Manage Candidates</h2></>} />
        <Route path="admin/manage-assessments" element={<><h2>Manage Assessments</h2></>} />
        <Route path="admin/reports" element={<><h2>Reports</h2></>} />
        <Route path="admin/settings" element={<><h2>Settings</h2></>} />

        {/* Trainer Routes */}
        <Route path="trainer/dashboard" element={<><h2>Trainer Dashboard</h2></>} />
        <Route path="trainer/assigned-assessments" element={<><h2>Assigned Assessments</h2></>} />
        <Route path="trainer/evaluation" element={<><h2>Evaluation</h2></>} />
        <Route path="trainer/students" element={<><h2>Manage Students</h2></>} />

        {/* College Routes */}
        <Route path="college/dashboard" element={<><h2>College Dashboard</h2></>} />
        <Route path="college/departments" element={<><h2>Departments</h2></>} />
        <Route path="college/trainers" element={<><h2>Manage Trainers</h2></>} />
        <Route path="college/students" element={<><h2>Manage Students</h2></>} />
      </Route>

      <Route path="college/tests" element={<CollegeTestList />} />
      <Route path="college/test/:testId/candidates" element={<CandidateList />} />
      <Route path="college/test/:testId/candidate/:candidateId" element={<CandidatePerformance />} />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
        
        
        
      {/* Trainer Route  */}
      <Route path="/trainer" element={<Trainer />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-test" element={<CreateTest />} />
        <Route path="view-test" element={<ViewTest />} />
      </Route>
      <Route path="/trainer/login" element={<TrainerLogin />} />

    </Routes>
  )
}

export default App
