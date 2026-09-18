import React from 'react'
import "./css/zHeader.css"

const DATA = {
  attendances: {
    title: "Attendance",
    message: "Track your Classes and attendance"
  },

  dashboard: {
    title: "Dashboard",
    message: "Stay on top of your classes, attendance, and todos."
  },

  create_timetable: {
    title: "Create timetable",
    message: "Create your weekly timetable to keep track of your classes and stay organized"
  },

  todos: {
    title: "Todos",
    message: "What's on your plate today."
  },

  notifications: {
    title: "Notifications",
    message: "Stay up to date with your latest activity."
  },

  account: {
    title: "Account",
    message: "The basics attached to your NexStudy profile."
  },

  appearance: {
    title: "Appearance",
    message: "Pick a theme and accent that suit your study hours."
  },

  password: {
    title: "Password & security",
    message: "Keep your account secure."
  },

  logout: {
    title: "Log out",
    message: "Sign out of NexStudy on this device, or everywhere at once."
  },

  settings: {
    title: "Account & Settings",
    message: "Manage your NexStudy account and preferences."
  }
}

const Header = ({ name, variant = "page" }) => {
  const content = DATA[name] || { title: name, message: "" }

  return (
    <div className={`globale_header globale_header--${variant}`}>
      <h3>{content.title}</h3>
      <p>{content.message}</p>
    </div>
  )
}

export default Header