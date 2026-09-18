import React from 'react'
import { useToast } from '../../hooks/useToast.jsx'
import ToastItem from './ToastItem.jsx'
import "./css/zToast.css"

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="toast-container">
        {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          message={t.message}
          type={t.type}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

export default ToastContainer