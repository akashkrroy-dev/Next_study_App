const AnalyticsLoading = ({ variant = "default" }) => (
  <div className={`analytics-card analytics-card--loading analytics-card--loading-${variant}`} aria-busy="true">
    <span className="analytics-skeleton analytics-skeleton--title" />
    <span className="analytics-skeleton analytics-skeleton--line" />
    <span className="analytics-skeleton analytics-skeleton--line analytics-skeleton--short" />
  </div>
)

export default AnalyticsLoading
