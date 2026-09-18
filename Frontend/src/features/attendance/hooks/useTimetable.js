import { useCallback, useEffect, useRef, useState } from "react"
import { useAttendance } from "../../../context/attendanceContext.jsx"
import {
    fetchTimetables as apiFetchTimetables,
    createTimetable as apiCreateTimetable,
    fetchTimetable as apiFetchTimetable,
    selectTimetable as apiSelectTimetable,
    updateTimetable as apiUpdateTimetable,
    updateVisibility as apiUpdateVisibility,
    updateClasses as apiUpdateClasses,
    copyBySlug as apiCopyBySlug,
    deleteTimetable as apiDeleteTimetable,
} from "../AttendanceApi.js"

const requestMessage = (err, fallback) => err.response?.data?.message || err.message || fallback

const replaceInList = (list, timetable, removeId) => [
    timetable,
    ...list.filter((item) => item._id !== timetable._id && item._id !== removeId),
]

const activeTimetableRequests = new Map()
const MAX_BOOTSTRAP_RETRIES = 3

export const useTimetable = ({ bootstrap = false } = {}) => {
    const {
        user,
        timetable_list,
        setTimetableList,
        currentTimetable,
        setCurrentTimetable,
        currentTimetableId,
        setCurrentTimetableId,
        classes,
        setClasses,
        hasTimetable,
        hasCheckedTimetables,
        setHasCheckedTimetables,
        timetableLoading,
        setTimetableLoading,
        error,
        setError,
    } = useAttendance()

    const timetableRequestRef = useRef(0)
    const bootstrapStartedRef = useRef(false)
    const userId = user?._id || user?.id

    const selectTimetable = useCallback(async (id) => {
        const requestId = timetableRequestRef.current + 1
        timetableRequestRef.current = requestId
        setTimetableLoading(true)
        setError(null)
        try {
            const res = (await apiFetchTimetable(id)).data
            if (requestId !== timetableRequestRef.current) return res
            setCurrentTimetableId(id)
            setCurrentTimetable(res.timetable)
            setClasses(res.classes || [])
            if (user?.activeTimetableId !== id) {
                apiSelectTimetable(id).catch(() => {})
            }
            return res
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            if (requestId === timetableRequestRef.current) setTimetableLoading(false)
        }
    }, [setClasses, setCurrentTimetable, setCurrentTimetableId, setError, setTimetableLoading, user?.activeTimetableId])

    const fetchTimetables = useCallback(async () => {
        const res = (await apiFetchTimetables()).data
        const list = Array.from(new Map((res.timeTables || []).map((item) => [item._id, item])).values())
        setTimetableList(list)
        return list
    }, [setTimetableList])

    const loadActiveTimetable = useCallback(async () => {
        const userKey = user?._id || user?.id
        const existingRequest = userKey ? activeTimetableRequests.get(userKey) : null
        if (existingRequest) return existingRequest

        const request = (async () => {
        setHasCheckedTimetables(false)
        setTimetableLoading(true)
        setError(null)
        try {
            const list = await fetchTimetables()
            if (list.length === 0) {
                setCurrentTimetableId(null)
                setCurrentTimetable(null)
                setClasses([])
                setHasCheckedTimetables(true)
                return []
            }
            const activeId = user?.activeTimetableId || list[0]._id
            await selectTimetable(activeId)
            setHasCheckedTimetables(true)
            return list
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            setTimetableLoading(false)
        }
        })()

        if (userKey) activeTimetableRequests.set(userKey, request)
        try {
            return await request
        } finally {
            if (userKey && activeTimetableRequests.get(userKey) === request) {
                activeTimetableRequests.delete(userKey)
            }
        }
    }, [fetchTimetables, selectTimetable, setClasses, setCurrentTimetable, setCurrentTimetableId, setError, setHasCheckedTimetables, setTimetableLoading, user])

    const [bootstrapAttempt, setBootstrapAttempt] = useState(0)

    useEffect(() => {
        if (!bootstrap || !user || hasCheckedTimetables || bootstrapStartedRef.current) return
        if (bootstrapAttempt >= MAX_BOOTSTRAP_RETRIES) {
            setHasCheckedTimetables(true)
            return
        }
        bootstrapStartedRef.current = true
        loadActiveTimetable()
            .then(() => setBootstrapAttempt(0))
            .catch(() => {
                bootstrapStartedRef.current = false
                setBootstrapAttempt((attempt) => attempt + 1)
            })
    }, [bootstrap, bootstrapAttempt, hasCheckedTimetables, loadActiveTimetable, setHasCheckedTimetables, user])

    useEffect(() => {
        setBootstrapAttempt(0)
    }, [userId])

    const createTimetable = useCallback(async (data) => {
        setTimetableLoading(true)
        setError(null)
        try {
            const res = (await apiCreateTimetable(data)).data
            setTimetableList((current) => replaceInList(current, res.timetable))
            await selectTimetable(res.timetable._id)
            return res.timetable
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            setTimetableLoading(false)
        }
    }, [selectTimetable, setError, setTimetableList, setTimetableLoading])

    const updateTimetable = useCallback(async (id, updates) => {
        const targetId = id || currentTimetableId
        if (!targetId) throw new Error("No Active Timetable selected")

        setTimetableLoading(true)
        setError(null)
        try {
            const res = (await apiUpdateTimetable(targetId, { updates })).data
            const updated = res.timetable
            if (!updated) return updated

            setTimetableList((current) => replaceInList(current, updated, targetId))
            if (currentTimetableId === targetId || currentTimetableId === updated._id) {
                if (updated._id !== targetId) {
                    await selectTimetable(updated._id)
                } else {
                    setCurrentTimetable(updated)
                    setCurrentTimetableId(updated._id)
                }
            }
            return updated
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            setTimetableLoading(false)
        }
    }, [currentTimetableId, selectTimetable, setClasses, setCurrentTimetable, setCurrentTimetableId, setError, setTimetableList, setTimetableLoading])

    const updateClasses = useCallback(async (updates) => {
        if (!currentTimetableId) throw new Error("No active timetable selected")
        const previousId = currentTimetableId
        setTimetableLoading(true)
        setError(null)
        try {
            const res = (await apiUpdateClasses(previousId, { updates })).data
            const nextId = res.timetable?._id || previousId
            if (res.timetable) {
                setTimetableList((current) => replaceInList(current, res.timetable, previousId))
                setCurrentTimetable(res.timetable)
                setCurrentTimetableId(res.timetable._id)
            }
            if (nextId !== previousId) {
                await selectTimetable(nextId)
            } else {
                const selected = (await apiFetchTimetable(nextId)).data
                setClasses(selected.classes || [])
            }
            return res
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            setTimetableLoading(false)
        }
    }, [currentTimetableId, selectTimetable, setClasses, setCurrentTimetable, setCurrentTimetableId, setError, setTimetableList, setTimetableLoading])

    const copyBySlug = useCallback(async (slug, data) => {
        setTimetableLoading(true)
        setError(null)
        try {
            const res = (await apiCopyBySlug(slug, data)).data
            setTimetableList((current) => replaceInList(current, res.timetable))
            await selectTimetable(res.timetable._id)
            return res.timetable
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            setTimetableLoading(false)
        }
    }, [selectTimetable, setError, setTimetableList, setTimetableLoading])

    const updateVisibility = useCallback(async (id, visibility) => {
        const targetId = id || currentTimetableId
        if (!targetId) throw new Error("No Active Timetable selected")
        try {
            const res = (await apiUpdateVisibility(targetId, visibility)).data
            const updated = res.timetable
            if (!updated) return updated
            setTimetableList((current) => replaceInList(current, updated, targetId))
            if (currentTimetableId === targetId || currentTimetableId === updated._id) {
                setCurrentTimetable(updated)
            }
            return updated
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        }
    }, [currentTimetableId, setCurrentTimetable, setError, setTimetableList])

    const deleteTimetable = useCallback(async (id) => {
        const targetId = id || currentTimetableId
        if (!targetId) throw new Error("No active timetable selected")

        setTimetableLoading(true)
        setError(null)
        try {
            await apiDeleteTimetable(targetId)
            const remaining = timetable_list.filter((item) => item._id !== targetId)
            setTimetableList(remaining)
            if (currentTimetableId === targetId) {
                if (remaining[0]) {
                    await selectTimetable(remaining[0]._id)
                } else {
                    setCurrentTimetableId(null)
                    setCurrentTimetable(null)
                    setClasses([])
                }
            }
        } catch (err) {
            setError(requestMessage(err, "Request failed"))
            throw err
        } finally {
            setTimetableLoading(false)
        }
    }, [currentTimetableId, selectTimetable, setClasses, setCurrentTimetable, setCurrentTimetableId, setError, setTimetableList, setTimetableLoading, timetable_list])

    return {
        user,
        timetable_list,
        currentTimetable,
        currentTimetableId,
        classes,
        setClasses,
        hasTimetable,
        hasCheckedTimetables,
        timetableLoading,
        error,
        fetchTimetables,
        loadActiveTimetable,
        selectTimetable,
        createTimetable,
        updateTimetable,
        updateVisibility,
        updateClasses,
        copyBySlug,
        deleteTimetable,
    }
}
