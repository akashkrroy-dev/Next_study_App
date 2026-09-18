import { useAttendance } from "../../context/attendanceContext.jsx"
import MonthlyGrid from "./components/MonthlyGrid.jsx"
import TargetOverview from "./components/TargetOverview.jsx"
import TodayClasses from "./components/TodayClasses.jsx"
import "./AttendanceAnalytics.css"

const AttendanceAnalytics = ({ onSetClasses }) => {
  const { currentTimetableId } = useAttendance()

  if (!currentTimetableId) {
    return (
      <div className="attendance-analytics">
        <p className="analytics-empty">Create a timetable to see attendance analytics.</p>
      </div>
    )
  }

  return (
    <div className="attendance-analytics">
      <TodayClasses onSetClasses={onSetClasses} />
      <TargetOverview />
      <MonthlyGrid />
    </div>
  )
}

export default AttendanceAnalytics
