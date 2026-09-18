import { useState } from 'react'
import ProfileNavbar from './components/ProfileNavbar.jsx'
import { Outlet } from 'react-router-dom'
import { updateSettings } from '../../config/settingsApi.js'
import Header from '../../components/ui/Header.jsx'
import Button from '../../components/ui/buttons/Button.jsx'
import { useUser } from '../../context/UserContext.jsx'
import './Profile.css'

const ProfileAndSettings = () => {

  const [changes, setChanges] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { updateUser, setSettings, settings } = useUser()

  const updateChanges = (section, data) => {
    setChanges((prev) => ({
      ...prev,
      [section] : {
        ...prev[section],
        ...data,
      }
    }))
  }

  const saveChanges = async () => {
    if (Object.keys(changes).length === 0 || saving) return

    setSaving(true)
    setSaveError('')
    try {
      await updateSettings(changes)

      const settingsPatch = {}
      const userPatch = {}

      if (changes.appearance) Object.assign(settingsPatch, changes.appearance)
      if (changes.reminders) Object.assign(settingsPatch, changes.reminders)
      if (changes.notifications) Object.assign(settingsPatch, changes.notifications)

      if (changes.account) {
        if (changes.account.username) userPatch.username = changes.account.username
        if (changes.account.timezone) {
          userPatch.timezone = changes.account.timezone
          settingsPatch.timezone = changes.account.timezone
        }
      }

      if (changes.password?.twoFactorEnabled !== undefined) {
        settingsPatch.authLoginVerificationByOtp = changes.password.twoFactorEnabled
      }

      if (Object.keys(settingsPatch).length > 0) {
        setSettings(current => ({ ...current, ...settingsPatch }))
      }
      if (Object.keys(userPatch).length > 0) {
        updateUser(userPatch)
      }

      setChanges({})
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Could not save your changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='wrapper_profile_and_setting_layout'>
      <div className="topbar_profile">
        <Header name="settings" variant="page" />
        <Button
          text={saving ? 'Saving...' : 'Save Changes'}
          onClick={saveChanges}
          disabled={saving || Object.keys(changes).length === 0}
        />
        {saveError && <p role="alert">{saveError}</p>}
      </div>
      <div className="content_row_profile">
        <div className="sidebar_ineer_prodile">
          <ProfileNavbar />
        </div>
        <div className="outlet_ineer_profile">
          <Outlet context={{ updateChanges, settings }} />
        </div>
      </div>
    </div>
  )
}

export default ProfileAndSettings