import axios from "axios"
import { clearAccessToken, getAccessToken, setAccessToken } from "./tokenStore.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api",
    withCredentials: true,
})

export default api;

api.interceptors.request.use((reqConfig) => {
    const token = getAccessToken()
    if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`
    }
    return reqConfig
})

let isRefreshing = false
let refreshQueue = []

const processQueue = (error, token = null) => {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve(token)
    })
    refreshQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url.includes("/refresh-token")
        ) {
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject })
            }).then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return api(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const { data } = await api.post("/auth/refresh-token")
            setAccessToken(data.token)
            processQueue(null, data.token)
            originalRequest.headers.Authorization = `Bearer ${data.token}`
            return api(originalRequest)
        } catch (refError) {
            processQueue(refError, null)
            clearAccessToken()
            const isRateLimited = refError.response?.status === 429
            const alreadyOnAuth = window.location.pathname.startsWith("/auth")
            if (!isRateLimited && !alreadyOnAuth) {
                window.location.href = "/auth/login"
            }
            return Promise.reject(refError)
        } finally {
            isRefreshing = false
        }
    }
)