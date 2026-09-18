import { useEffect, useMemo, useState } from "react"
import { useAttendance } from "../../../context/attendanceContext.jsx"
import useMonthlyGrid from "../hooks/useMonthlyGrid.js"
import { getMonthOptions } from "../utils/monthOptions.js"
import AnalyticsLoading from "./AnalyticsLoading.jsx"

const STATUS_LABELS = [["present", "Present"], ["absent", "Absent"], ["unrecorded", "Unrecorded"], ["future", "Future"]]

const defaultOptionValue = (options) => {
  const now = new Date()
  const current = `${now.getFullYear()}-${now.getMonth()}`
  return options.find((item) => item.value === current)?.value || options[options.length - 1]?.value || ""
}

const MonthlyGrid = () => {
  const { currentTimetable } = useAttendance()
  const options = useMemo(
    () => getMonthOptions(currentTimetable),
    [currentTimetable?._id, currentTimetable?.startDate, currentTimetable?.endDate]
  )
  const [selectedValue, setSelectedValue] = useState(() => defaultOptionValue(options))

  useEffect(() => {
    setSelectedValue((current) => (
      options.some((item) => item.value === current) ? current : defaultOptionValue(options)
    ))
  }, [options])

  const selected = options.find((item) => item.value === selectedValue)
  const selectedIndex = options.findIndex((item) => item.value === selectedValue)
  const { gridData, loading, error } = useMonthlyGrid(selected?.month, selected?.year)

  if (error) return <p className="analytics-error" role="alert">{error}</p>

  return (
    <section className="analytics-card monthly-analytics">
      <div className="analytics-card__header">
        <div>
          <h2 className="font_sub_header">Monthly attendance</h2>
          <p>{selected?.label || "Select a month"}</p>
        </div>
        {options.length > 0 && (
          <div className="monthly-analytics__actions">
            <button
              type="button"
              className="monthly-analytics__nav"
              onClick={() => setSelectedValue(options[selectedIndex - 1]?.value || selectedValue)}
              disabled={selectedIndex <= 0}
              aria-label="Previous month"
            >
              Previous
            </button>
            <label className="monthly-analytics__select-wrap">
              <select
                className="monthly-analytics__select"
                value={selectedValue}
                onChange={(event) => setSelectedValue(event.target.value)}
                aria-label="Attendance month"
              >
                {options.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="monthly-analytics__nav"
              onClick={() => setSelectedValue(options[selectedIndex + 1]?.value || selectedValue)}
              disabled={selectedIndex < 0 || selectedIndex >= options.length - 1}
              aria-label="Next month"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {loading && !gridData ? (
        <div className="analytics-loading" role="status" aria-live="polite" aria-label="Loading monthly attendance">
          <AnalyticsLoading variant="monthly" />
        </div>
      ) : !gridData?.subjects?.length ? (
        <p className="analytics-empty">No attendance data available yet.</p>
      ) : (
        <>
          <div className="monthly-analytics__legend">{STATUS_LABELS.map(([status, label]) => <span key={status}><i className={`status-${status}`} />{label}</span>)}</div>
          <div className="monthly-analytics__scroll">
            <div className="monthly-analytics__grid" style={{ gridTemplateColumns: `8rem repeat(${gridData.days.length}, minmax(1.35rem, 1fr))` }}>
              <strong>Subject</strong>
              {gridData.days.map((day) => <span className="monthly-analytics__day" key={day}>{day}</span>)}
              {gridData.subjects.map((subject) => (
                <div className="monthly-analytics__row" key={subject.subjectId}>
                  <strong>{subject.name}</strong>
                  {subject.cells.map((cell) => <span className={`monthly-analytics__cell status-${cell.status}`} key={`${subject.subjectId}-${cell.date}`} title={`${subject.name}, ${cell.date}`} />)}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default MonthlyGrid
