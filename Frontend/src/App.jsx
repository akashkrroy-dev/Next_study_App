import React, { lazy, Suspense } from 'react'
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

const AuthLayout = lazy(() => import("./layouts/AuthLayout.jsx"))
const MainLayout = lazy(() => import("./layouts/MainLayout.jsx"))
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"))

const Register = lazy(() => import("./features/auth/Register.jsx"))
const Login = lazy(() => import("./features/auth/Login.jsx"))
const ResetPassword = lazy(() => import("./features/auth/ResetPassword.jsx"))

const Dashboard = lazy(() => import("./features/dashboard/Dashboard.jsx"))
const Activities = lazy(() => import("./pages/app/Activities.jsx"))
const ProfileAndSettings = lazy(() => import('./features/profile/ProfileSettings.jsx'));
const Account = lazy(() => import('./features/profile/components/Account.jsx'));
const Notifications = lazy(() => import('./features/profile/components/Notifications.jsx'));
const Password = lazy(() => import('./features/profile/components/Password.jsx'));
const Appearance = lazy(() => import('./features/profile/components/Appearance.jsx'));
const Logout = lazy(() => import('./features/profile/components/Logout.jsx'));

const Attendance = lazy(() => import('./features/attendance/Attendance.jsx'));
const Habits = lazy(() => import("./pages/app/Habits.jsx"))
const Todos = lazy(() => import("./features/todos/Todos.jsx"))
const Events = lazy(() => import("./pages/app/Events.jsx"))
const Notification = lazy(() => import('./features/Notifications/Notification.jsx'));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"))
const Users = lazy(() => import("./pages/admin/Users.jsx"))
const AdminActivities = lazy(() => import("./pages/admin/AdminActivities.jsx"))
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"))

const NotFound = lazy(() => import("./pages/error/NotFound.jsx"))

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
      <Suspense fallback={<AppLoadingScreen />}>
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
      </Suspense>
      </UserProvider>
    </ToastProvider>
  )
}

export default App