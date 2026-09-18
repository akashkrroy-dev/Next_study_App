import useTargetOverview from "../hooks/useTargetOverview.js"
import AnalyticsLoading from "./AnalyticsLoading.jsx"

const TargetOverview = () => {
  const { subjects, loading, hasLoaded, error } = useTargetOverview()

  if (loading && !hasLoaded) return <AnalyticsLoading variant="target" />
  if (error) return <p className="analytics-error" role="alert">{error}</p>

  return (
    <section className="analytics-card target-analytics">
      <div className="analytics-card__header">
        <div>
          <h2 className="font_sub_header">Attendance targets</h2>
          <p>Current attendance compared with each subject target.</p>
        </div>
      </div>
      {!subjects.length ? (
        <p className="analytics-empty">Add classes to calculate attendance targets.</p>
      ) : (
        <div className="target-analytics__list">
          {subjects.map((subject) => {
            const percent = Math.min(Math.max(Number(subject.currentPercent) || 0, 0), 100)
            const target = Math.min(Math.max(Number(subject.target) || 0, 0), 100)
            return (
              <div className="target-analytics__item" key={subject.subjectId}>
                <div className="target-analytics__label"><strong>{subject.name}</strong><span>{percent}% / {target}%</span></div>
                <div className="target-analytics__bar"><span style={{ width: `${percent}%` }} /><i style={{ left: `${target}%` }} /></div>
                <small>
                  {subject.mustAttend >= 1000000
                    ? "Attend every remaining class to meet your target"
                    : subject.mustAttend > 0
                      ? `Attend the next ${subject.mustAttend} class${subject.mustAttend === 1 ? "" : "es"}`
                      : `${subject.canBunk || 0} class${subject.canBunk === 1 ? "" : "es"} can be missed`}
                </small>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TargetOverview
