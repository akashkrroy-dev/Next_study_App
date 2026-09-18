import { useRef, useState } from "react"
import { getWeekDays, normalizeDayIndex } from "../../../utils/js/weekHelpers.js"
import { useClassDragResize } from "../hooks/useClassDragResize.js"
import { toTime } from "../hooks/useTimetableClassEditor.js"
import "./css/zTimetableLayout.css"
import ClassItem from "./ClassItem.jsx"
import ClassEditModal from "./ClassEditModal.jsx"

// * CONSTANTS
const START_HOUR = 7
const HOURS_TO_SHOW = 12
const slots = Array.from({ length: HOURS_TO_SHOW }, (_, index) => START_HOUR + index)
const GRID_DURATION = HOURS_TO_SHOW * 60

// * UTILIS
const timeToMinutes = (time) => {
  const [hours, minutes] = String(time ?? "").split(":").map(Number)

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null
  return hours * 60 + minutes
}

// * MAIN
const TimetableLayout = ({ classes = [], subjects = [], isEditing = false, onAddClass, onChangeClass, onRemoveClass }) => {
  const { weekDays } = getWeekDays()
  const gridRef = useRef(null)
  const [editingClass, setEditingClass] = useState(null)
  const startOfGrid = START_HOUR * 60
  const displayClasses = classes

  return (
    <>
    <section className="timetable-hour-grid" aria-label="Weekly timetable" ref={gridRef}>
      <div className="timetable-hour-grid__corner" />

      {slots.map((hour) => (
        <div className="timetable-hour-grid__hour" key={hour}>
          {hour > 12 ? hour - 12 : hour}:00
        </div>
      ))}

      {weekDays.map((day) => (
        <div className="timetable-hour-grid__day-row" key={day.isoDate}>
          <div className="timetable-hour-grid__day-label">
            <span>{day.label}</span>
            <span>{day.date}/{day.month}</span>
          </div>

          {slots.map((hour) => (
            <button
              type="button"
              className={`timetable-hour-grid__slot${isEditing ? " timetable-hour-grid__slot--editable" : ""}`}
              key={`${day.isoDate}-${hour}`}
              onClick={() => isEditing && onAddClass?.(day.dayIndex, hour)}
              aria-label={isEditing ? `Add class on ${day.label} at ${hour}:00` : undefined}
            />
          ))}
        </div>
      ))}

      <div className="timetable-hour-grid__classes">
        {displayClasses.map((classItem) => {
          const start = timeToMinutes(classItem.startTime)
          const end = timeToMinutes(classItem.endTime)
          const dayIndex = normalizeDayIndex(classItem.day)

          if (start === null || end === null || end <= start) return null

          return (
            <EditableClassItem
              key={classItem._id ?? `${classItem.subjectId}-${classItem.day}-${classItem.startTime}`}
              classItem={classItem}
              dayIndex={dayIndex}
              startMinutes={start}
              endMinutes={end}
              gridRef={gridRef}
              isEditing={isEditing}
              onChange={onChangeClass}
              onOpenEdit={isEditing ? () => setEditingClass(classItem) : undefined}
              top={`${dayIndex * 3.5}rem`}
              start={`${((start - startOfGrid) / GRID_DURATION) * 100}%`}
              duration={`${((end - start) / GRID_DURATION) * 100}%`}
            />
          )
        })}
      </div>
    </section>
    {editingClass && (
      <ClassEditModal
        classItem={editingClass}
        subjects={subjects}
        onChange={(update) => {
          onChangeClass?.(editingClass._id, update)
          setEditingClass((current) => ({ ...current, ...update }))
        }}
        onRemove={() => {
          onRemoveClass?.(editingClass._id)
          setEditingClass(null)
        }}
        onClose={() => setEditingClass(null)}
      />
    )}
    </>
  )
}

const EditableClassItem = ({ classItem, dayIndex, startMinutes, endMinutes, gridRef, isEditing, onChange, onOpenEdit, ...layout }) => {
  const { display, draggedRef, bindMove, bindLeft, bindRight } = useClassDragResize({
    classItem,
    dayIndex,
    startMinutes,
    endMinutes,
    gridRef,
    isEditing,
    onChange,
  })

  return (
    <ClassItem
      classItem={classItem}
      top={`${display.day * 3.5}rem`}
      start={`${((display.start - START_HOUR * 60) / GRID_DURATION) * 100}%`}
      duration={`${((display.end - display.start) / GRID_DURATION) * 100}%`}
      bindMove={bindMove}
      bindLeft={bindLeft}
      bindRight={bindRight}
      draggedRef={draggedRef}
      onOpenEdit={onOpenEdit}
      displayedStart={toTime(display.start)}
      displayedEnd={toTime(display.end)}
    />
  )
}

export default TimetableLayout
