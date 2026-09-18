import { useEffect, useState } from "react"
import { useAttendance } from "../../../context/attendanceContext.jsx"
import { fetchMonthlyGridData } from "../../attendance/AttendanceApi.js"

const monthlyGridRequests = new Map()

const useMonthlyGrid = (month, year) => {
  const { currentTimetableId, attendanceRevision } = useAttendance()
  const [gridData, setGridData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!currentTimetableId || month == null || year == null) {
      setGridData(null)
      setError("")
      setLoading(false)
      return undefined
    }

    let cancelled = false
    const requestKey = `${currentTimetableId}:${year}-${month}`
    let request = monthlyGridRequests.get(requestKey)
    if (!request) {
      request = fetchMonthlyGridData(currentTimetableId, month, year)
      monthlyGridRequests.set(requestKey, request)
    }
    setLoading(true)
    setError("")
    request
      .then((response) => {
        if (!cancelled) setGridData(response.data || null)
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || "Unable to load monthly attendance.")
      })
      .finally(() => {
        if (monthlyGridRequests.get(requestKey) === request) monthlyGridRequests.delete(requestKey)
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [attendanceRevision, currentTimetableId, month, year])

  return { gridData, loading, error }
}

export default useMonthlyGrid
