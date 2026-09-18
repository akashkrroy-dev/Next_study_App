import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import "./css/zRegister.css"
import { CircleArrowsRight } from 'reicon-react';
import { AnglesRight2 } from 'reicon-react';
import { useToast } from "../../hooks/useToast.jsx"
import { Eye, EyeClosed } from 'reicon-react';
import OtpPopup from './components/OtpPopup.jsx'
import api from '../../config/api.js'
import { setAccessToken } from '../../config/tokenStore.js'


const Register = () => {

  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)

  // ? btn animation (hover)
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

  // ? form state

  const [form, setForm] = useState({
    username: "",
    email: location.state?.email || "",
    password: "",
  })

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  })

  // ? validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required"
        if (value.length < 3) return "Username must be at least 3 characters"
        if (value.length > 20) return "Username must be under 20 characters"
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Only letters, numbers, and underscores allowed"
        return ""

      case "email":
        if (!value.trim()) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address"
        return ""

      case "password":
        if (!value) return "Password is required"
        if (value.length < 8) return "Password must be at least 8 characters"
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return "Password must contain a letter and a number"
        return ""

      default:
        return ""
    }
  }

  const validateAll = () => {
    const newErrors = {
      username: validateField("username", form.username),
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

    // ? live-validate only after the field has been touched once
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

  /* ==========================================================================
     API calls — everything network-related lives in this component.
     OtpPopup only calls handleVerifyOtp / handleResendOtp and reacts to
     true/false or a thrown error. It never talks to the backend directly.
     ========================================================================== */

  const [showPopUp, setPopUp] = useState(false)
  const [signingUp, setSigningUp] = useState(false)

  // * create the account (called on form submit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ username: true, email: true, password: true })

    const newErrors = validateAll()
    const firstError = Object.values(newErrors).find((err) => err !== "")

    if (firstError) {
      toast.error(firstError)
      return
    }

    setSigningUp(true)
    try {
      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(),
      }

      await api.post("/auth/register", payload)
      toast.success("Account created successfully")
      setPopUp(true)
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't create your account, please try again")
    } finally {
      setSigningUp(false)
    }
  }

  // * verify the OTP (called by <OtpPopup /> via onVerify)
  const handleVerifyOtp = async (otp, type) => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email: form.email.trim().toLowerCase(),
        otp,
      })

      setAccessToken(res.data.token)
      return res.data.success
    } catch (error) {
      throw error
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
      throw error 
    }
  }

  return (
    <div className="register-page">
      <button className="auth-nav" type="button" onClick={() => navigate("/auth/login")}>
        <span>Log in</span>
        <AnglesRight2 size={18} aria-hidden="true" />
      </button>
      <div className="auth-header register-header">
        <h3 className='auth-header-h'>Create your account</h3>
        <p className="auth-header-p">Create your <span>Account</span> and start organizing your tasks, habits, and schedule in one place</p>
      </div>
      <div className="auth-form">
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>username</label>
            <input type="text"
              name='username'
              placeholder='enter username'
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur} />
          </div>

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
          <div className='btn'>
            <button
              ref={btnRef}
              type="submit"
              disabled={signingUp}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={playHover}
              onMouseLeave={() => { reverseHover(); resetX(); }}
              onMouseMove={magnetMove}
              onClick={handleClick}
            >
              {signingUp ? "signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>

      <OtpPopup
        show={showPopUp}
        type="register"
        onClose={() => setPopUp(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onSuccess={() => navigate("/")}
      />
    </div>
  )
}

export default Register