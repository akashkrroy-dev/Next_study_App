// useAuthInit.js
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import api from "./api.js"
import { getAccessToken, setAccessToken, clearAccessToken, subscribeToAuthChanges } from "./tokenStore.js"

// Single-flight refresh: overlapping calls share one in-flight request so a
// stale cookie is never invalidated mid-refresh; the shared promise resets
// once settled so a later mount can retry after a transient failure.
let sessionRefreshPromise = null

const refreshSessionOnce = () => {
    if (!sessionRefreshPromise) {
        sessionRefreshPromise = api
            .post("/auth/refresh-token")
            .then(({ data }) => {
                setAccessToken(data.token)
                return true
            })
            .catch(() => {
                clearAccessToken()
                return false
            })
            .finally(() => {
                sessionRefreshPromise = null
            })
    }
    return sessionRefreshPromise
}

export const useAuthInit = () => {
    const location = useLocation()
    const [authChecked, setAuthChecked] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Run once per mount (not per route change) so navigation never re-fires the refresh.
    useEffect(() => {
        // Skip refresh-token on auth pages to save rate limit slots
        if (location.pathname.startsWith("/auth")) {
            setAuthChecked(true)
            return
        }

        if (getAccessToken()) {
            setIsAuthenticated(true)
            setAuthChecked(true)
            return
        }

        let cancelled = false
        refreshSessionOnce().then((authenticated) => {
            if (cancelled) return
            setIsAuthenticated(authenticated)
            setAuthChecked(true)
        })

        return () => {
            cancelled = true
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((token) => {
            setIsAuthenticated(!!token)
        })
        return unsubscribe
    }, [])

    return { authChecked, isAuthenticated }
}