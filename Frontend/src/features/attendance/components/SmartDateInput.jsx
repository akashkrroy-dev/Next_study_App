import { useRef, useCallback } from "react"

const daysInMonth = (month, year) => {
  if (!month) return 31
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    return isLeap ? 29 : 28
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31
}

export const isValidDateValue = (value) => {
  if (typeof value !== "string" || value.length !== 10) return false
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 2000 || year > 3000) return false
  if (month < 1 || month > 12) return false
  return day >= 1 && day <= daysInMonth(month, year)
}

const parseSegments = (value) => {
  if (!value) return { dd: "", mm: "", yyyy: "" }
  const parts = value.split("-")
  return { dd: parts[2] || "", mm: parts[1] || "", yyyy: parts[0] || "" }
}

const toValue = ({ yyyy, mm, dd }) => {
  if (!yyyy && !mm && !dd) return ""
  if (yyyy.length < 4) return ""
  const m = mm || ""
  const d = dd || ""
  let out = yyyy
  if (m) out += `-${m}`
  else return out
  if (d) out += `-${d}`
  return out
}

const hasError = ({ yyyy, mm, dd }) => {
  const y = Number(yyyy)
  const m = Number(mm)
  const d = Number(dd)
  if (yyyy.length === 4 && (y < 2000 || y > 3000)) return true
  if (mm.length === 2 && (m < 1 || m > 12)) return true
  if (dd.length === 2 && mm.length === 2 && (d < 1 || d > daysInMonth(m, y || 2000))) return true
  return false
}

const cleanDigits = (raw, max) => {
  return String(raw || "").replace(/\D+/g, "").slice(0, max)
}

const SmartDateInput = ({ value = "", onChange, name = "", required = false, className = "" }) => {
  const dayRef = useRef(null)
  const monthRef = useRef(null)
  const yearRef = useRef(null)

  const segs = parseSegments(value)

  const emit = useCallback(
    (next) => {
      const merged = toValue(next)
      if (merged !== value) onChange(merged)
    },
    [value, onChange]
  )

  const focusRef = (ref) => {
    window.requestAnimationFrame(() => ref.current?.focus())
  }

  const handleDay = (e) => {
    const dd = cleanDigits(e.target.value, 2)
    emit({ ...segs, dd })
    if (dd.length === 2) focusRef(monthRef)
  }

  const handleMonth = (e) => {
    const mm = cleanDigits(e.target.value, 2)
    emit({ ...segs, mm })
    if (mm.length === 2) focusRef(yearRef)
  }

  const handleYear = (e) => {
    const yyyy = cleanDigits(e.target.value, 4)
    emit({ ...segs, yyyy })
  }

  const handleKeyDown = (e, field) => {
    // Backspace on an empty field: step back and clear the previous field's last digit
    if (e.key === "Backspace" && !e.target.value) {
      if (field === "month") {
        e.preventDefault()
        const next = { ...segs, mm: "", dd: segs.dd.slice(0, -1) }
        emit(next)
        focusRef(dayRef)
      } else if (field === "year") {
        e.preventDefault()
        const next = { ...segs, yyyy: "", mm: segs.mm.slice(0, -1) }
        emit(next)
        focusRef(monthRef)
      }
      return
    }

    if (e.key === "ArrowLeft" && e.target.selectionStart === 0) {
      e.preventDefault()
      if (field === "month") focusRef(dayRef)
      else if (field === "year") focusRef(monthRef)
      return
    }

    if (e.key === "ArrowRight" && e.target.selectionStart === e.target.value.length) {
      e.preventDefault()
      if (field === "day") focusRef(monthRef)
      else if (field === "month") focusRef(yearRef)
      return
    }

    if (e.key === "Enter") e.preventDefault()
  }

  const handleBlur = () => {
    emit({
      yyyy: segs.yyyy,
      mm: segs.mm.length === 1 && /[1-9]/.test(segs.mm) ? `0${segs.mm}` : segs.mm,
      dd: segs.dd.length === 1 && /[1-9]/.test(segs.dd) ? `0${segs.dd}` : segs.dd,
    })
  }

  const invalid = hasError(segs)

  return (
    <div
      className={`smart-date-input ${invalid ? "smart-date-input--invalid" : ""} ${className || ""}`.trim()}
      data-field={name || undefined}
    >
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD"
        maxLength={2}
        value={segs.dd}
        onChange={handleDay}
        onKeyDown={(e) => handleKeyDown(e, "day")}
        onBlur={handleBlur}
        aria-required={required || undefined}
        data-segment="dd"
      />
      <span className="smart-date-input__sep" aria-hidden="true" />
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM"
        maxLength={2}
        value={segs.mm}
        onChange={handleMonth}
        onKeyDown={(e) => handleKeyDown(e, "month")}
        onBlur={handleBlur}
        aria-required={required || undefined}
        data-segment="mm"
      />
      <span className="smart-date-input__sep" aria-hidden="true" />
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="YYYY"
        maxLength={4}
        value={segs.yyyy}
        onChange={handleYear}
        onKeyDown={(e) => handleKeyDown(e, "year")}
        onBlur={handleBlur}
        aria-required={required || undefined}
        data-segment="yyyy"
      />
    </div>
  )
}

export default SmartDateInput