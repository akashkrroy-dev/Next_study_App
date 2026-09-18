import React, { useRef } from 'react'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

const ToastItem = ({ id, message, type, onClose, duration = 3000 }) => {
  const itemRef = useRef(null)

  useGSAP(() => {
    // ? play in
    gsap.fromTo(
      itemRef.current,
      { y: -20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    )

    const timer = setTimeout(() => {
      gsap.to(itemRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => onClose(id),
      })
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={itemRef} className={`toast-item toast-${type}`}>
      {message}
    </div>
  )
}

export default ToastItem