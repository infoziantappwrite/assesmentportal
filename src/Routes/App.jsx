// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Auth imports
import Login from './Pages/Auth/Login'



const App = () => {
  return (
    <Routes>
      
      
      {/* Auth routes start here */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<><div>Forget Password</div></>} />
      <Route path="/reset-password" element={<><div>Reset Password</div></>} />
      {/* Auth routes end here */}
      

      {/* Students routes start here */}

      






      {/* <Route path="/report" element={<Report />} />
      <Route path="/dashboard" element={<Dashboard1 />} />
      <Route path="/assessment" element={<Assesment />} /> */}
      {/* Add more routes as needed */}

      {/* <Route path="/groups" element={<Groups />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/view-group" element={<ViewGroup />} />
      <Route path="/edit-group" element={<EditGroups />} /> */}
      {/* Dashboard routes with layout */}
      
        {/* Candidate Routes */}
        {/* <Route path="candidate/dashboard" element={<><h2>Candidate Dashboard</h2></>} />
        <Route path="candidate/assessments" element={<><h2>Candidate Assessments</h2></>} />
        <Route path="candidate/results" element={<><h2>Candidate Results</h2></>} />
        <Route path="candidate/courses" element={<><h2>Candidate Courses</h2></>} /> */}

        {/* Admin Routes */}
        {/* <Route path="admin/dashboard" element={<><h2>Admin Dashboard</h2></>} />
        <Route path="admin/manage-candidates" element={<><h2>Manage Candidates</h2></>} />
        <Route path="admin/manage-assessments" element={<><h2>Manage Assessments</h2></>} />
        <Route path="admin/reports" element={<><h2>Reports</h2></>} />
        <Route path="admin/settings" element={<><h2>Settings</h2></>} />
        <Route path="admin/students" element={<StudentTable />} /> */}

        {/* Trainer Routes */}
        {/* <Route path="trainer/dashboard" element={<Dashboard />} />
        <Route path="trainer/create-test" element={<CreateTest />} />
        <Route path="trainer/view-test" element={<ViewTest />} />
        <Route path="trainer/students" element={<StudentTable />} />
        <Route path="/college/students/:id" element={<StudentDetails />} /> */}


        {/* College Routes */}
        {/* <Route path="college/dashboard" element={<><h2>College Dashboard</h2></>} />
        <Route path="college/departments" element={<><h2>Departments</h2></>} />
        <Route path="college/trainers" element={<><h2>Manage Trainers</h2></>} />
        <Route path="college/students" element={<StudentTable />} /> */}
    

      {/* <Route path="college/tests" element={<CollegeTestList />} />
      <Route path="college/test/:testId/candidates" element={<CandidateList />} />
      <Route path="college/test/:testId/candidate/:candidateId" element={<CandidatePerformance />} /> */}

      {/* Redirect unknown routes */}
     
        
      {/* College Routes */}
      {/* <Route path="/college/mycollege/profile" element={<CollegeProfile />} /> */}

      {/* Trainer Route  */}
{/* 
      <Route path="/trainer/login" element={<TrainerLogin />} />
      <Route path="/trainer/colleges" element={<CollegeList_Trainer />} />
      <Route path="/trainer/college/profile" element={<CollegeProfile_Trainer />} /> */}

      {/* Admin Routes */}
      {/* <Route path="/admin/colleges" element={<CollegeList_Admin />} />
      <Route path="/admin/college/profile" element={<CollegeProfile_Admin />} />
      <Route path="/admin/create/college" element={<CreateCollege />} /> */}
      
      {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
