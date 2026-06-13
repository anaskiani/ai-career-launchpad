import { Suspense, lazy } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AppLayout } from './components/Common/AppLayout';

import { ProtectedRoute } from './components/Common/ProtectedRoute';

import './styles/App.css';



const Login = lazy(() => import('./components/Auth/Login').then((module) => ({ default: module.Login })));

const Register = lazy(() => import('./components/Auth/Register').then((module) => ({ default: module.Register })));

const ForgotPassword = lazy(() =>

  import('./components/Auth/ForgotPassword').then((module) => ({ default: module.ForgotPassword }))

);

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));

const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));

const ResumePage = lazy(() => import('./pages/ResumePage').then((module) => ({ default: module.ResumePage })));

const SkillsPage = lazy(() => import('./pages/SkillsPage').then((module) => ({ default: module.SkillsPage })));

const JobFinder = lazy(() => import('./components/Jobs/JobFinder').then((module) => ({ default: module.JobFinder })));

const MockInterview = lazy(() =>

  import('./components/Interview/MockInterview').then((module) => ({ default: module.MockInterview }))

);

const AIChatbot = lazy(() => import('./components/Chatbot/AIChatbot').then((module) => ({ default: module.AIChatbot })));

const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));



const PageLoader = () => (

  <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">

    Loading...

  </div>

);



const ProtectedAppPage = ({ children }) => (

  <ProtectedRoute>

    <AppLayout>{children}</AppLayout>

  </ProtectedRoute>

);



function App() {

  return (

    <Router>

      <Suspense fallback={<PageLoader />}>

        <Routes>

          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />



          <Route path="/dashboard" element={<ProtectedAppPage><DashboardPage /></ProtectedAppPage>} />

          <Route path="/profile" element={<ProtectedAppPage><ProfilePage /></ProtectedAppPage>} />

          <Route path="/resume" element={<ProtectedAppPage><ResumePage /></ProtectedAppPage>} />

          <Route path="/skills" element={<ProtectedAppPage><SkillsPage /></ProtectedAppPage>} />

          <Route path="/jobs" element={<ProtectedAppPage><JobFinder /></ProtectedAppPage>} />

          <Route path="/interview" element={<ProtectedAppPage><MockInterview /></ProtectedAppPage>} />

          <Route path="/chatbot" element={<ProtectedAppPage><AIChatbot /></ProtectedAppPage>} />



          <Route path="*" element={<NotFoundPage />} />

        </Routes>

      </Suspense>

    </Router>

  );

}



export default App;

