import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useGroupedNotifications } from "../hooks/useGroupedNotifications.js"
import { getNotification, seenNotification } from "../NotificationApi.js"
import { useToast } from "../../../hooks/useToast.jsx"

export const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const toast = useToast()
    const toastRef = useRef(toast)
    useEffect(() => {
        toastRef.current = toast
    })

    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getNotification()
            setNotifications(res.data.notifications)
        } catch (requestError) {
            setError(requestError)
            toastRef.current.error("Couldn't load notifications.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    const { all, seen, unseen } = useGroupedNotifications(notifications)

    const markAsRead = useCallback(async (id) => {
        try {
            setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
            await seenNotification(id)
        } catch {
            setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: false } : n)))
            toast.error("Couldn't update that notification.")
        }
    }, [toast])

    const markAllAsRead = useCallback(async () => {
        const unread = notifications.filter((notification) => !notification.isRead)
        if (!unread.length) return

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        try {
            await Promise.all(unread.map((notification) => seenNotification(notification._id)))
        } catch {
            setNotifications((prev) => prev.map((notification) => (
                unread.some((item) => item._id === notification._id)
                    ? { ...notification, isRead: false }
                    : notification
            )))
            toast.error("Couldn't mark notifications as read.")
        }
    }, [notifications, toast])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const value = {
        notifications,
        setNotifications,
        loading,
        error,
        grouped: { all, seen, unseen },
        reload: fetchNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}