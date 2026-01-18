import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/ui/layout/Layout.jsx";
import Login from "../pages/auth/Login.jsx";
import DashboardAdmin from "../pages/auth/admin/DashboardAdmin.jsx";
import DashboardGuru from "../pages/auth/guru/DashboardGuru.jsx";
import DashboardKepsek from "../pages/auth/kepsek/DashboardKepsek.jsx";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import useAuthStore from "../stores/authStore";

// Master Data Pages
import Guru from "../pages/auth/admin/MasterData/Guru";
import MataPelajaran from "../pages/auth/admin/MasterData/MataPelajaran";
import Kelas from "../pages/auth/admin/MasterData/Kelas";
import JamPelajaran from "../pages/auth/admin/MasterData/JamPelajaran";

// Scheduling Pages
import GenerateJadwal from "../pages/auth/admin/Scheduling/GenerateJadwal";
import ViewJadwal from "../pages/auth/admin/Scheduling/ViewJadwal";
import CalendarView from "../pages/auth/admin/Scheduling/CalendarView";

// Guru Pages
import JadwalGuru from "../pages/auth/guru/JadwalGuru";
import KetersediaanGuru from "../pages/auth/guru/KetersediaanGuru";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Common Routes (All Roles) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Guru Routes */}
        <Route
          path="/guru/*"
          element={
            <ProtectedRoute allowedRoles={["guru"]}>
              <GuruRoutes />
            </ProtectedRoute>
          }
        />

        {/* Kepala Sekolah Routes */}
        <Route
          path="/kepsek/*"
          element={
            <ProtectedRoute allowedRoles={["kepsek"]}>
              <KepsekRoutes />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Dashboard Redirect Component (redirect to role-specific dashboard)
const DashboardRedirect = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case "admin":
      return <DashboardAdmin />;
    case "guru":
      return <DashboardGuru />;
    case "kepsek":
      return <DashboardKepsek />;
    default:
      return <DashboardAdmin />;
  }
};

// Admin Sub-Routes
const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardAdmin />} />
      <Route path="dashboard" element={<DashboardAdmin />} />

      {/* Master Data Routes */}
      <Route path="guru" element={<Guru />} />
      <Route path="mata-pelajaran" element={<MataPelajaran />} />
      <Route path="kelas" element={<Kelas />} />
      <Route path="jam-pelajaran" element={<JamPelajaran />} />

      {/* Scheduling Routes */}
      <Route path="jadwal/generate" element={<GenerateJadwal />} />
      <Route path="jadwal/view" element={<ViewJadwal />} />
      <Route path="jadwal/calendar" element={<CalendarView />} />

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

// Guru Sub-Routes
const GuruRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardGuru />} />
      <Route path="dashboard" element={<DashboardGuru />} />
      <Route path="jadwal" element={<JadwalGuru />} />
      <Route path="ketersediaan" element={<KetersediaanGuru />} />
      <Route path="*" element={<Navigate to="/guru/dashboard" replace />} />
    </Routes>
  );
};

// Kepala Sekolah Sub-Routes
const KepsekRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardKepsek />} />
      <Route path="dashboard" element={<DashboardKepsek />} />
      {/* Minggu 6: Laporan Routes akan ditambahkan di sini */}
      {/* 
      <Route path="laporan" element={<LaporanKepsek />} />
      <Route path="analisis" element={<AnalisisKepsek />} />
      */}
      <Route path="*" element={<Navigate to="/kepsek/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
