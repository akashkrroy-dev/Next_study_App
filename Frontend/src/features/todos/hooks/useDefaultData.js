import { Temporal } from 'temporal-polyfill'

// * STATC DATA
export const priorityOptions = ["low", "medium", "high"]
export const todoCategoryOptions = ['Personal', 'Work']
export const todoPages = ["all", "today", "upcoming", "completed", "expired"]

// * DATE HELPERS
export const getDueDateOptions = () => {
  const today = Temporal.Now.plainDateISO()
  return [
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: today.add({ days: 1 }) },
    { label: 'Next Week', date: today.add({ days: 7 }) },
  ]
}

// * DATE HELPERS
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: 'numeric',
  month: 'short'
})

// For display in the UI
export const formatDate = (plainDate) =>
  dateFormatter.format(new Date(plainDate.year, plainDate.month - 1, plainDate.day))

// For save in DB: send a date-only "YYYY-MM-DD" string so it is never
// shifted by a UTC/midnight round-trip (never use toISOString for dates).
export const toDateOnly = (plainDate) =>
  `${plainDate.year}-${String(plainDate.month).padStart(2, "0")}-${String(plainDate.day).padStart(2, "0")}`

// Parse a stored date (Mongo Date serialized as ISO string) as date-only.
export const fromDateOnly = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ""))
  if (!match) return null
  return Temporal.PlainDate.from({
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  })
}