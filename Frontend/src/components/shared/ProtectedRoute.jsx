import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../../config/tokenStore.js'
import { useUser } from '../../context/UserContext.jsx'

const ProtectedRoute = ({ isAuthenticated, children, requireAdmin = false }) => {
    const hasValidToken = typeof isAuthenticated === 'boolean' ? isAuthenticated : !!getAccessToken()
    const { user, userLoading } = useUser()

    if (!hasValidToken) {
        return <Navigate to="/auth/login" replace />
    }

    if (requireAdmin) {
        if (userLoading) return <div className="route-loading" role="status" aria-label="Loading">Loading…</div>
        if (user?.role !== "admin") return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute