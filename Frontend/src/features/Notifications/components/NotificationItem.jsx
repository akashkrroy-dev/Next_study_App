import React from 'react'
import { useNotificationIcon } from '../hooks/useLogo.jsx'
import { useNotifications } from '../hooks/useNotification.js'
import './css/zNotificationItem.css'

function formatTime(createdAt) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const NotificationItem = ({ noti }) => {
  const { Icon } = useNotificationIcon(noti.type)
  const { markAsRead } = useNotifications()

  const handleClick = () => {
    if (noti.isRead) return

    markAsRead(noti._id)
  }

  return (
    <div 
    className={`noti_item_wrapper ${!noti.isRead ? 'is_unread' : ''}`} onClick={handleClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
        if(e.key === 'Enter' || e.key === ' ') handleClick()
    }}
    >
      <div className="icon_notification">
        <Icon size={20} />
      </div>

      <div className="main_notification">
        <div className="title_row">
          <span className="title">{noti.title}</span>
          <span className="time">{formatTime(noti.createdAt)}</span>
        </div>
        <p className="message">{noti.message}</p>
      </div>

      <div className="notification_is_seen">
        {!noti.isRead && <div className="notification_dot" aria-label="Unread" />}
      </div>
    </div>
  )
}

export default NotificationItem