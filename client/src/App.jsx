import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './components/Shared/LandingPage';
import SurvivorDashboard from './components/Survivor/SurvivorDashboard';
import VolunteerDashboard from './components/Volunteer/VolunteerDashboard';
import CoordinatorDashboard from './components/Coordinator/CoordinatorDashboard';
import Toast from './components/Shared/Toast';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/survivor" element={<SurvivorDashboard />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/coordinator" element={<CoordinatorDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

