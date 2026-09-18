import Button from "../../../components/ui/buttons/Button.jsx"
import useTodayClasses from "../hooks/useTodayClasses.js"
import AnalyticsLoading from "./AnalyticsLoading.jsx"
import NoclassToday from "./NoClassToday.jsx"
import { formatTime, hasClassStarted } from "../utils/helperFunction.js"


const TodayClasses = ({ onSetClasses }) => {
  const { hasAnyClasses, todayClasses, hasLoaded, loading, error, updatingId, handleToggle } = useTodayClasses()
  const attended = todayClasses.filter((item) => item.attended).length
  const markable = todayClasses.filter((item) => hasClassStarted(item) && !item.attended)

  if (loading && !hasLoaded) return <AnalyticsLoading variant="today" />
  if (error) return <p className="analytics-error" role="alert">{error}</p>

  return (
    <section className="analytics-card today-analytics">
      <div className="analytics-card__header">
        <div>
          <h2 className="font_sub_header">Today&apos;s classes</h2>
          <span className="analytics-count">{attended}/{todayClasses.length} attended</span>
        </div>
        {markable.length > 0 && (
          <Button
            text="All attended"
            onClick={async () => {
              for (const item of markable) await handleToggle(item)
            }}
            disabled={Boolean(updatingId)}
          />
        )}
      </div>
      {!todayClasses.length ? (
        <div className="analytics-empty"><NoclassToday hasClass={hasAnyClasses} onSetClasses={onSetClasses} /></div>
      ) : (
        <div className="today-analytics__list">
          {todayClasses.map((item) => {
            const canMark = hasClassStarted(item) || item.attended
            return (
              <div className={`today-analytics__item ${item.attended ? "attended" : ""}`} key={item._id} style={{ "--event-color": item.color }}>
                <div>
                  <strong>{item.name || item.title || "Class"}</strong>
                  <span>{formatTime(item.startTime || item.start)} - {formatTime(item.endTime || item.end)}</span>
                </div>
                {canMark && (
                  <Button
                    text={item.attended ? "Attended" : "Attend"}
                    onClick={() => handleToggle(item)}
                    disabled={updatingId === item._id}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TodayClasses
