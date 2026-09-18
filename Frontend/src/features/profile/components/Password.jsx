import React, { useEffect, useState } from 'react'
import { Eye, EyeClosed } from 'reicon-react'
import './css/zPassword.css'
import { useOutletContext } from 'react-router-dom'
import { getSessions, updatePassword } from '../../../config/settingsApi.js'
import Header from '../../../components/ui/Header.jsx'
import Button from '../../../components/ui/buttons/Button.jsx'

const formatLastActive = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  })
}

const Password = () => {

  const { updateChanges, settings } = useOutletContext()
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [eye, setEye] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [twoFactor, setTwoFactor] = useState(settings?.authLoginVerificationByOtp ?? false)
  const [sessions, setSessions] = useState([])
  const [passwordError, setPasswordError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [sessionsError, setSessionsError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (settings?.authLoginVerificationByOtp !== undefined) {
      setTwoFactor(settings.authLoginVerificationByOtp)
    }
  }, [settings?.authLoginVerificationByOtp])

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { data } = await getSessions()
        setSessions(data.session || [])
      } catch (error) {
        setSessionsError(error.response?.data?.message || 'Could not load active sessions.')
      }
    }

    loadSessions()
  }, [])

  const updateTowFactor = () => {
    setTwoFactor(!twoFactor)
    updateChanges('password', { twoFactorEnabled: !twoFactor })
  }

  const handlePasswordChange = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  
  const toggleEye = (field) => {
    setEye((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const updatePasswordRequest = async () => {
    setPasswordError('')
    setPasswordMessage('')

    if (!password.current || !password.new || !password.confirm) {
      setPasswordError('Please fill in all password fields.')
      return
    }
    if (password.new !== password.confirm) {
      setPasswordError('New passwords do not match.')
      return
    }

    setSavingPassword(true)
    try {
      await updatePassword({
        password: password.current,
        newPassword: password.new,
      })
      setPassword({ current: '', new: '', confirm: '' })
      setPasswordMessage('Password updated successfully.')
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Could not update your password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="password_panel">
      <Header name="password" variant="section" />

      <div className="update_password_section">
        <div className="field_group">
          <label>Current Password</label>
          <div className="input">
            <input
              type={eye.current ? 'text' : 'password'}
              name="current"
              placeholder="current password"
              value={password.current}
              onChange={handlePasswordChange}
            />
            <div className="eye_vector" onClick={() => toggleEye('current')}>
              {eye.current ? <Eye size={20} /> : <EyeClosed size={20} />}
            </div>
          </div>
        </div>

        <div className="field_group">
          <label>New Password</label>
          <div className="input">
            <input
              type={eye.new ? 'text' : 'password'}
              name="new"
              placeholder="new password"
              value={password.new}
              onChange={handlePasswordChange}
            />
            <div className="eye_vector" onClick={() => toggleEye('new')}>
              {eye.new ? <Eye size={20} /> : <EyeClosed size={20} />}
            </div>
          </div>
        </div>

        <div className="field_group">
          <label>Confirm Password</label>
          <div className="input">
            <input
              type={eye.confirm ? 'text' : 'password'}
              name="confirm"
              placeholder="confirm new password"
              value={password.confirm}
              onChange={handlePasswordChange}
            />
            <div className="eye_vector" onClick={() => toggleEye('confirm')}>
              {eye.confirm ? <Eye size={20} /> : <EyeClosed size={20} />}
            </div>
          </div>
        </div>

        <Button
          className="update_password"
          text={savingPassword ? 'Updating...' : 'Update Password'}
          onClick={updatePasswordRequest}
          disabled={savingPassword}
        />
        {passwordError && <p role="alert">{passwordError}</p>}
        {passwordMessage && <p role="status">{passwordMessage}</p>}
      </div>

      <div className="twostep_signin_section">
        <p className="section_label">Two-factor authentication</p>

        <div className="twostep_row">
          <div className="twostep_text">
            <h2>Require a code at sign-in</h2>
            <p>Adds a one-time code sent to your email as a second step.</p>
          </div>
          <div
            className={`toggle_btn ${twoFactor ? 'on' : ''}`}
            onClick={updateTowFactor}
          />
        </div>
      </div>

      <div className="session_info_section">
        <p className="section_label">Active sessions</p>
        {sessionsError && <p role="alert">{sessionsError}</p>}
        {sessions.map((s) => (
          <div className="session_row" key={s._id}>
            <div>
              <div className="session_device">
                {s.os} · {s.browser}
              </div>
              <div className="session_meta">{s.location} — last active {formatLastActive(s.lastTime)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Password