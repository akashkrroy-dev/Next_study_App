import "./css/zClassItem.css"

const ClassItem = ({ classItem, top, start, duration, bindMove, bindLeft, bindRight, draggedRef, onOpenEdit, displayedStart, displayedEnd }) => (
  <div
    className="timetable-hour-grid__class"
    style={{
      "--class-color": classItem.color,
      "--class-top": top,
      "--class-start": start,
      "--class-duration": duration,
    }}
    onClick={(event) => {
      event.stopPropagation()
      if (draggedRef?.current) {
        draggedRef.current = false
        return
      }
      if (onOpenEdit) onOpenEdit()
    }}
    {...bindMove}
  >
    {bindLeft && <span className="timetable-hour-grid__resize timetable-hour-grid__resize--left" {...bindLeft} />}
    <p className="timetable-hour-grid__class-name">{classItem.name}</p>
    <p className="timetable-hour-grid__class-time">
      {displayedStart || classItem.startTime} - {displayedEnd || classItem.endTime}
    </p>
    {bindRight && <span className="timetable-hour-grid__resize timetable-hour-grid__resize--right" {...bindRight} />}
  </div>
)

export default ClassItem
