import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

const ManageAssesment = () => {
  const navigate = useNavigate();
  const { role } = useUser();
  return (
    <div>
      <h1>Manage Assessments</h1>
      <p>This page will allow you to manage assessments.</p>
      <button onClick={() => navigate(`/${role}/assessment/create`)} className="bg-blue-500 text-white px-4 py-2 rounded"> 
        Create New Assessment
      </button>
      
      <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">   
        View All Assessments
      </button>
    </div>
  )
}

export default ManageAssesment
