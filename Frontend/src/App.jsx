import React from 'react'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useOrientation } from "./hooks/useOrientation.jsx";
import { useAuthInit } from './config/useAuthInit.js';
import { UserProvider } from './context/UserContext.jsx'
import { TodoProvider } from "./features/todos/context/TodoContext.jsx"
import { AttendanceProvider } from './context/attendanceContext.jsx';
import { NotificationProvider } from './features/Notifications/context/notificationContext.jsx';
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx"
import AppLoadingScreen from "./utils/AppLoadingScreen.jsx"
import ThemeSync from './utils/ThemeSync.jsx';
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './components/shared/ToastsContainer.jsx'

import AuthLayout from "./layouts/AuthLayout.jsx"
import MainLayout from "./layouts/MainLayout.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx"

import Register from "./features/auth/Register.jsx"
import Login from "./features/auth/Login.jsx"
import ResetPassword from "./features/auth/ResetPassword.jsx"

import Dashboard from "./features/dashboard/Dashboard.jsx"
import Activities from "./pages/app/Activities.jsx"
import ProfileAndSettings from './features/profile/ProfileSettings.jsx';
import Account from './features/profile/components/Account.jsx';
import Notifications from './features/profile/components/Notifications.jsx';
import Password from './features/profile/components/Password.jsx';
import Appearance from './features/profile/components/Appearance.jsx';
import Logout from './features/profile/components/Logout.jsx';

import Attendance from './features/attendance/Attendance.jsx';
import Habits from "./pages/app/Habits.jsx"
import Todos from "./features/todos/Todos.jsx"
import Events from "./pages/app/Events.jsx"
import Notification from './features/Notifications/Notification.jsx';

import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import Users from "./pages/admin/Users.jsx"
import AdminActivities from "./pages/admin/AdminActivities.jsx"
import AdminSettings from "./pages/admin/AdminSettings.jsx"

import NotFound from "./pages/error/NotFound.jsx"

const App = () => {
  const location = useLocation()
  const isLandscape = useOrientation();
  const { authChecked, isAuthenticated } = useAuthInit()

  if (!authChecked && !location.pathname.startsWith('/auth')) {
    return <AppLoadingScreen />
  }

  // A session-holding user shouldn't flash the login/register form while the
  // session polls; bounce them straight to the app.
  if (isAuthenticated && location.pathname.startsWith('/auth')) {
    return <Navigate to="/" replace />
  }

  return (
    <ToastProvider>
      <UserProvider>
        <ToastContainer />
        <ThemeSync />
      <Routes>
        {/* auth routes */}
        <Route path="/auth" element={<AuthLayout />} >
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* main routes TODO: must be protected */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout />
          </ProtectedRoute>
        } >
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<Activities />} >
            <Route index element={
              <AttendanceProvider>
                <Attendance />
              </AttendanceProvider>
            } />
            <Route path="habits" element={<Habits />} />
            <Route path="todos" element={
              <TodoProvider>
                <Todos />
              </TodoProvider>
            } />
            <Route path="events" element={<Events />} />
          </Route>

          <Route path='profile' element={<ProfileAndSettings />} >
            <Route index element={<Account />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='password' element={<Password />} />
            <Route path='appearance' element={<Appearance />} />
            <Route path='logout' element={<Logout />} />
          </Route>
          <Route path="notifications" element={
            <NotificationProvider>
              <Notification />
            </NotificationProvider>
          } />
        </Route>

        {/* Admin pages require an authenticated session; admin APIs must enforce roles server-side. */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        } >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </UserProvider>
    </ToastProvider>
  )
}

export default App