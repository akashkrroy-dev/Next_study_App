export const formatTime = (value) => {
  if (!value) return "--:--"
  const [hour, minute] = String(value).split(":").map(Number)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return value
  const suffix = hour >= 12 ? "PM" : "AM"
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`
}

export const hasClassStarted = (item) => {
  const raw = String(item.startTime || item.start || "")
  const [hour, minute] = raw.split(":").map(Number)
  if (!Number.isInteger(hour)) return true
  const start = new Date()
  start.setHours(hour, Number.isInteger(minute) ? minute : 0, 0, 0)
  return Date.now() >= start.getTime()
}