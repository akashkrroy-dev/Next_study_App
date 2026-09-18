import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import "./css/zRegister.css"
import { AnglesRight2 } from 'reicon-react'; // NOTE: removed unused `User` import
import { useToast } from "../../hooks/useToast.jsx"
import { Eye, EyeClosed } from 'reicon-react';
import OtpPopup from './components/OtpPopup.jsx'
import api from '../../config/api.js'


const ResetPassword = () => {

  const toast = useToast()
  const navigate = useNavigate()

  const [showPopUp, setPopUp] = useState(false)

  // * step control — email -> otp popup -> new password
  const [step, setStep] = useState("email") // "email" | "password"

  // * The reset token itself is NOT handled here — the backend sets it as an
  const [otpVerified, setOtpVerified] = useState(false)

  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [touched, setTouched] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
  })

  // ? btn animation (hover) — shared magnetic button used by BOTH steps
  const btnRef = useRef(null)
  const hoverTl = useRef(null)

  useGSAP(() => {
    if (!btnRef.current) return
    hoverTl.current = gsap.timeline({ paused: true }).to(btnRef.current, {
      y: -3,
      scale: 1.02,
      boxShadow: "0 10px 24px rgba(255, 255, 255, 0.15)",
      duration: 0.35,
      ease: "power1.out"
    })
  }, { scope: btnRef, dependencies: [step] })

  const magnetMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    gsap.to(btnRef.current, {
      x: relX * 6,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    })
  }

  const resetX = () => {
    gsap.to(btnRef.current, { x: 0, duration: 0.4, ease: "power2.out" })
  }
  const playHover = () => hoverTl.current?.play()
  const reverseHover = () => hoverTl.current?.reverse()

  const handleClick = (e) => {
    gsap.timeline()
      .to(btnRef.current, { scale: 0.96, duration: 0.1, ease: "power2.out" })
      .to(btnRef.current, { scale: 1.02, duration: 0.25, ease: "back.out(3)" })
      .to(btnRef.current, { scale: 1, duration: 0.15, ease: "power2.out" })

    const rect = btnRef.current.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const ripple = document.createElement("span")
    ripple.className = "ripple"
    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px"
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px"
    btnRef.current.appendChild(ripple)

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
      }
    )
  }

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address"
        return ""

      case "newPassword":
        if (!value) return "Password is required"
        if (value.length < 8) return "Password must be at least 8 characters"
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return "Password must contain a letter and a number"
        return ""

      case "confirmPassword":
        if (!value) return "Please confirm your password"
        if (value !== form.newPassword) return "Passwords do not match"
        return ""

      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  /* ==========================================================================
     API calls — everything network-related lives in this component.
     OtpPopup only calls handleVerifyOtp(otp) and reacts to true/false.
     ========================================================================== */

  // * step 1 — request OTP by email
  const [sendingCode, setSendingCode] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setTouched((prev) => ({ ...prev, email: true }))

    const emailError = validateField("email", form.email)
    setErrors((prev) => ({ ...prev, email: emailError }))

    if (emailError) {
      toast.error(emailError)
      return
    }

    setSendingCode(true)
    try {
      const res = await api.post("/auth/request-password-reset", { email: form.email.trim().toLowerCase() })

      toast.success("Verification code sent to your email")
      setPopUp(true)
    } catch (err) {
      toast.error("Couldn't send the code, please try again")
    } finally {
      setSendingCode(false)
    }
  }

  // * step 2a — verify the OTP (called by <OtpPopup /> via onVerify)
  const handleVerifyOtp = async (otp, type) => {
    try {
      const res = await api.post("/auth/verify-password-reset", { email: form.email.trim().toLowerCase(), otp })

      if (res.data.success) {
        setOtpVerified(true)
      }

      return res.data.success
    } catch (error) {
      return false
    }
  }

  // * resend the OTP (called by <OtpPopup /> via onResend, once the 1-min timer hits 0)
  const handleResendOtp = async (type) => {
    try {
      const res = await api.post("/auth/resend-otp", {
        email: form.email.trim().toLowerCase(),
        purpose: type,
      })

      return res.data.success
    } catch (error) {
      return false
    }
  }

  // * step 2b — set new password (after OTP verified)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setTouched((prev) => ({ ...prev, newPassword: true, confirmPassword: true }))

    const newErrors = {
      newPassword: validateField("newPassword", form.newPassword),
      confirmPassword: validateField("confirmPassword", form.confirmPassword),
    }
    setErrors((prev) => ({ ...prev, ...newErrors }))

    const firstError = Object.values(newErrors).find((err) => err !== "")
    if (firstError) {
      toast.error(firstError)
      return
    }

    if (!otpVerified) {
      toast.error("Please verify your email first")
      setStep("email")
      return
    }

    setResettingPassword(true)
    try {
      const res = await api.post("/auth/reset-password", {
        email: form.email,
        newPassword: form.newPassword,
      })

      toast.success("Password reset successfully")
      setOtpVerified(false)
      navigate("/auth/login")
    } catch (err) {
      toast.error("Couldn't reset your password, please try again")
    } finally {
      setResettingPassword(false)
    }
  }


  return (
    <div className="register-page">
      <button className="auth-nav" type="button" onClick={() => navigate("/auth/login")}>
        <span>Log in</span>
        <AnglesRight2 size={18} aria-hidden="true" />
      </button>

      {step === "email" && (
        <>
          <div className="auth-header login-header">
            <h3 className='auth-header-h'>Reset your password</h3>
            <p className="auth-header-p">Enter your email and we'll send you a <span>verification code</span> to reset your password</p>
          </div>
          <div className="auth-form">
            <form onSubmit={handleEmailSubmit} noValidate>
              <div>
                <label>email</label>
                <input type="text"
                  name='email'
                  placeholder='enter email'
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur} />
              </div>
              <div className='btn'>
                <button
                  ref={btnRef}
                  type="submit"
                  disabled={sendingCode}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={playHover}
                  onMouseLeave={() => { reverseHover(); resetX(); }}
                  onMouseMove={magnetMove}
                  onClick={handleClick}
                >
                  {sendingCode ? "sending..." : "Send code"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {step === "password" && (
        <>
          <div className="auth-header login-header">
            <h3 className='auth-header-h'>Set a new password</h3>
            <p className="auth-header-p">Choose a <span>strong password</span> you haven't used before</p>
          </div>
          <div className="auth-form">
            <form onSubmit={handlePasswordSubmit} noValidate>
              <div>
                <label>new password</label>
                <div className="password-field">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name='newPassword'
                    placeholder='enter new password'
                    value={form.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur} />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeClosed size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>

              <div>
                <label>confirm password</label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name='confirmPassword'
                    placeholder='re-enter new password'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur} />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeClosed size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>

              <div className='btn'>
                <button
                  ref={btnRef}
                  type="submit"
                  disabled={resettingPassword}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={playHover}
                  onMouseLeave={() => { reverseHover(); resetX(); }}
                  onMouseMove={magnetMove}
                  onClick={handleClick}
                >
                  {resettingPassword ? "resetting..." : "Reset password"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <OtpPopup
        show={showPopUp}
        type="reset-password"
        onClose={() => setPopUp(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onSuccess={() => setStep("password")}
      />
    </div>
  )
}

export default ResetPassword