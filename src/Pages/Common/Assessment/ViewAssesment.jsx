import React from 'react';
import { useParams,  } from "react-router-dom";

const ViewAssesment = () => {
    const { id } = useParams(); 
  return (
    <div>
        <h1>This is id :{id}</h1>
      
    </div>
  )
}

export default ViewAssesment
