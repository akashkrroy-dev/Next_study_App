// * COMPONENTS
import Header from "../../components/ui/Header.jsx"
import { useState } from "react"
import Timetable from "./components/Timetable.jsx"
import AttendanceAnalytics from "../attendanceAnalytics/AttendanceAnalytics.jsx"
import { useTimetable } from "./hooks/useTimetable.js"
import "./Attendance.css"

const Attendance = () => {
  const [editClassesRequest, setEditClassesRequest] = useState(0)
  useTimetable({ bootstrap: true })

  return (
    <div className='attendances-layout'>
      <div className='timetable_header'>
        <Header name='attendances' />
      </div>

      <div className="layout_components">
        <Timetable editClassesRequest={editClassesRequest} />
      </div>

      <div className="layout_analyathis">
        <AttendanceAnalytics onSetClasses={() => setEditClassesRequest((current) => current + 1)} />
      </div>
    </div>
  )
}

export default Attendance
