import { COLOR_OPTIONS } from "./TimetableFormConstants.js"

const TimetableSubjectRow = ({
  name,
  target,
  color,
  onNameChange,
  onColorChange,
  onTargetChange,
  onNameKeyDown,
  disabled,
  actionType,
  onAction,
  actionDisabled,
  autoFocus,
}) => (
  <div className="subject-row">
    <input type="text" className="subject-input-name" placeholder="Subject name" value={name} onChange={(event) => onNameChange(event.target.value)} onKeyDown={onNameKeyDown} disabled={disabled} autoFocus={autoFocus} />
    <input
      type="text"
      className={`subject-input-target${Number(target) > 100 ? " subject-input-target--invalid" : ""}`}
      placeholder="Target"
      aria-label={`${name || "Subject"} target`}
      inputMode="numeric"
      maxLength={3}
      value={target ?? ""}
      onChange={(event) => {
        const value = event.target.value
        if (/^\d{0,3}$/.test(value)) {
          onTargetChange?.(value)
        }
      }}
      onKeyDown={onNameKeyDown}
      disabled={disabled}
    />
    <div className="custom-color-select-wrapper">
      <span className="color-dot" style={{ backgroundColor: color }} />
      <select className="custom-color-select" value={color} onChange={(event) => onColorChange(event.target.value)} disabled={disabled}>
        {COLOR_OPTIONS.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}
      </select>
    </div>
    <button type="button" className={`subject-row__btn subject-row__btn--${actionType}`} onClick={onAction} disabled={disabled || actionDisabled} title={actionType === "remove" ? "Remove subject" : "Add subject"} aria-label={actionType === "remove" ? `Remove ${name || "subject"}` : "Add subject"}>{actionType === "remove" ? <>&times;</> : "+"}</button>
  </div>
)

export default TimetableSubjectRow
