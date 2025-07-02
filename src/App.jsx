// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Candidate/Login'
import CollegeLogin from "./Pages/College/CollegeLogin"
import AdminLogin from "./Pages/Admin/AdminLogin"
import Assesment from "./Pages/Candidate/Assesment"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/college-login" element={<CollegeLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/assesment" element={<Assesment />} />
      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App
