import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext.jsx'
import { useOutletContext } from 'react-router-dom'
import Avtar from './Avatar.jsx'
import Header from '../../../components/ui/Header.jsx'
// import { uploadProfileImg } from '../../../config/profile.api.js'
import './css/zAccount.css'

// TODO: need to make timezone a dropdown

const Account = () => {

  const { updateChanges } = useOutletContext()
  const { user, userLoading } = useUser()
  // const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    username: '',
    email: '',
    timezone: 'Asia/Kolkata'
  })
  // const [uploadingAvatar, setUploadingAvatar] = useState(false)
  // const [avatarError, setAvatarError] = useState('')

  useEffect(() => {
    if (!userLoading && user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        timezone: user.timezone || 'Asia/Kolkata'
      }))
    }
  }, [userLoading, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    updateChanges('account', { [name]: value })
  }

  // * Avatar upload disabled for now: no working image-change route/API.
  // const handleAvatarClick = () => {
  //   fileInputRef.current?.click()
  // }

  // const handleFileSelect = async (e) => {
  //   const file = e.target.files?.[0]
  //   e.target.value = ''
  //   if (!file || uploadingAvatar) return
  //   if (!file.type.startsWith("image/")) {
  //     setAvatarError("Please choose an image file.")
  //     return
  //   }

  //   setUploadingAvatar(true)
  //   setAvatarError('')
  //   try {
  //     const dataUrl = await new Promise((resolve, reject) => {
  //       const reader = new FileReader()
  //       reader.onload = () => resolve(reader.result)
  //       reader.onerror = () => reject(new Error("Could not read the image file."))
  //       reader.readAsDataURL(file)
  //     })
  //     const updatedUser = await uploadProfileImg({ url: dataUrl })
  //     updateUser({ profileImg: updatedUser.profileImg })
  //   } catch (error) {
  //     setAvatarError(error.response?.data?.message || error.message || "Could not update your profile photo.")
  //   } finally {
  //     setUploadingAvatar(false)
  //   }
  // }

  return (
    <div className="account_panel">
      <Header name="account" variant="section" />

      <div className="profile_identity">
        <div className="avatar_upload_btn" aria-label="Profile picture">
          <Avtar username={user?.username} imgUrl={user?.profileImg?.url} size={80} />
          {/* <span className="avatar_upload_overlay">{uploadingAvatar ? 'Uploading…' : 'Edit'}</span> */}
        </div>
        <div className="profile_identity_text">
          <strong>{form.username || 'Your profile'}</strong>
          <span>{form.email || 'Add your email address'}</span>
          {/* {avatarError && <p className="avatar_upload_error" role="alert">{avatarError}</p>} */}
          {/* <button type="button" className="change_photo_btn" onClick={handleAvatarClick} disabled={uploadingAvatar}>
            Change photo
          </button> */}
        </div>
        {/* <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          hidden
        /> */}
      </div>

      <div className="account_section_heading">
        <span>Profile information</span>
        <p>Keep your personal details up to date.</p>
      </div>

      <div className="account_fields">
        <div className="field">
          <label htmlFor="account-username">Username</label>
          <input
            id="account-username"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="account-email">Email</label>
          <input
            id="account-email"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            disabled
            readOnly
          />
          <small>Email can’t be changed here.</small>
        </div>

        <div className="field">
          <label htmlFor="account-timezone">Time zone</label>
          <select
            id="account-timezone"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
            <option value="UTC">UTC (GMT+0:00)</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Account