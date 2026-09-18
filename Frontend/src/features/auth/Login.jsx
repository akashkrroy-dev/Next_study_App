import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import "./css/zRegister.css"
import { AnglesRight2 } from 'reicon-react';
import { Eye, EyeClosed } from 'reicon-react';
import { useToast } from "../../hooks/useToast.jsx"
import api from '../../config/api.js'
import { setAccessToken } from '../../config/tokenStore.js'
import OtpPopup from "./components/OtpPopup.jsx"

const Login = () => {

  const toast = useToast()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  // * btn animation (hover)
  const btnRef = useRef(null)
  const hoverTl = useRef(null)

  useGSAP(() => {
    hoverTl.current = gsap.timeline({ paused: true }).to(btnRef.current, {
      y: -3,
      scale: 1.02,
      boxShadow: "0 10px 24px rgba(255, 255, 255, 0.15)",
      duration: 0.35,
      ease: "power1.out"
    })
  }, { scope: btnRef })

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
  const playHover = () => hoverTl.current.play()
  const reverseHover = () => hoverTl.current.reverse()

  // ? btn animation click
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

  // ? api part

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const [otpRequired, setOtpRequired] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")

  // ? validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address"
        return ""

      case "password":
        if (!value) return "Password is required"
        return ""

      default:
        return ""
    }
  }

  const validateAll = () => {
    const newErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    }
    setErrors(newErrors)
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // * live-validate only after the field has been touched once
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    const newErrors = validateAll()
    const firstError = Object.values(newErrors).find((err) => err !== "")

    if (firstError) {
      toast.error(firstError)
      return
    }

    try {
      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(),
      }

      const res = await api.post("/auth/login", payload)

      if (res.data.requiresTwoFactor) {
        setPendingEmail(res.data.email || payload.email)
        setOtpRequired(true)
        return
      }

      setAccessToken(res.data.token)
      toast.success("Logged in successfully")
      navigate("/")

    } catch (error) {
       const message = error.response?.data?.message || "Something went wrong, please try again"
      toast.error(message)

      if (error.response?.data?.shouldRegister) {
        navigate("/auth/register", { state: { email: payload.email } })
      }
      return
    }
  }

  const handleVerifyOtp = async (otp) => {
    const res = await api.post("/auth/verify-otp", {
      email: pendingEmail,
      otp,
    })

    if (!res.data.success) {
      throw new Error(res.data.message || "Verification failed")
    }

    setAccessToken(res.data.token)
    return true
  }

  const handleResendOtp = async () => {
    const res = await api.post("/auth/resend-otp", {
      email: pendingEmail,
      purpose: "login",
    })
    if (!res.data.success) {
      throw new Error(res.data.message || "Couldn't send the code")
    }
    return true
  }

  return (
    <div className="register-page">
      <button className="auth-nav" type="button" onClick={() => navigate("/auth/register")}>
        <span>Sign up</span>
        <AnglesRight2 size={18} aria-hidden="true" />
      </button>
      <div className="auth-header login-header">
        <h3 className='auth-header-h'>Login with Email</h3>
        <p className="auth-header-p">Welcome back — log in to keep tracking your <span>tasks, habits, and schedule</span></p>
      </div>
      <div className="auth-form">
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>email</label>
            <input type="text"
              name='email'
              placeholder='enter email'
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur} />
          </div>

          <div>
            <label>password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                placeholder='enter new password'
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur} />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          <div className="forgot-password" onClick={() => navigate("/auth/reset-password")}>forgot pasword ?</div>
          <div className='btn'>
            <button
              ref={btnRef}
              type="submit"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={playHover}
              onMouseLeave={() => { reverseHover(); resetX(); }}
              onMouseMove={magnetMove}
              onClick={handleClick}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <OtpPopup
        show={otpRequired}
        type="login"
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onClose={() => setOtpRequired(false)}
        onSuccess={() => navigate("/")}
      />
    </div>
  )
}

export default Login