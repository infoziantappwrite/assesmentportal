// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Candidate/Login'
import Assesment from "./Pages/Candidate/Assesment"
import Trainer from "./Pages/Trainer/Trainer"
import Dashboard from './Pages/Trainer/Dashboard'
import CreateTest from './Pages/Trainer/CreateTest'
import ViewTest from './Pages/Trainer/ViewTest'
import TrainerLogin from './Pages/Trainer/TrainerLogin'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/assesment" element={<Assesment />} />

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
