import React, { useState, useRef, useEffect } from 'react'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import "./css/zOtpPopup.css"
import { useToast } from "../../../hooks/useToast.jsx"

const RESEND_SECONDS = 60

const COPY = {
  register: {
    title: "Enter Verification Code",
    description: <>Check your inbox and enter the <span>OTP</span> we sent to verify your email address.</>,
    successToast: "Email verified",
  },
  "reset-password": {
    title: "Enter Verification Code",
    description: <>Check your inbox and enter the <span>OTP</span> we sent to reset your password.</>,
    successToast: "Code verified",
  },
  login: {
    title: "Two-Factor Code Required",
    description: <>Check your inbox and enter the <span>OTP</span> we sent to confirm this login.</>,
    successToast: "Logged in successfully",
  },
}

const OtpPopup = ({ show, type = "register", onClose, onVerify, onResend, onSuccess }) => {
  const toast = useToast()
  const copy = COPY[type] ?? COPY.register

  const popUpRef = useRef(null)
  const overlayRef = useRef(null)
  const otpInputRef = useRef([])

  const [otp, setOtp] = useState(Array(6).fill(""))
  const [submitting, setSubmitting] = useState(false)

  // ? resend countdown — resets to 60s every time the popup opens
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!show) return

    setSecondsLeft(RESEND_SECONDS)
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [show])

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return

    setResending(true)
    try {
      await onResend?.(type)
      toast.success("New code sent")
      setSecondsLeft(RESEND_SECONDS)
      setOtp(Array(6).fill(""))
      otpInputRef.current[0]?.focus()
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't resend the code, please try again")
    } finally {
      setResending(false)
    }
  }

  const hendleChangeOtp = (index, value) => {
    if (!/^\d*$/.test(value)) {
      shakeInput(index)
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpInputRef.current?.[index + 1]?.focus()
    }
  }

  const hendleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)

      if (index > 0) {
        otpInputRef.current[index - 1].focus()
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      otpInputRef.current[index - 1].focus()
    }

    if (e.key === "ArrowRight" && index < 5) {
      otpInputRef.current[index + 1].focus()
    }
  }

  const shakeInput = (index) => {
    const el = otpInputRef.current[index]
    if (!el) return

    el.classList.add("otp-error")

    gsap.fromTo(
      el,
      { x: -6 },
      {
        x: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.3)",
        onComplete: () => el.classList.remove("otp-error"),
      }
    )
  }

  const closePopUp = (afterClose) => {
    gsap.timeline({
      onComplete: () => {
        onClose?.()
        afterClose?.()
      },
    })
      .to(popUpRef.current, { y: "100%", duration: 0.35, ease: "power3.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, "<")
  }

  const hendleOtpSubmit = async () => {
    const enteredOtp = otp.join("")

    if (enteredOtp.length < 6) {
      toast.error("Enter the full 6-digit code")
      return
    }

    setSubmitting(true)
    let isCorrect = false
    try {
      isCorrect = await onVerify(enteredOtp, type)
    } catch (err) {
      toast.error("Something went wrong, please try again")
      setSubmitting(false)
      return
    }

    setSubmitting(false)

    if (!isCorrect) {
      toast.error("Invalid OTP, please try again")
      otpInputRef.current.forEach((_, i) => shakeInput(i))
      setOtp(Array(6).fill(""))
      otpInputRef.current[0]?.focus()
      return
    }

    toast.success(copy.successToast)
    closePopUp(onSuccess)
  }

  //* drag-to-close
  const dragStartY = useRef(0)
  const isDragging = useRef(false)
  const DRAG_ZONE_HEIGHT = 80

  const handleDragStart = (e) => {
    e.stopPropagation()

    const popupRect = popUpRef.current.getBoundingClientRect()
    const offsetFromTop = e.clientY - popupRect.top

    if (offsetFromTop > DRAG_ZONE_HEIGHT) return

    isDragging.current = true
    dragStartY.current = e.clientY
    gsap.killTweensOf(popUpRef.current)
    e.target.setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e) => {
    if (!isDragging.current) return

    const deltaY = e.clientY - dragStartY.current
    if (deltaY < 0) return

    gsap.set(popUpRef.current, { y: deltaY })
  }

  const handleDragEnd = (e) => {
    if (!isDragging.current) return
    isDragging.current = false

    const popupHeight = popUpRef.current.offsetHeight
    const deltaY = e.clientY - dragStartY.current
    const dragPercent = (deltaY / popupHeight) * 100

    if (dragPercent > 70) {
      closePopUp()
    } else {
      gsap.to(popUpRef.current, { y: "0%", duration: 0.4, ease: "power3.out" })
    }
  }

  useGSAP(() => {
    if (show) {
      setOtp(Array(6).fill(""))
      gsap.fromTo(
        popUpRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.5, ease: "power3.out",
          onComplete: () => otpInputRef.current[0]?.focus(),
         }
      )
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )
    }
  }, { dependencies: [show], scope: popUpRef })

  if (!show) return null

  return (
    <div className="otp-overlay" ref={overlayRef} onClick={() => closePopUp()}>
      <div
        className="otp-pop-up"
        ref={popUpRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDownCapture={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div className="otp-hearder">
          <h3 className="auth-header-h">{copy.title}</h3>
          <p className="auth-header-p">{copy.description}</p>
        </div>
        <div className="input-array">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (otpInputRef.current[index] = el)}
              value={value}
              maxLength={1}
              inputMode="numeric"
              onKeyDown={(e) => hendleKeyDown(index, e)}
              onChange={(e) => hendleChangeOtp(index, e.target.value)}
            />
          ))}
        </div>
        <div className="otp-submit">
          <button onClick={hendleOtpSubmit} disabled={submitting}>
            {submitting ? "verifying..." : "submit"}
          </button>
        </div>
        <div className="otp-resend">
          {secondsLeft > 0 ? (
            <p className="otp-resend-text">
              Resend code in <span>{formatTime(secondsLeft)}</span>
            </p>
          ) : (
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "sending..." : "Resend code"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OtpPopup