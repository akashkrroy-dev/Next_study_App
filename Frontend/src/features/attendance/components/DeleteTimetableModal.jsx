import { useEffect, useState } from "react"
import { useTimetable } from "../hooks/useTimetable.js"
import Button from "../../../components/ui/buttons/Button.jsx"
import SecondaryButton from "../../../components/ui/buttons/SecondaryButton.jsx"
import "./css/zCreateTimeTableForm.css"

const DeleteTimetableModal = ({ timetable, onClose }) => {
  const { deleteTimetable, timetableLoading } = useTimetable()
  const [confirmName, setConfirmName] = useState("")
  const [error, setError] = useState("")
  const name = timetable?.name || ""
  const canDelete = confirmName.trim() === name

  useEffect(() => {
    const handleKeyDown = (event) => event.key === "Escape" && onClose?.()
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canDelete || timetableLoading) return
    setError("")
    try {
      await deleteTimetable(timetable._id)
      onClose?.()
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete timetable. Please try again.")
    }
  }

  return (
    <div className="timetable-form-overlay" onClick={onClose}>
      <div className="timetable-form" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="delete-timetable-title">
        <header className="timetable-form__header">
          <h4 id="delete-timetable-title">Delete timetable</h4>
          <button type="button" className="timetable-form__close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </header>
        <form onSubmit={handleSubmit} className="timetable-form__content">
          <div className="timetable-form__body">
            <p className="timetable-form__message">
              This will permanently delete <strong>{name}</strong>, all classes on this timetable, and their attendance logs. Type the timetable name to confirm.
            </p>
            <div className="form-field">
              <span>Timetable name</span>
              <input value={confirmName} onChange={(event) => setConfirmName(event.target.value)} placeholder={name} autoFocus />
            </div>
            {error && <p className="timetable-form__error" role="alert">{error}</p>}
          </div>
          <footer className="timetable-form__actions">
            <SecondaryButton text="Cancel" onClick={onClose} />
            <Button type="submit" disabled={!canDelete || timetableLoading} text={timetableLoading ? "Deleting..." : "Delete"} />
          </footer>
        </form>
      </div>
    </div>
  )
}

export default DeleteTimetableModal
