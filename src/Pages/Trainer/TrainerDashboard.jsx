import React from 'react';
import TrainerGroups from './components/TrainerGroups';
import TrainerAssessments from './components/TrainerAssessments';
import TrainerAssignments from './components/TrainerAssignments';
import TrainerAnalytics from './components/TrainerAnalytics';
import TrainerNotifications from './components/TrainerNotifications';
import TrainerSummaryCards from './components/TrainerSummaryCards';

const TrainerDashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Trainer Dashboard</h1>
      <TrainerSummaryCards />
      <TrainerAnalytics />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrainerGroups />
       
        <TrainerAssignments />
         <TrainerAssessments />
        <TrainerNotifications />
      </div>
      
    </div>
  );
};

export default TrainerDashboard;
