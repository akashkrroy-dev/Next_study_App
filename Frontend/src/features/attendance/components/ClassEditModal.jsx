import { useState, useRef, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import Button from "../../../components/ui/buttons/Button.jsx"
import SecondaryButton from "../../../components/ui/buttons/SecondaryButton.jsx"
import "./css/zClassEditModal.css"

const ClassEditModal = ({ classItem, subjects, onChange = () => {}, onClose, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  if (!classItem) return null

  const handleSubjectSelect = (subject) => {
    onChange({ subjectId: subject.subjectId, name: subject.name, color: subject.color })
    setIsOpen(false)
  }

  return (
    <div className="class-edit-modal__overlay" onClick={onClose}>
      <div className="class-edit-modal" role="dialog" aria-modal="true" aria-label="Edit class" onClick={(event) => event.stopPropagation()}>
        <div className="class-edit-modal__header">
          <p>Edit class</p>
          <Button text="Close" icon={X} onClick={onClose} />
        </div>

        <label className="class-edit-modal__label">Subject</label>
        <div className="class-edit-modal__dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="class-edit-modal__dropdown-trigger"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="color-dot" style={{ backgroundColor: classItem.color }} />
            <span>{classItem.name}</span>
            <ChevronDown size={16} className={`class-edit-modal__chevron ${isOpen ? "is-open" : ""}`} />
          </button>

          {isOpen && (
            <div className="class-edit-modal__dropdown-list" role="listbox">
              {subjects.map((subject) => (
                <button
                  type="button"
                  key={subject.subjectId}
                  role="option"
                  aria-selected={subject.subjectId === classItem.subjectId}
                  className={`class-edit-modal__dropdown-option ${subject.subjectId === classItem.subjectId ? "is-selected" : ""}`}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <span className="color-dot" style={{ backgroundColor: subject.color }} />
                  <span>{subject.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="class-edit-modal__preview">
          <span className="class-edit-modal__chip">
            <span className="color-dot" style={{ backgroundColor: classItem.color }} />
            <span className="class-edit-modal__hex">{classItem.color}</span>
          </span>
          <span className="class-edit-modal__class-name">{classItem.name}</span>
        </div>

        <div className="class-edit-modal__actions">
          <SecondaryButton text="Remove" onClick={onRemove} />
          <Button text="Save" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

export default ClassEditModal