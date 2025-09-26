import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import UserDashboard from './components/UserDashboard';
import GovernmentDashboard from './components/GovernmentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SettingsProfile from './components/SettingsProfile';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (showSettings) {
    return <SettingsProfile onBack={() => setShowSettings(false)} />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user.role === 'technician' ? (
            <UserDashboard />
          ) : user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <GovernmentDashboard />
          )
        } 
      />
      <Route 
        path="/settings" 
        element={<SettingsProfile onBack={() => setShowSettings(false)} />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;