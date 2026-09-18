import { useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { applyTheme } from './js/applyTheme.js'

const ThemeSync = () => {
  const { settings, userLoading } = useUser()
  const appliedThemeRef = useRef(document.documentElement.getAttribute('data-theme')?.toUpperCase() || null)

  useEffect(() => {
    if (userLoading) return
    const theme = settings?.theme
    if (theme !== 'LIGHT' && theme !== 'DARK') return
    if (appliedThemeRef.current === theme) return
    appliedThemeRef.current = theme
    applyTheme(theme)
  }, [userLoading, settings])

  return null
}

export default ThemeSync