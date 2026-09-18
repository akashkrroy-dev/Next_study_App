const Progressbar = ({ total, attended, type }) => {

    const percentage = total > 0
        ? Number(Math.min(Math.max((Number(attended) / Number(total)) * 100, 0), 100).toFixed(2))
        : 0

    return (
        <div className="dashboard-progress" aria-label="Overall attendance progress">
            <div className="dashboard-progress__label">
                <strong>{type === "todo" ? "Todos" : "Attendance"}</strong>
                <span>{percentage}%</span>
            </div>
            <div
                className="dashboard-progress__bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={percentage}
            >
                <span style={{ width: `${percentage}%` }} />
            </div>

            { type === "attendance" && (<small>{attended} of {total} classes attended</small>)}
            { type === "todo" && (<small>{attended} of {total} todos completed</small>)}
        </div>
    )
}

export default Progressbar