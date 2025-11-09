import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './components/Shared/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import UserDashboard from './components/User/UserDashboard';
import MissionsPage from './components/User/MissionsPage';
import StaffDashboard from './components/Staff/StaffDashboard';
import Toast from './components/Shared/Toast';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

