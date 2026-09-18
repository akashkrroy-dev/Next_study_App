import api from "./api.js"
import { clearAccessToken } from "./tokenStore.js"

export const logoutUser = async () => {
    try {
        const { data } = await api.post("/auth/logout")
        return data;
    } finally {
        clearAccessToken()
    }
}

export const logoutAllDevices = async () => {
  try {
    const { data } = await api.post("/auth/logout-from-anywhere")
    return data
  } finally {
    clearAccessToken()
  }
}