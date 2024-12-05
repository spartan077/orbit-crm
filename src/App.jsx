import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/auth/LoginPage';
import { CustomersPage } from './components/customers/CustomersPage';
import { ConversationsPage } from './components/conversations/ConversationsPage';
import { CampaignsPage } from './components/campaigns/CampaignsPage';
import { ReportingPage } from './components/reporting/ReportingPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { Header } from './components/ui/Header';
import { MobileMenu } from './components/ui/MobileMenu';
import Sidebar from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <Header onMenuClick={() => setIsMobileMenuOpen(true)} />}
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <Dashboard />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <CustomersPage />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <ConversationsPage />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <CampaignsPage />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/reporting"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <ReportingPage />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <ProfilePage />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 text-gray-900 dark:text-white">
                  <SettingsPage />
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
      {user && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}