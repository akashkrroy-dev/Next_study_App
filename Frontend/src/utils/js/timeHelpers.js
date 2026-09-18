export const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const formatTime = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m.toString().padStart(2, '0')}`
}

export const formatTime24 = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, "0")
  const m = (mins % 60).toString().padStart(2, "0")
  return `${h}:${m}`
}

export const parseTime24 = (str) => {
  const match = str.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}