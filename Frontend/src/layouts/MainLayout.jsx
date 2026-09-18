import React from 'react'
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar.jsx"
import "./css/zMainLayout.css"

const MainLayout = () => {

  const location = useLocation()
  const isProfileRoute = location.pathname.startsWith('/profile')
  const isNotificationRoute = location.pathname.startsWith("/notification")

  return (
    <div className='main-layout'>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className={
        `main-layout-outlet
        ${isProfileRoute ? ' profile-main-layout-outlet' : ''}
        ${isNotificationRoute ? ' notification-main-layout-outlet' : ''}
        `}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout