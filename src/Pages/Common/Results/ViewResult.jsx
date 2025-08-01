import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentById, getAssignmentResults } from '../../../Controllers/AssignmentControllers';
import Loader from '../../../Components/Loader';
import Submissions from '../../Admin/Assignments/Submissions';
import AssignmentResults from './AssignmentResults';
import AssignmentDetails from './AssignmentDetails';

const ViewResult = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingAssignment, setLoadingAssignment] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);

  const fetchAssignment = async () => {
    try {
      const response = await getAssignmentById(id);
      setAssignment(response.data.assignment);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoadingAssignment(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await getAssignmentResults(id);
      setResults(response.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
    fetchResults();
  }, [id]);

  if (loadingAssignment || loadingResults) return <Loader />;
  if (!assignment) return <div className="text-red-500 p-6">Assignment not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Assignment Details */}
      <AssignmentDetails assignment={assignment} />

      {/* Assignment Results */}
      
        <AssignmentResults results={results} />
      

      {/* Submissions */}
      
        
        <Submissions id={assignment._id} />
      
    </div>
  );
};

export default ViewResult;
