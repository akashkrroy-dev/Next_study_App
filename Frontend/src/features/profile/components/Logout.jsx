import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser, logoutAllDevices } from '../../../config/auth.api.js'
import { useUser } from '../../../context/UserContext.jsx'
import { useToast } from '../../../hooks/useToast.jsx'
import './css/zLogout.css'
import Header from '../../../components/ui/Header.jsx'

const Logout = () => {
  const navigate = useNavigate()
  const { updateUser } = useUser()
  const toast = useToast()

  const [loadingType, setLoadingType] = useState(null)
  const [confirmAll, setConfirmAll] = useState(false)

  const handleLogout = async () => {
    setLoadingType('device')
    try {
      await logoutUser()
      updateUser(null)
      navigate('/auth/login')
    } catch (err) {
      toast.error("Couldn't log you out, please try again")
    } finally {
      setLoadingType(null)
    }
  }

  const handleLogoutAll = async () => {
    if (!confirmAll) {
      setConfirmAll(true)
      return
    }
    setLoadingType('all')
    try {
      await logoutAllDevices()
      updateUser(null)
      navigate('/auth/login')
    } catch (err) {
      toast.error("Couldn't log you out from all devices, please try again")
    } finally {
      setLoadingType(null)
      setConfirmAll(false)
    }
  }

  return (
    <div className="logout_panel">
      <Header name="logout" variant="section" />

      <div className="logout_row">
        <div className="logout_info">
          <span className="logout_title">This device</span>
          <span className="logout_sub">End your session here only.</span>
        </div>
        <button
          className="logout_btn"
          onClick={handleLogout}
          disabled={loadingType !== null}
        >
          {loadingType === 'device' ? 'Logging out…' : 'Log out'}
        </button>
      </div>

      <div className="logout_row">
        <div className="logout_info">
          <span className="logout_title">Everywhere</span>
          <span className="logout_sub">End all sessions on every device, including this one.</span>
        </div>
        <button
          className={`logout_btn logout_btn_danger ${confirmAll ? 'logout_btn_confirm' : ''}`}
          onClick={handleLogoutAll}
          disabled={loadingType !== null}
          onBlur={() => setConfirmAll(false)}
        >
          {loadingType === 'all'
            ? 'Logging out…'
            : confirmAll
              ? 'Click again to confirm'
              : 'Log out everywhere'}
        </button>
      </div>
    </div>
  )
}

export default Logout