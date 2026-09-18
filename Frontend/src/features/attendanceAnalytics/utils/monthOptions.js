const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const toMonthStart = (value) => {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getMonthOptions = (timetable) => {
  const start = toMonthStart(timetable?.startDate)
  const end = toMonthStart(timetable?.endDate || new Date())
  const first = start <= end ? start : end
  const last = start <= end ? end : start
  const options = []
  const cursor = new Date(first)

  while (cursor <= last) {
    options.push({
      month: cursor.getMonth(),
      year: cursor.getFullYear(),
      label: `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`,
      value: `${cursor.getFullYear()}-${cursor.getMonth()}`,
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return options
}
