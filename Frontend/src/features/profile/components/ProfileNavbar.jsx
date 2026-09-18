import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './css/zProfileNavbar.css'

const optionsPreferences = [
  { lable: 'account', path: '/profile' },
  { lable: 'notifications', path: '/profile/notifications' },
  { lable: 'password & security', path: '/profile/password' },
  { lable: 'appearance', path: '/profile/appearance' },
]

const optionsMore = [
  { lable: 'logout', path: '/profile/logout' }
]

const allOptions = [...optionsPreferences, ...optionsMore]

const ProfileNavbar = () => {

  const navigate = useNavigate()
  const [active, setActtive] = useState('/profile')

  const location = useLocation()

  useEffect(() => {
    const match = [...allOptions]
      .sort((a, b) => b.path.length - a.path.length)
      .find((el) => location.pathname === el.path)

    setActtive(match ? match.path : '/profile')
  }, [location.pathname])

  const hendleNavigate = (el) => {
    setActtive(el.path)
    navigate(el.path)
  }

  return (
    <div className='profile_sidebar_outer_div'>
      <div className="profile_preferences">
        <p>Preferences</p>
        {optionsPreferences.map((el) => (
          <div
            key={el.lable}
            onClick={() => hendleNavigate(el)}
            className={active === el.path ? 'active' : ''}
          >
            {el.lable}
          </div>
        ))}
      </div>

      <div className="profile_more">
        <p>More</p>
        {optionsMore.map((el) => (
          <div
            key={el.lable}
            onClick={() => hendleNavigate(el)}
            className={active === el.path ? 'active' : ''}
          >
            {el.lable}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileNavbar