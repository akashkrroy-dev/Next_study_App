import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react'

export const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])
    const idCounter = useRef(0)

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const addToast = useCallback((message, type = "error", duration = 3000) => {
        const id = ++idCounter.current
        setToasts((prev) => [...prev, { id, message, type, duration }])
        return id
    }, [])

    const value = useMemo(() => ({
        toasts,
        addToast,
        removeToast,
        success: (msg, duration) => addToast(msg, "success", duration),
        error: (msg, duration) => addToast(msg, "error", duration),
    }), [toasts, addToast, removeToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    )
}