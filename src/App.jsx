// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Candidate/Login'
import Assesment from "./Pages/Candidate/Assesment"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/assesment" element={<Assesment />} />
      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App
