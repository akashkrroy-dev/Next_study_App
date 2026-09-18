import api from "../../config/api.js"

export const getNotification = () => api.get("/notification")
export const seenNotification = (id) => api.patch(`/notification/${id}/seen`)
export const deleteNotification = (id) => api.patch(`/notification/${id}/delete`)