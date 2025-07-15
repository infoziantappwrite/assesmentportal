import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Importing pages
import Login from './Pages/Auth/Login';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import PageNotFound from './Components/PageNotFound';
import ResetPassword from './Pages/Auth/ResetPassword';
import PrivateRoute from './Routes/PrivateRoute';
import ProtectedLayout from './Components/ProtectedLayout';
import NotAuthorized from './Components/NotAuthorized';
import Profile from './Pages/Common/Profile/Profile';

//import Student routes
import Dashboard from "./Pages/Students/Dashboard/Dashboard";
import Assesment from "./Pages/Students/Assesment/Assesment";
import Report from "./Pages/Students/Dashboard/Report"


//import Trainer routes
import TrainerDashboard from "./Pages/Trainer/Dashboard"
import TrainerAssesment from "./Pages/Trainer/ViewTest"
import TrainerCandidateList from './Pages/Trainer/CandidateList';

//common route for Trainer and admin
import CreateTest from "./Pages/Trainer/CreateTest";
import Assignments from './Pages/Trainer/Assignments';
import AllUsers from './Pages/Admin/User/Allusers';
import CreateUser from './Pages/Admin/User/CreateUser';
import UserDetails from './Pages/Admin/User/UserDetails';

//College pages
import CollegeTestList from './Pages/Common/College/CollegeTestList';
import CandidateList from './Pages/Common/College/CandidateList';
import Groups from './Pages/Common/Groups/Groups';
import StudentDetails from './Pages/Common/Students/StudentDetails';
import StudentTable from './Pages/Common/Students/StudentTable';
import CandidatePerformance from './Pages/Common/College/CandidatePerformance';
import CollegeDashboard from './Pages/Common/College/CollegeDashboard';
import CollegeAnalytics from './Pages/Common/College/CollegeAnalytics';
import CollegeProfile from './Pages/Common/College/CollegeProfile';
import CollegeReports from './Pages/Common/College/CollegeReports';
import ManageColleges from './Pages/Admin/College/ManageColleges';
import ViewCollege from './Pages/Admin/Buttons/ViewCollege';
import ManageGroup from './Pages/Admin/Groups/ManageGroup';
import ViewGroup from './Pages/Admin/Groups/ViewGroup';
import EditGroup from './Pages/Admin/Groups/EditGroup';

//assessment pages
import ManageAssesment from './Pages/Common/Assessment/ManageAssessment';
import CreateAssesment from './Pages/Common/Assessment/CreateAssessment';
import EditCollege from './Pages/Admin/Buttons/EditCollege';
import EditAssessment from './Pages/Common/Assessment/EditAssessment';
import ViewAssesment from './Pages/Common/Assessment/ViewAssesment';

//Assignment routes
import ManageAssignments from './Pages/Admin/Assignments/ManageAssignments';
import CreateAssignments from './Pages/Admin/Assignments/CreateAssignment';
import ViewAssignment from './Pages/Admin/Assignments/ViewAssignment';
import EditAssignment from './Pages/Admin/Assignments/EditAssignment';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
       <Route element={<PrivateRoute />}>
    <Route path="/my-profile" element={<Profile />} />
  </Route>



      {/* Private Student Routes */}
      <Route element={<PrivateRoute allowedRoles={['candidate']} />}>
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assesment" element={<Assesment />} />
        <Route path="/report" element={<Report />} />
      </Route>


      {/* Private College Routes */}
      <Route element={<PrivateRoute allowedRoles={['college']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more college-specific routes here */}
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="/college/students" element={<StudentTable />} />
          <Route path="/college/assessments" element={<CollegeTestList />} />
          <Route path="/college/submissions" element={<CandidateList />} />
          <Route path="/college/groups" element={<Groups />} />
          <Route path="/college/analytics" element={<CollegeAnalytics />} />
          <Route path="/college/reports" element={<CollegeReports />} />
          <Route path="/college/profile" element={<CollegeProfile />} />
          <Route path="college/test/:testId/candidates" element={<CandidateList />} />
          <Route path="college/test/:testId/candidate/:candidateId" element={<CandidatePerformance />} />
          <Route path="/college/students/:studentId" element={<StudentDetails />} />
        </Route>
      </Route>


      {/* Private Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more admin-specific routes here */}
          <Route path="/admin/dashboard" element={<div>Super Admin Dashboard</div>} />
          <Route path="/admin/colleges" element={<ManageColleges />} />
          <Route path="/admin/colleges/:id" element={<ViewCollege />} />
          <Route path="/admin/colleges/edit/:id" element={<EditCollege />} />
          <Route path="/admin/users" element={<AllUsers/>} />
          <Route path="/admin/users/create" element={<CreateUser/>} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/groups" element={<ManageGroup />} />
          <Route path="/admin/groups/:id" element={<ViewGroup />} />
          <Route path="/admin/groups/edit/:id" element={<EditGroup />} />
          <Route path="/admin/assessments" element={<ManageAssesment />} />
          <Route path="/admin/assessments/create" element={<CreateAssesment />} />
          <Route path="/admin/assessments/edit/:id" element={<EditAssessment />} />
          <Route path="/admin/assessments/:id" element={<ViewAssesment />} />
          <Route path="/admin/reports" element={<div>Reports</div>} />
          <Route path="/admin/settings" element={<div>Settings</div>} />
          <Route path="/admin/assignments/create" element={<CreateAssignments />} />
          <Route path="/admin/assignments" element={<ManageAssignments />} />
          <Route path="/admin/assignments/:id" element={<ViewAssignment />} />
          <Route path="/admin/assignments/edit/:id" element={<EditAssignment />} />

        </Route>
      </Route>



      {/* Private Trainer Routes */}
      <Route element={<PrivateRoute allowedRoles={['trainer']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more trainer-specific routes here */}
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/groups" element={<div>Trainer Groups</div>} />
          <Route path="/trainer/assessments" element={<TrainerAssesment />} />
          <Route path="/trainer/create-test" element={<CreateTest />} />
          <Route path="/trainer/assignments" element={<Assignments />} />
          <Route path="/trainer/submissions" element={<TrainerCandidateList />} />
          <Route path="/trainer/students" element={<StudentTable />} />
          <Route path="/trainer/analytics" element={<div>Trainer Analytics</div>} />
          <Route path="/trainer/reports" element={<div>Trainer Reports</div>} />
          <Route path="/trainer/profile" element={<div>Trainer Profile</div>} />
          <Route path="/trainer/test/:testId/candidate/:candidateId" element={<CandidatePerformance />} />
          <Route path="/trainer/students/:studentId" element={<StudentDetails />} />
        </Route>
      </Route>



      {/* Catch-all route for 404 Page Not Found */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
