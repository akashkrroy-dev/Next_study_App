import { useEffect, useRef } from "react"
import "./css/zGlobalBtn.css"

const Button = ({ text, onClick, icon: Icon, iconLocation = "start", type = "button", disabled = false, className = "", threshold = 0 }) => {
  const blockedRef = useRef(false)
  const timeoutRef = useRef(null)
  const showIconAtEnd = iconLocation === "end"
  const thresholdMs = Number.isFinite(threshold) && threshold > 0 ? threshold : 0

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
  }, [])

  const handleClick = (event) => {
    if (thresholdMs === 0) {
      onClick?.(event)
      return
    }

    if (blockedRef.current) return

    blockedRef.current = true
    onClick?.(event)
    timeoutRef.current = window.setTimeout(() => {
      blockedRef.current = false
      timeoutRef.current = null
    }, thresholdMs)
  }

  return (
    <button
      type={type}
      className={`global-btn${Icon ? " global-btn--with-icon" : ""}${className ? ` ${className}` : ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {Icon && !showIconAtEnd && <Icon className="global-btn__icon" size={16} aria-hidden="true" />}
      <span>{text}</span>
      {Icon && showIconAtEnd && <Icon className="global-btn__icon" size={16} aria-hidden="true" />}
    </button>
  )
}

export default Button
