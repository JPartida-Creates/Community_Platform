import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProgramPage } from './pages/ProgramPage';
import { DayDetailPage } from './pages/DayDetailPage';
import { CommunityPage } from './pages/CommunityPage';
import { CommunityTopicPage } from './pages/CommunityTopicPage';
import { DeliverablesPage } from './pages/DeliverablesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPlatformPage } from './pages/AboutPlatformPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminPage } from './pages/AdminPage';

function AdminRoute() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <AdminPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/program/day/:id" element={<DayDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/topic/:id" element={<CommunityTopicPage />} />
          <Route path="/deliverables" element={<DeliverablesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/about" element={<AboutPlatformPage />} />
          <Route path="/settings/privacy" element={<PrivacyPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
