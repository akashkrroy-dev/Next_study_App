import { useEffect, useRef, useState } from "react"
import { END_HOUR, START_HOUR, toTime } from "./useTimetableClassEditor.js"

const SNAP_MINUTES = 15
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const snap = (value) => Math.round(value / SNAP_MINUTES) * SNAP_MINUTES

export const useClassDragResize = ({ classItem, dayIndex, startMinutes, endMinutes, gridRef, isEditing, onChange }) => {
  const [preview, setPreview] = useState(null)
  const interactionRef = useRef(null)
  const draggedRef = useRef(false)

  useEffect(() => setPreview(null), [classItem._id, dayIndex, startMinutes, endMinutes, isEditing])

  const getMetrics = () => {
    const grid = gridRef.current
    const gridRect = grid?.getBoundingClientRect()
    const labelRect = grid?.querySelector(".timetable-hour-grid__corner")?.getBoundingClientRect()
    const hourRect = grid?.querySelector(".timetable-hour-grid__hour")?.getBoundingClientRect()
    if (!gridRect || !labelRect || !hourRect) return null
    return {
      left: gridRect.left + labelRect.width,
      top: gridRect.top + hourRect.height,
      cellWidth: (gridRect.width - labelRect.width) / 12,
      rowHeight: (gridRect.height - hourRect.height) / 7,
    }
  }

  const begin = (kind) => (event) => {
    if (!isEditing) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    draggedRef.current = false
    interactionRef.current = { kind, pointerX: event.clientX, pointerY: event.clientY, day: dayIndex, start: startMinutes, end: endMinutes }
  }

  const move = (event) => {
    const interaction = interactionRef.current
    const metrics = getMetrics()
    if (!interaction || !metrics) return
    if (Math.abs(event.clientX - interaction.pointerX) > 3 || Math.abs(event.clientY - interaction.pointerY) > 3) {
      draggedRef.current = true
    }
    let next = { day: interaction.day, start: interaction.start, end: interaction.end }
    if (interaction.kind === "move") {
      const duration = interaction.end - interaction.start
      next.start = clamp(interaction.start + snap(((event.clientX - interaction.pointerX) / metrics.cellWidth) * 60), START_HOUR * 60, END_HOUR * 60 - duration)
      next.end = next.start + duration
      next.day = clamp(interaction.day + Math.round((event.clientY - interaction.pointerY) / metrics.rowHeight), 0, 6)
    } else {
      const minuteAtPointer = START_HOUR * 60 + snap(((event.clientX - metrics.left) / metrics.cellWidth) * 60)
      if (interaction.kind === "right") next.end = clamp(minuteAtPointer, interaction.start + SNAP_MINUTES, END_HOUR * 60)
      if (interaction.kind === "left") next.start = clamp(minuteAtPointer, START_HOUR * 60, interaction.end - SNAP_MINUTES)
    }
    setPreview(next)
  }

  const finish = () => {
    if (!interactionRef.current) return
    const next = preview
    interactionRef.current = null
    if (next) onChange(classItem._id, { day: next.day, startTime: toTime(next.start), endTime: toTime(next.end) })
    setPreview(null)
  }

  return { display: preview || { day: dayIndex, start: startMinutes, end: endMinutes }, draggedRef, bindMove: { onPointerDown: begin("move"), onPointerMove: move, onPointerUp: finish, onPointerCancel: finish }, bindLeft: { onPointerDown: begin("left"), onPointerMove: move, onPointerUp: finish, onPointerCancel: finish }, bindRight: { onPointerDown: begin("right"), onPointerMove: move, onPointerUp: finish, onPointerCancel: finish } }
}
