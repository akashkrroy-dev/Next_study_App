import api from "../../config/api.js";

const BASE_URL = "/dashboard";

export const fetchDashboard = () => api.get(BASE_URL);

export const fetchTotalAttendance = () =>
    api.get(`${BASE_URL}/total-attendance`);

export const fetchLastWeekTodos = () =>
    api.get(`${BASE_URL}/last-week-todos`);