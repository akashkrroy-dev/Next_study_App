import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserSettings } from "../config/settingsApi.js";
import { subscribeToAuthChanges, getAccessToken } from "../config/tokenStore.js";
import { applyAccentColor } from "../utils/js/applyAccentColor.js";

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [settings, setSettings] = useState(null)
    const [userLoading, setUserLoading] = useState(true)

    const fatchUser = useCallback(async () => {
        if(!getAccessToken()){
            setUser(null)
            setSettings(null)
            setUserLoading(false)
            return
        }

        setUserLoading(true)
        try {
            const { data } = await getUserSettings()
            setUser(data.user)
            setSettings(data.settings)
            if (data.settings?.accent) applyAccentColor(data.settings.accent)
        } catch (error) {
            setUser(null)
        } finally {
            setUserLoading(false)
        }
    }, [])

    useEffect(() => {
        fatchUser()
        const unsubscribe = subscribeToAuthChanges(() => {
            fatchUser()
        })
        return unsubscribe
    }, [fatchUser])

    // patch specific fields on the current user without a refetch
    const updateUser = useCallback((updatedFields) => {
        setUser(prev => prev ? { ...prev, ...updatedFields } : prev)
    }, [])

    return (
        <UserContext.Provider value={{ user, userLoading, refetchUser: fatchUser, updateUser, settings, setSettings }} >{children} </UserContext.Provider>
    )
}

export const useUser = () => {
    const ctx = useContext(UserContext)
    if(!ctx) throw new Error("useUser must be use inside <UserProvider>")
    return ctx
}