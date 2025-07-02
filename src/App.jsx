// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Candidate/Login'
import Assesment from "./Pages/Candidate/Assesment/Assesment";
import Dashboard from './Pages/Candidate/Dashboard/Dashboard';
import Report from './Pages/Candidate/Dashboard/Report';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/report" element={<Report />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<Assesment />} />
      
      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App
