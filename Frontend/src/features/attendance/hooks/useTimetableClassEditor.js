import { useCallback, useRef, useState } from "react"

const START_HOUR = 7
const END_HOUR = 19
const isTemporaryClass = (classItem) => String(classItem._id).startsWith("temp-")
const toTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
const toMinutes = (time) => {
  const [hours, minutes] = String(time || "").split(":").map(Number)
  return Number.isInteger(hours) && Number.isInteger(minutes) ? hours * 60 + minutes : null
}

export const useTimetableClassEditor = ({ classes, setClasses, subjects, updateClasses }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const snapshotRef = useRef([])

  const enterEditMode = useCallback(() => {
    snapshotRef.current = classes.map((item) => ({ ...item }))
    setError("")
    setIsEditing(true)
  }, [classes])

  const cancelEditMode = useCallback(() => {
    setClasses(snapshotRef.current)
    setError("")
    setIsEditing(false)
  }, [setClasses])

  const addClass = useCallback((day, hour) => {
    const subject = subjects?.[0]
    if (!subject) {
      setError("Add a subject to this timetable before creating a class.")
      return
    }
    const startTime = `${String(hour).padStart(2, "0")}:00`
    const endTime = `${String(Math.min(hour + 1, END_HOUR)).padStart(2, "0")}:00`
    setClasses((current) => [...current, {
      _id: `temp-${crypto.randomUUID()}`,
      subjectId: subject.subjectId,
      name: subject.name,
      color: subject.color,
      day,
      startTime,
      endTime,
    }])
  }, [setClasses, subjects])

  const changeClass = useCallback((id, update) => {
    setClasses((current) => current.map((item) => item._id === id ? { ...item, ...update } : item))
  }, [setClasses])

  const removeClass = useCallback((id) => {
    setClasses((current) => current.filter((item) => item._id !== id))
  }, [setClasses])

  const saveEditMode = useCallback(async () => {
    const originalById = new Map(snapshotRef.current.map((item) => [item._id, item]))
    const updates = [
      ...snapshotRef.current
        .filter((original) => !classes.some((item) => item._id === original._id))
        .filter((original) => !isTemporaryClass(original))
        .map((original) => ({ type: "delete_cls", id: original._id })),
      ...classes.flatMap((item) => {
        if (isTemporaryClass(item)) {
          return [{ type: "add_cls", day: item.day, subjectId: item.subjectId, name: item.name, color: item.color, startTime: item.startTime, endTime: item.endTime }]
        }
        const original = originalById.get(item._id)
        if (!original) return []
        const update = {}
        if (item.day !== original.day) update.day = item.day
        if (item.startTime !== original.startTime) update.startTime = item.startTime
        if (item.endTime !== original.endTime) update.endTime = item.endTime
        if (item.subjectId !== original.subjectId) update.subjectId = item.subjectId
        if (item.name !== original.name) update.name = item.name
        if (item.color !== original.color) update.color = item.color
        return Object.keys(update).length ? [{ type: "update_cls", id: item._id, update }] : []
      }),
    ]

    if (!updates.length) return setIsEditing(false)
    setIsSaving(true)
    setError("")
    try {
      await updateClasses(updates)
      setIsEditing(false)
      snapshotRef.current = []
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save class changes.")
    } finally {
      setIsSaving(false)
    }
  }, [classes, updateClasses])

  return { isEditing, isSaving, error, enterEditMode, cancelEditMode, saveEditMode, addClass, changeClass, removeClass }
}

export { toMinutes, toTime, START_HOUR, END_HOUR }
