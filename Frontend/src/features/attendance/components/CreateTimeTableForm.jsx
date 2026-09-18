import { useState, useEffect, useRef } from "react"
import { useTimetable } from "../hooks/useTimetable.js"
import Button from "../../../components/ui/buttons/Button.jsx"
import SecondaryButton from "../../../components/ui/buttons/SecondaryButton.jsx"
import TimetableSubjectRow from "./TimetableSubjectRow.jsx"
import SmartDateInput, { isValidDateValue } from "./SmartDateInput.jsx"
import { COLOR_OPTIONS } from "./TimetableFormConstants.js"
import "./css/zCreateTimeTableForm.css"

const emptyDraft = () => ({ name: "", target: "", color: COLOR_OPTIONS[0] })
const hasInvalidTarget = (subject) => Number(subject.target) > 100
const toTargetString = (target) => (target === "" ? undefined : String(target))

// ---------- Main form ----------
const CreateTimeTableForm = ({ mode = "create", onClose }) => {
  const { createTimetable, copyBySlug, timetableLoading, timetable_list } = useTimetable()

  const [metadata, setMetadata] = useState({ name: "", startDate: "", endDate: "" })
  const [slug, setSlug] = useState("")
  const [subjects, setSubjects] = useState([])
  const [draft, setDraft] = useState(emptyDraft())
  const [error, setError] = useState("")
  const submittingRef = useRef(false)

  const isCopying = mode === "create" && Boolean(slug.trim())

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const handleMetadataChange = ({ target: { name, value } }) => {
    setMetadata((current) => ({ ...current, [name]: value }))
  }

  const addSubject = () => {
    const name = draft.name.trim()
    if (!name) return
    setSubjects((current) => [...current, { ...draft, name }])
    setDraft(emptyDraft())
  }

  const removeSubject = (index) =>
    setSubjects((current) => current.filter((_, i) => i !== index))

  const updateSubject = (index, field, value) =>
    setSubjects((current) =>
      current.map((subject, i) => (i === index ? { ...subject, [field]: value } : subject))
    )

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (timetableLoading || submittingRef.current) return
    setError("")
    submittingRef.current = true

    const name = metadata.name.trim()
    const startDateValid = isValidDateValue(metadata.startDate)
    const startDate = startDateValid ? new Date(`${metadata.startDate}T00:00:00`) : null
    const endDateValid = !metadata.endDate || isValidDateValue(metadata.endDate)
    const endDate = metadata.endDate ? new Date(`${metadata.endDate}T00:00:00`) : null
    const hasDuplicateName = timetable_list.some((item) => item.name?.trim().toLowerCase() === name.toLowerCase())

    if (!startDateValid) {
      submittingRef.current = false
      return setError("Choose a valid schedule start date (YYYY-MM-DD).")
    }
    if (!endDateValid) {
      submittingRef.current = false
      return setError("Choose a valid schedule end date (YYYY-MM-DD).")
    }
    if (endDate && endDate <= startDate) {
      submittingRef.current = false
      return setError("End date must be later than start date.")
    }

    const cleanedSubjects = subjects
      .map((subject) => ({ ...subject, name: subject.name.trim() }))
      .filter((subject) => subject.name.length > 0)

    const sendDate = (value) => (value ? String(value) : undefined)

    try {
      if (isCopying) {
        if (name && name.length < 2) {
          submittingRef.current = false
          return setError("Timetable name must contain at least 2 characters.")
        }
        if (name && hasDuplicateName) {
          submittingRef.current = false
          return setError("A timetable with this name already exists.")
        }
        await copyBySlug(slug.trim(), {
          ...(name && { name }),
          startDate: sendDate(metadata.startDate),
          ...(endDateValid && endDate && { endDate: sendDate(metadata.endDate) }),
        })
      } else {
        if (name.length < 2) {
          submittingRef.current = false
          return setError("Timetable name must contain at least 2 characters.")
        }
        if (hasDuplicateName) {
          submittingRef.current = false
          return setError("A timetable with this name already exists.")
        }
        if (cleanedSubjects.length === 0) {
          submittingRef.current = false
          return setError("Add at least one subject.")
        }
        if (cleanedSubjects.some(hasInvalidTarget)) {
          submittingRef.current = false
          return setError("Subject targets must be between 0 and 100.")
        }
        await createTimetable({
          name,
          startDate: sendDate(metadata.startDate),
          ...(endDateValid && endDate && { endDate: sendDate(metadata.endDate) }),
          subjects: cleanedSubjects.map((subject) => ({
            ...subject,
            target: toTargetString(subject.target),
          })),
        })
      }
      onClose?.()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save timetable. Please try again."
      )
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <div className="timetable-form-overlay" onClick={onClose}>
      <div
        className="timetable-form"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="timetable-form__header">
          <h4>{mode === "create" ? "New Timetable" : "Edit Timetable"}</h4>
          <button
            type="button"
            className="timetable-form__close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit} className="timetable-form__content">
          <div className="timetable-form__body">
            {/* Name */}
            <div className="form-field">
              <span>
                Timetable name {isCopying && <em>(optional)</em>}
              </span>
              <input
                type="text"
                name="name"
                placeholder="e.g. Fall 2026 Semester"
                value={metadata.name}
                onChange={handleMetadataChange}
                autoFocus
              />
            </div>

            {/* Schedule dates: 2 columns */}
            <div className="form-section--row">
              <div className="form-field">
                <span>Start date</span>
                <SmartDateInput
                  name="startDate"
                  value={metadata.startDate}
                  onChange={(value) => setMetadata((current) => ({ ...current, startDate: value }))}
                  required
                />
              </div>

              <div className="form-field">
                <span>End date <em>(opt)</em></span>
                <SmartDateInput
                  name="endDate"
                  value={metadata.endDate}
                  onChange={(value) => setMetadata((current) => ({ ...current, endDate: value }))}
                />
              </div>
            </div>

            {/* Copy slug */}
            {mode === "create" && (
              <div className="form-field">
                <span>Copy from slug <em>(optional)</em></span>
                <input
                  type="text"
                  placeholder="Paste existing timetable slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            )}

            {/* Subjects section */}
            <div className={`subjects-section ${isCopying ? "subjects-section--disabled" : ""}`}>
              <div className="subjects-section__title">
                <span>Subjects</span>
                <span className="subjects-section__count">({subjects.length})</span>
              </div>

              {/* Saved subjects — same input + dropdown as the draft row, directly editable */}
              {subjects.length > 0 && (
                <div className="subjects-section__list">
                  {subjects.map((subject, index) => (
                    <TimetableSubjectRow
                      key={index}
                      name={subject.name}
                      target={subject.target}
                      color={subject.color}
                      onNameChange={(value) => updateSubject(index, "name", value)}
                      onColorChange={(value) => updateSubject(index, "color", value)}
                      onTargetChange={(value) => updateSubject(index, "target", value)}
                      disabled={isCopying}
                      actionType="remove"
                      onAction={() => removeSubject(index)}
                    />
                  ))}
                </div>
              )}

              {/* Draft row: identical layout, adds a new subject */}
              <TimetableSubjectRow
                name={draft.name}
                target={draft.target}
                color={draft.color}
                onNameChange={(value) => setDraft((curr) => ({ ...curr, name: value }))}
                onTargetChange={(value) => setDraft((curr) => ({ ...curr, target: value }))}
                onColorChange={(value) => setDraft((curr) => ({ ...curr, color: value }))}
                onNameKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSubject()
                  }
                }}
                disabled={isCopying}
                actionType="add"
                onAction={addSubject}
                actionDisabled={!draft.name.trim()}
              />
            </div>

            {error && <p className="timetable-form__error">{error}</p>}
          </div>

          <footer className="timetable-form__actions">
            <SecondaryButton text="Cancel" onClick={onClose} />
            <Button
              type="submit"
              text={
                timetableLoading
                  ? isCopying
                    ? "Copying..."
                    : "Creating..."
                  : isCopying
                    ? "Copy Timetable"
                    : "Create Timetable"
              }
              disabled={timetableLoading}
            />
          </footer>
        </form>
      </div>
    </div>
  )
}

export default CreateTimeTableForm
