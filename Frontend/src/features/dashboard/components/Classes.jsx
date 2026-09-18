import { useEffect, useState } from "react"
import Button from "../../../components/ui/buttons/Button.jsx"
import { updateAttendanceLog } from "../../attendance/AttendanceApi.js"
import { hasClassStarted } from "../../attendanceAnalytics/utils/helperFunction.js"

const Classes = ({ classes = [], error = "" }) => {
  const [attendingId, setAttendingId] = useState(null)
  const [items, setItems] = useState(classes)
  const [actionError, setActionError] = useState("")

  useEffect(() => {
    setItems(classes)
  }, [classes])

  const handleAttend = async (classItem) => {
    const classId = classItem._id || classItem.id
    const timetableId = classItem.timeTableId || classItem.timetableId

    if (!classId || !timetableId || attendingId) return

    setAttendingId(classId)
    setActionError("")
    try {
      await updateAttendanceLog(timetableId, classId, true)
      setItems((current) => current.map((item) => (
        (item._id || item.id) === classId ? { ...item, attended: true } : item
      )))
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Unable to mark class attended.")
    } finally {
      setAttendingId(null)
    }
  }

  if (error) {
    return (
      <div className="dashboard-classes">
        <h2>Classes</h2>
        <p role="alert">{error}</p>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="dashboard-classes">
        <h2>Classes</h2>
        <p>No classes available.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-classes">
      <h2>Classes</h2>
      {actionError && <p role="alert">{actionError}</p>}
      <ul>
        {items.map((classItem) => (
          <ClassItem
            key={classItem._id || classItem.id}
            cls={classItem}
            attending={attendingId === (classItem._id || classItem.id)}
            onAttend={() => handleAttend(classItem)}
          />
        ))}
      </ul>
    </div>
  )

}
export default Classes

const ClassItem = ({ cls, attending, onAttend }) => {
  const formatTime = (value) => {
    if (!value) return "--:--"
    const [hour, minute] = String(value).split(":").map(Number)
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return value
    const suffix = hour >= 12 ? "PM" : "AM"
    return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`
  }

  const canMark = hasClassStarted(cls) || cls.attended

  return (
    <li className="dashboard-classes__item" style={{ "--event-color": cls.color }}>
      <div>
        <strong>{cls.name || cls.title || "Class"}</strong>
        <span>
          {formatTime(cls.startTime || cls.start)} - {formatTime(cls.endTime || cls.end)}
        </span>
      </div>
      {canMark && (
        <Button
          text={cls.attended ? "Attended" : "Attend"}
          onClick={onAttend}
          threshold={600}
          disabled={cls.attended || attending}
        />
      )}
    </li>
  )
}