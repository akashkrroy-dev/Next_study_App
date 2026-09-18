import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import "../components/css/zTimetableLayout.css"
import "./css/zTimetableSkeleton.css"

// * CONSTANTS — identical to TimetableLayout so the skeleton lines up exactly
const START_HOUR = 7
const HOURS_TO_SHOW = 12
const GRID_DURATION = HOURS_TO_SHOW * 60
const DAYS_TO_SHOW = 7
const slots = Array.from({ length: HOURS_TO_SHOW }, (_, index) => START_HOUR + index)

// Placeholder blocks keep the timetable structure visible while data is loading
const dummyClasses = [
  { _id: "sk-1", day: 0, startTime: "09:00", endTime: "10:30" },
  { _id: "sk-2", day: 1, startTime: "11:00", endTime: "12:00" },
  { _id: "sk-3", day: 2, startTime: "08:00", endTime: "09:45" },
  { _id: "sk-4", day: 3, startTime: "13:00", endTime: "14:00" },
  { _id: "sk-5", day: 4, startTime: "10:00", endTime: "11:30" },
  { _id: "sk-6", day: 5, startTime: "09:30", endTime: "10:15" },
]

const timeToMinutes = (time) => {
  const [hours, minutes] = String(time).split(":").map(Number)
  return hours * 60 + minutes
}

const TimetableLayoutSkeleton = () => {
  const shimmerRefs = useRef([])
  shimmerRefs.current = []

  const addShimmerRef = (element) => {
    if (element && !shimmerRefs.current.includes(element)) {
      shimmerRefs.current.push(element)
    }
  }

  useEffect(() => {
    const tween = gsap.fromTo(
      shimmerRefs.current,
      { backgroundPosition: "-150% 0" },
      {
        backgroundPosition: "150% 0",
        duration: 1.4,
        ease: "sine.inOut",
        repeat: -1,
        stagger: 0.06,
      }
    )
    return () => tween.kill()
  }, [])

  const startOfGrid = START_HOUR * 60

  return (
    <section className="timetable-hour-grid timetable-hour-grid--skeleton" aria-label="Loading timetable" aria-busy="true">
      <div className="timetable-hour-grid__corner" />

      {slots.map((hour) => (
        <div className="timetable-hour-grid__hour" key={hour}>
          {hour > 12 ? hour - 12 : hour}:00
        </div>
      ))}

      {Array.from({ length: DAYS_TO_SHOW }).map((_, dayIndex) => (
        <div className="timetable-hour-grid__day-row" key={dayIndex}>
          <div className="timetable-hour-grid__day-label">
            <span className="skeleton-bar skeleton-shimmer" style={{ width: "1.75rem", height: "0.7rem" }} ref={addShimmerRef} />
            <span className="skeleton-bar skeleton-shimmer" style={{ width: "1.25rem", height: "0.55rem" }} ref={addShimmerRef} />
          </div>

          {slots.map((hour) => (
            <div className="timetable-hour-grid__slot" key={`${dayIndex}-${hour}`} />
          ))}
        </div>
      ))}

      <div className="timetable-hour-grid__classes">
        {dummyClasses.map((classItem) => {
          const start = timeToMinutes(classItem.startTime)
          const end = timeToMinutes(classItem.endTime)

          return (
            <div
              className="timetable-hour-grid__class timetable-hour-grid__class--skeleton"
              key={classItem._id}
              style={{
                "--class-top": `${classItem.day * 3.5}rem`,
                "--class-start": `${((start - startOfGrid) / GRID_DURATION) * 100}%`,
                "--class-duration": `${((end - start) / GRID_DURATION) * 100}%`,
              }}
            >
              <span className="skeleton-bar skeleton-shimmer" style={{ width: "70%", height: "0.7rem" }} ref={addShimmerRef} />
              <span className="skeleton-bar skeleton-shimmer" style={{ width: "45%", height: "0.55rem", marginTop: "0.3rem" }} ref={addShimmerRef} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TimetableLayoutSkeleton