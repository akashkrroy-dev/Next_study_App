import api from "../../config/api.js"

const BASE_URL = "/activities/attendance"

// * TIMETABLE ROUTES
export const createTimetable = (data) => api.post(BASE_URL, data)
export const fetchTimetable = (id) => api.get(`${BASE_URL}/${id}`)

export const updateTimetable = (id, data) => api.patch(`${BASE_URL}/${id}`, data)
export const selectTimetable = (id) => api.patch(`${BASE_URL}/${id}/select`)
export const updateVisibility = (id, visibility) => api.patch(`${BASE_URL}/${id}/visibility`, { visibility })
export const deleteTimetable = (id) => api.delete(`${BASE_URL}/${id}`)
export const updateClasses = (id, data) => api.patch(`${BASE_URL}/${id}/classes`, data)

export const copyBySlug = (slug, data) => api.post(`${BASE_URL}/${slug}`, data)

export const fetchTodayClasses = (id) => api.get(`${BASE_URL}/${id}/today`)
export const updateAttendanceLog = (ttId, clsId, status) =>
    api.patch(`${BASE_URL}/${ttId}/classes/${clsId}/toggle`, null, { params: { status: status ? "true" : "false" } })

export const fetchTargetOfSubjects = (id) => api.get(`${BASE_URL}/${id}/target`)
export const fetchMonthlyGridData = (id, month, year) =>
    api.get(`${BASE_URL}/${id}/grid`, { params: { month, year } })

// * USER FETCH ROUTE: ALL TIMETABLES
export const fetchTimetables = () => api.get("/user/timetables")
