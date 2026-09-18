import { useEffect, useMemo, useState } from "react"
import { useTimetable } from "../hooks/useTimetable.js"
import Button from "../../../components/ui/buttons/Button.jsx"
import SecondaryButton from "../../../components/ui/buttons/SecondaryButton.jsx"
import TimetableSubjectRow from "./TimetableSubjectRow.jsx"
import SmartDateInput, { isValidDateValue } from "./SmartDateInput.jsx"
import { COLOR_OPTIONS } from "./TimetableFormConstants.js"
import "./css/zCreateTimeTableForm.css"

const toDateInput = (value) => {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
const newSubject = () => ({ name: "", target: "", color: COLOR_OPTIONS[0] })
const hasInvalidTarget = (subject) => Number(subject.target) > 100
const toTargetString = (target) => (target === "" ? "75" : String(target))

const UpdateTimetableForm = ({ timetable, onClose }) => {
  const { updateTimetable, updateVisibility, timetableLoading } = useTimetable()
  const [copied, setCopied] = useState(false)
  const [visibility, setVisibility] = useState(timetable?.visibility || "public")
  const [visibilitySaving, setVisibilitySaving] = useState(false)
  const initialMetadata = useMemo(() => ({
    name: timetable?.name || "",
    startDate: toDateInput(timetable?.startDate),
    endDate: toDateInput(timetable?.endDate),
  }), [timetable])
  const initialSubjects = useMemo(() => (timetable?.subjects || []).map((subject) => ({
    subjectId: subject.subjectId,
    name: subject.name || "",
    target: String(subject.target ?? ""),
    color: subject.color || COLOR_OPTIONS[0],
  })), [timetable])

  const [metadata, setMetadata] = useState(initialMetadata)
  const [subjects, setSubjects] = useState(initialSubjects)
  const [draft, setDraft] = useState(newSubject())
  const [error, setError] = useState("")

  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && onClose?.()
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const updateSubject = (index, field, value) => setSubjects((current) => current.map((subject, itemIndex) => (
    itemIndex === index ? { ...subject, [field]: value } : subject
  )))

  const addSubject = () => {
    const name = draft.name.trim()
    if (!name) return
    setSubjects((current) => [...current, { ...draft, name }])
    setDraft(newSubject())
  }

  const togglePrivacy = async () => {
    if (visibilitySaving) return
    const next = visibility === "public" ? "private" : "public"
    setVisibilitySaving(true)
    setError("")
    try {
      await updateVisibility(timetable._id, next)
      setVisibility(next)
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to change privacy.")
    } finally {
      setVisibilitySaving(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (timetableLoading) return
    setError("")

    const name = metadata.name.trim()
    const startDateValid = isValidDateValue(metadata.startDate)
    const startDate = startDateValid ? new Date(`${metadata.startDate}T00:00:00`) : null
    const endDateValid = !metadata.endDate || isValidDateValue(metadata.endDate)
    const endDate = metadata.endDate ? new Date(`${metadata.endDate}T00:00:00`) : null
    if (name.length < 2) return setError("Timetable name must contain at least 2 characters.")
    if (!startDateValid) return setError("Choose a valid schedule start date (YYYY-MM-DD).")
    if (!endDateValid) return setError("Choose a valid schedule end date (YYYY-MM-DD).")
    if (endDate && startDate && endDate <= startDate) return setError("End date must be later than start date.")
    if (!subjects.length || subjects.some((subject) => !subject.name.trim())) return setError("Keep at least one named subject.")
    if (subjects.some(hasInvalidTarget)) return setError("Subject targets must be between 0 and 100.")

    const updates = []
    const timetableUpdate = { type: "update_timetable" }
    if (name !== initialMetadata.name) timetableUpdate.name = name
    if (metadata.startDate !== initialMetadata.startDate) timetableUpdate.startDate = metadata.startDate
    if (metadata.endDate !== initialMetadata.endDate) timetableUpdate.endDate = metadata.endDate || null
    if (Object.keys(timetableUpdate).length > 1) updates.push(timetableUpdate)

    const currentIds = new Set(subjects.filter((subject) => subject.subjectId).map((subject) => subject.subjectId))
    initialSubjects.forEach((subject) => {
      if (!currentIds.has(subject.subjectId)) updates.push({ type: "remove_subject", subjectId: subject.subjectId })
    })
    subjects.forEach((subject) => {
      const subjectName = subject.name.trim()
      if (!subject.subjectId) {
        updates.push({ type: "add_subject", name: subjectName, target: toTargetString(subject.target), color: subject.color })
        return
      }
      const original = initialSubjects.find((item) => item.subjectId === subject.subjectId)
      const update = {}
      if (subjectName !== original.name) update.name = subjectName
      if (subject.target !== original.target) update.target = toTargetString(subject.target)
      if (subject.color !== original.color) update.color = subject.color
      if (Object.keys(update).length) updates.push({ type: "update_subject", id: subject.subjectId, update })
    })

    if (!updates.length) return onClose?.()
    try {
      await updateTimetable(timetable._id, updates)
      onClose?.()
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update timetable. Please try again.")
    }
  }

  return (
    <div className="timetable-form-overlay" onClick={onClose}>
      <div className="timetable-form" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Update timetable">
        <header className="timetable-form__header">
          <h4>Edit timetable</h4>
          <button type="button" className="timetable-form__close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </header>
        <form onSubmit={handleSubmit} className="timetable-form__content">
          <div className="timetable-form__body">
            <div className="form-field"><span>Timetable name</span><input name="name" value={metadata.name} onChange={(event) => setMetadata((current) => ({ ...current, name: event.target.value }))} autoFocus /></div>
            <div className="form-field">
              <span>Slug</span>
              <div className="form-field__copy">
                <input readOnly value={timetable?.slug || ""} onFocus={(event) => event.target.select()} />
                <SecondaryButton
                  text={copied ? "Copied" : "Copy"}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(timetable?.slug || "")
                      setCopied(true)
                      window.setTimeout(() => setCopied(false), 1500)
                    } catch {
                      setError("Unable to copy slug.")
                    }
                  }}
                />
              </div>
            </div>
            <div className="form-field">
              <span>Sharing</span>
              <div className="form-field__privacy">
                <span className="form-field__privacy-label">
                  {visibility === "public"
                    ? "Public — anyone with your slug can copy it"
                    : "Private — only you can copy it"}
                </span>
                <div
                  className={`toggle_btn ${visibility === "private" ? "on" : ""}`}
                  onClick={togglePrivacy}
                  role="switch"
                  aria-checked={visibility === "private"}
                  aria-label="Timetable visibility"
                />
              </div>
            </div>
            <div className="form-section--row">
              <div className="form-field"><span>Start date</span><SmartDateInput name="startDate" value={metadata.startDate} onChange={(value) => setMetadata((current) => ({ ...current, startDate: value }))} /></div>
              <div className="form-field"><span>End date <em>(opt)</em></span><SmartDateInput name="endDate" value={metadata.endDate} onChange={(value) => setMetadata((current) => ({ ...current, endDate: value }))} /></div>
            </div>
            <div className="subjects-section">
              <div className="subjects-section__title"><span>Subjects</span><span className="subjects-section__count">({subjects.length})</span></div>
              <div className="subjects-section__list">
                {subjects.map((subject, index) => <TimetableSubjectRow key={subject.subjectId || `new-${index}`} name={subject.name} target={subject.target} color={subject.color} onNameChange={(value) => updateSubject(index, "name", value)} onTargetChange={(value) => updateSubject(index, "target", value)} onColorChange={(value) => updateSubject(index, "color", value)} actionType="remove" actionDisabled={subjects.length === 1} onAction={() => setSubjects((current) => current.filter((_, itemIndex) => itemIndex !== index))} />)}
              </div>
              <TimetableSubjectRow name={draft.name} target={draft.target} color={draft.color} onNameChange={(value) => setDraft((current) => ({ ...current, name: value }))} onTargetChange={(value) => setDraft((current) => ({ ...current, target: value }))} onColorChange={(value) => setDraft((current) => ({ ...current, color: value }))} onNameKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSubject() } }} actionType="add" actionDisabled={!draft.name.trim()} onAction={addSubject} />
            </div>
            {error && <p className="timetable-form__error" role="alert">{error}</p>}
          </div>
          <footer className="timetable-form__actions"><SecondaryButton text="Cancel" onClick={onClose} /><Button type="submit" disabled={timetableLoading} text={timetableLoading ? "Saving..." : "Save changes"} /></footer>
        </form>
      </div>
    </div>
  )
}

export default UpdateTimetableForm
