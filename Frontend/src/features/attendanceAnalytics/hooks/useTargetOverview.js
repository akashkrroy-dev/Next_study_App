import { useEffect, useState } from "react"
import { useAttendance } from "../../../context/attendanceContext.jsx"
import { fetchTargetOfSubjects } from "../../attendance/AttendanceApi.js"

const targetRequests = new Map()

const useTargetOverview = () => {
  const { currentTimetableId, attendanceRevision } = useAttendance()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!currentTimetableId) {
      setSubjects([])
      setHasLoaded(false)
      setError("")
      setLoading(false)
      return undefined
    }

    let cancelled = false
    const requestKey = currentTimetableId
    let request = targetRequests.get(requestKey)
    if (!request) {
      request = fetchTargetOfSubjects(currentTimetableId)
      targetRequests.set(requestKey, request)
    }
    setLoading(true)
    setError("")
    request
      .then((response) => {
        if (!cancelled) setSubjects(response.data.subjects || [])
        if (!cancelled) setHasLoaded(true)
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || "Unable to load attendance targets.")
      })
      .finally(() => {
        if (targetRequests.get(requestKey) === request) targetRequests.delete(requestKey)
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [attendanceRevision, currentTimetableId])

  return { subjects, loading, hasLoaded, error }
}

export default useTargetOverview
