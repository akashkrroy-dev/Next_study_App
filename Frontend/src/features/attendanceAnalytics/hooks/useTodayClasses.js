import { useCallback, useEffect, useRef, useState } from "react"
import { useAttendance } from "../../../context/attendanceContext.jsx"
import { fetchTodayClasses as apiFetchTodayClasses, updateAttendanceLog } from "../../attendance/AttendanceApi.js"
import { createLatestThreshold } from "../../../utils/js/threshold.js"

const todayRequests = new Map()

const useTodayClasses = () => {
  const { currentTimetableId, classes, bumpAttendanceRevision } = useAttendance()
  const [todayClasses, setTodayClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const thresholds = useRef(new Map())
  const attendanceStatus = useRef(new Map())
  const inflight = useRef(new Set())

  const loadTodayClasses = useCallback(async () => {
    if (!currentTimetableId) {
      setTodayClasses([])
      setHasLoaded(false)
      setError("")
      setLoading(false)
      return
    }

    const requestKey = currentTimetableId
    let request = todayRequests.get(requestKey)
    if (!request) {
      request = apiFetchTodayClasses(currentTimetableId)
      todayRequests.set(requestKey, request)
    }

    setLoading(true)
    setError("")
    try {
      const res = (await request).data
      const nextTodayClasses = res.todayClasses || []
      attendanceStatus.current = new Map(
        nextTodayClasses.map((item) => [item._id, Boolean(item.attended)])
      )
      setTodayClasses(nextTodayClasses)
      setHasLoaded(true)
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load today's classes.")
    } finally {
      if (todayRequests.get(requestKey) === request) todayRequests.delete(requestKey)
      setLoading(false)
    }
  }, [currentTimetableId])

  useEffect(() => {
    loadTodayClasses()
  }, [loadTodayClasses])

  const handleToggle = (item) => {
    if (!currentTimetableId || inflight.current.has(item._id)) return Promise.resolve()
    const currentStatus = attendanceStatus.current.has(item._id)
      ? attendanceStatus.current.get(item._id)
      : Boolean(item.attended)
    const nextStatus = !currentStatus
    attendanceStatus.current.set(item._id, nextStatus)
    setTodayClasses((current) => current.map((entry) => (
      entry._id === item._id ? { ...entry, attended: nextStatus } : entry
    )))

    let threshold = thresholds.current.get(item._id)
    if (!threshold) {
      threshold = createLatestThreshold()
      thresholds.current.set(item._id, threshold)
    }

    inflight.current.add(item._id)
    setUpdatingId(item._id)

    return new Promise((resolve) => {
      threshold(async () => {
        try {
          await updateAttendanceLog(currentTimetableId, item._id, nextStatus)
          bumpAttendanceRevision()
        } catch (requestError) {
          attendanceStatus.current.set(item._id, !nextStatus)
          setTodayClasses((current) => current.map((entry) => (
            entry._id === item._id ? { ...entry, attended: !nextStatus } : entry
          )))
          setError(requestError.response?.data?.message || "Unable to update attendance.")
        } finally {
          inflight.current.delete(item._id)
          setUpdatingId(null)
          resolve()
        }
      })
    })
  }

  const handleAttendAll = async () => {
    for (const item of todayClasses.filter((entry) => !entry.attended)) {
      if (!inflight.current.has(item._id)) {
        await handleToggle(item)
      }
    }
  }

  return {
    hasAnyClasses: classes.length > 0,
    todayClasses,
    hasLoaded,
    loading,
    error,
    updatingId,
    handleToggle,
    handleAttendAll,
  }
}

export default useTodayClasses
