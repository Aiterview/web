import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Homepage from '../components/Homepage';
import AuthPage from '../components/auth/AuthPage';
import DashboardLayout from '../components/dashboard/DashboardLayout';
// import SessionsPage from '../pages/dashboard/SessionsPage';
// import HistoryPage from '../pages/dashboard/HistoryPage';
// import SavedQuestionsPage from '../pages/dashboard/SavedQuestionsPage';
import PracticePage from '../components/practice/PracticePage';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../components/dashboard/ProfilePage';
import SettingsPage from '../components/dashboard/SettingsPage';
import StartPracticePage from '../components/dashboard/StartPracticePage';
import { useAuthStore } from '../store/authStore';
import PlanAndBillingPage from '../components/dashboard/PlanAndBillingPage';
import HelpAndSupportPage from '../components/dashboard/HelpAndSupportPage';
import UpdatePasswordForm from '../components/auth/components/UpdatePasswordForm';
import { PasswordRecoveryRoute } from './PasswordRecoveryRoute';
import AuthCallback from '../components/auth/AuthCallback';

const AppRoutes = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public routes with Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
          }
        />
      </Route>

      {/* Auth Callback Route */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/update-password"
        element={
          <PasswordRecoveryRoute>
            <UpdatePasswordForm />
          </PasswordRecoveryRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StartPracticePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="billing" element={<PlanAndBillingPage/>}/>
        <Route path="support" element={<HelpAndSupportPage/>}/>

        {/* <Route path="sessions" element={<SessionsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="saved" element={<SavedQuestionsPage />} /> */}

        <Route path="practice/*" element={<PracticePage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;