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
import Instruction from './Pages/Students/Assesment/Instruction';
import ThankYou from "./Pages/Students/Assesment/ThankYou";
import SubmissionList from './Pages/Students/Dashboard/SubmissionList';
import Result from './Pages/Students/Assesment/Result';
import ViewFullSubmissionForStudent from "./Pages/Students/Dashboard/ViewFullSubmissionForStudent"

//import Trainer routes
import TrainerDashboard from "./Pages/Trainer/TrainerDashboard"

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
import AssessmentPreviewPage from './Pages/Common/Assessment/AssessmentPreviewPage';
import CreateSection from './Pages/Common/Section/CreateSection';
import ViewSections from './Pages/Common/Section/ViewSections';
import SinglePageViewSection from './Pages/Common/Section/SinglePageViewSection';
import AddQuestionToSection from './Pages/Common/Section/AddQuestionToSection';
import EditSection from './Pages/Common/Section/EditSection';
import ViewQuestionsInSection from './Pages/Common/Section/ViewQuestionsInSection';
import ViewSingleQuestion from './Pages/Common/Section/ViewSingleQuestion';



//Assignment routes
import ManageAssignments from './Pages/Admin/Assignments/ManageAssignments';
import CreateAssignments from './Pages/Admin/Assignments/CreateAssignment';
import ViewAssignment from './Pages/Admin/Assignments/ViewAssignment';
import EditAssignment from './Pages/Admin/Assignments/EditAssignment';
import AddQuestionToSectionCode from './Pages/Common/Section/AddQuestionToSectionCode';
import ViewCodingQuestionsInSection from './Pages/Common/Section/ViewCodingQuestionsInSection';
import ViewFullSubmission from './Pages/Admin/Assignments/ViewFullSubmission';
import ReportsPage from './Pages/Admin/Reports/ReportsPage';
import ReportHistoryPage from './Pages/Admin/Reports/ReportHistoryPage';
// import AddQuestionToSectionAssignment from "./Pages/Common/Section/AddQuestionToSectionAssignment"
// import AddQuestionToSectionSurvey from './Pages/Common/Section/AddQuestionToSectionSurvey';


import AdminDashboard from './Pages/Admin/Dashboard/Dashboard';
import Results from './Pages/Common/Results/Results';
import ViewResult from './Pages/Common/Results/ViewResult';
import ProctoringReport from './Pages/Admin/Assignments/ProctoringReport';


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
        <Route path="/instructions" element={<Instruction />} />
        <Route path="/thank-you" element={<ThankYou/>} />
        <Route path="/result" element={<Result />} />
        <Route path="/submissions" element={<SubmissionList/>} />
        <Route path="/submissions/:submissionId" element={<ViewFullSubmissionForStudent />} />
        


      </Route>


      {/* Private College Routes */}
      <Route element={<PrivateRoute allowedRoles={['college_rep']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more college-specific routes here */}
          <Route path="/college_rep/dashboard" element={<CollegeDashboard />} />
          <Route path="/college_rep/students" element={<StudentTable />} />
          <Route path="/college_rep/assessments" element={<ManageAssesment />} />
          <Route path="/college_rep/assessments/create" element={<CreateAssesment />} />
          <Route path="/college_rep/assessments/edit/:id" element={<EditAssessment />} />
          <Route path="/college_rep/assessments/:id" element={<ViewAssesment />} />
          <Route path="/college_rep/assessments/:id/create-section" element={<CreateSection />} />
          <Route path="/college_rep/assessments/:id/sections" element={<ViewSections />} />
          <Route path="/college_rep/sections/:id" element={<SinglePageViewSection />} />
          <Route path="/college_rep/sections/edit/:id" element={<EditSection />} />
          <Route path="/college_rep/sections/:id/add-question" element={<AddQuestionToSection />} />
          <Route path="/college_rep/sections/:id/add-question-code" element={<AddQuestionToSectionCode />} />
          <Route path="/college_rep/assignments" element={<ManageAssignments />} />
          <Route path="/college_rep/assignments/:id" element={<ViewAssignment />} />
          <Route path="/college_rep/assignments/edit/:id" element={<EditAssignment />} />
          <Route path="/college_rep/submissions" element={<CandidateList />} />
          <Route path="/college_rep/groups" element={<ManageGroup />} />
          <Route path="/college_rep/groups/:id" element={<ViewGroup />} />
          <Route path="/college_rep/analytics" element={<CollegeAnalytics />} />
          <Route path="/college_rep/reports" element={<ReportsPage />} />
          <Route path="/college_rep/profile" element={<CollegeProfile />} />
          <Route path="college_rep/test/:testId/candidates" element={<CandidateList />} />
          <Route path="college_rep/test/:testId/candidate/:candidateId" element={<CandidatePerformance />} />
          <Route path="/college_rep/students/:studentId" element={<StudentDetails />} />
          <Route path='/college_rep/results' element={<Results/>}/>
          <Route path="/college_rep/result/:id" element={<ViewResult />} />
        </Route>
      </Route>


      {/* Private Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more admin-specific routes here */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/colleges" element={<ManageColleges />} />
          <Route path="/admin/colleges/:id" element={<ViewCollege />} />
          <Route path="/admin/colleges/edit/:id" element={<EditCollege />} />
          <Route path="/admin/users" element={<AllUsers />} />
          <Route path="/admin/users/create" element={<CreateUser />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/groups" element={<ManageGroup />} />
          <Route path="/admin/groups/:id" element={<ViewGroup />} />
          <Route path="/admin/groups/edit/:id" element={<EditGroup />} />
          <Route path="/admin/assessments" element={<ManageAssesment />} />
          <Route path="/admin/assessments/create" element={<CreateAssesment />} />
          <Route path="/admin/assessments/edit/:id" element={<EditAssessment />} />
          <Route path="/admin/assessments/:id" element={<ViewAssesment />} />
          <Route path="/preview/assessment/:id" element={<AssessmentPreviewPage />} />
          <Route path="/admin/assessments/:id/create-section" element={<CreateSection />} />
          <Route path="/admin/assessments/:id/sections" element={<ViewSections />} />
          <Route path="/admin/sections/:id" element={<SinglePageViewSection />} />
          <Route path="/admin/sections/edit/:id" element={<EditSection />} />
          <Route path="/admin/sections/:id/add-question" element={<AddQuestionToSection />} />
          <Route path="/admin/sections/:id/add-question-code" element={<AddQuestionToSectionCode />} />
          {/* <Route path="/admin/sections/:id/add-question-assignment" element={<AddQuestionToSectionAssignment />} />
          <Route path="/admin/sections/:id/add-question-survey" element={<AddQuestionToSectionSurvey />} /> */}
          <Route path="/admin/sections/:id/questions" element={<ViewQuestionsInSection />} />
          <Route path="/admin/sections/question/coding/:id" element={<ViewCodingQuestionsInSection />} />
          <Route path="/admin/sections/question/:id/" element={<ViewSingleQuestion />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<div>Settings</div>} />
          <Route path="/admin/assignments/create" element={<CreateAssignments />} />
          <Route path="/admin/assignments" element={<ManageAssignments />} />
          <Route path="/admin/assignments/:id" element={<ViewAssignment />} />
          <Route path="/admin/assignments/edit/:id" element={<EditAssignment />} />
          <Route path="/admin/submissions/:submissionId" element={<ViewFullSubmission />} />
          <Route path="/reports/history" element={<ReportHistoryPage />} />
          <Route path='/admin/results' element={<Results/>}/>
          <Route path="/admin/result/:id" element={<ViewResult />} />
          <Route path="/admin/proctoring_report/:id" element={<ProctoringReport />} />


        </Route>
      </Route>



      {/* Private Trainer Routes */}
      <Route element={<PrivateRoute allowedRoles={['trainer']} />}>
        <Route element={<ProtectedLayout />}>
          {/* Add more trainer-specific routes here */}
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/groups" element={<ManageGroup />} />
          <Route path="/trainer/groups/:id" element={<ViewGroup />} />
          <Route path="/trainer/users" element={<AllUsers />} />
          <Route path="/trainer/users/create" element={<CreateUser />} />
          <Route path="/trainer/users/:id" element={<UserDetails />} />
          <Route path="/trainer/groups/edit/:id" element={<EditGroup />} />
          <Route path="/trainer/assessments" element={<ManageAssesment />} />
          <Route path="/trainer/assessments/create" element={<CreateAssesment />} />
          <Route path="/trainer/assessments/edit/:id" element={<EditAssessment />} />
          <Route path="/trainer/assessments/:id/create-section" element={<CreateSection />} />
          <Route path="/trainer/assessments/:id/sections" element={<ViewSections />} />
          <Route path="/trainer/assessments/:id" element={<ViewAssesment />} />
          <Route path="/trainer/create-test" element={<CreateTest />} />
          <Route path="/trainer/assignments/create" element={<CreateAssignments />} />
          <Route path="/trainer/assignments" element={<ManageAssignments />} />
          <Route path="/trainer/assignments/:id" element={<ViewAssignment />} />
          <Route path="/trainer/assignments/edit/:id" element={<EditAssignment />} />
          <Route path="/trainer/sections/:id" element={<SinglePageViewSection />} />
          <Route path="/trainer/sections/edit/:id" element={<EditSection />} />
          <Route path="/trainer/sections/:id/add-question" element={<AddQuestionToSection />} />
          <Route path="/trainer/sections/:id/add-question-code" element={<AddQuestionToSectionCode />} />
          <Route path="/trainer/sections/:id/questions" element={<ViewQuestionsInSection />} />
          <Route path="/trainer/sections/question/coding/:id" element={<ViewCodingQuestionsInSection />} />
          <Route path="/trainer/sections/question/:id/" element={<ViewSingleQuestion />} />
          <Route path="/trainer/submissions" element={<TrainerCandidateList />} />
          <Route path="/trainer/submissions/:submissionId" element={<ViewFullSubmission />} />
          <Route path="/trainer/students" element={<AllUsers />} />
          <Route path="/trainer/students/create" element={<CreateUser />} />
          <Route path="/trainer/students/:id" element={<UserDetails />} />
          <Route path="/trainer/analytics" element={<div>Trainer Analytics</div>} />
          <Route path="/trainer/reports" element={<ReportHistoryPage />} />
          <Route path="/trainer/profile" element={<div>Trainer Profile</div>} />
          <Route path="/trainer/test/:testId/candidate/:candidateId" element={<CandidatePerformance />} />
          <Route path="/trainer/students/:studentId" element={<StudentDetails />} />
          <Route path='/trainer/results' element={<Results/>}/>
          <Route path="/trainer/result/:id" element={<ViewResult />} />
          <Route path="/trainer/proctoring_report/:id" element={<ProctoringReport />} />
        </Route>
      </Route>



      {/* Catch-all route for 404 Page Not Found */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
