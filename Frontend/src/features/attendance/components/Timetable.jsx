import { useEffect, useRef, useState } from "react"
import { Pen, Plus, Trash2 } from "reicon-react"
import { VISUAL_WEEK_DAY, VISULE_MONTH_NAME, getWeekDays } from "../../../utils/js/weekHelpers.js"
import useClickOutside from "../../../hooks/useClickOutside.js"

// * CONPONENTS
import TimetableLayout from "./TimetableLayout.jsx"
import CreateTimetable from "./CreateTimetable.jsx"
import CreateTimeTableForm from "./CreateTimeTableForm.jsx"
import UpdateTimetableForm from "./UpdateTimetableForm.jsx"
import DeleteTimetableModal from "./DeleteTimetableModal.jsx"
import Button from "../../../components/ui/buttons/Button.jsx"
import SecondaryButton from "../../../components/ui/buttons/SecondaryButton.jsx"
import { useTimetable } from "../hooks/useTimetable.js"
import { useTimetableClassEditor } from "../hooks/useTimetableClassEditor.js"
import TimetableSkeleton from "../layout/TimetableLayoutSkeleton.jsx"
import "./css/zTimetable.css"

const Timetable = ({ editClassesRequest = 0 }) => {
  const { today } = getWeekDays()
  const {
    hasTimetable,
    hasCheckedTimetables,
    timetableLoading,
    error,
    classes,
    setClasses,
    currentTimetable,
    timetable_list,
    loadActiveTimetable,
    selectTimetable,
    updateClasses,
  } = useTimetable()

  const [creating, setCreating] = useState(false)
  const [editingTimetable, setEditingTimetable] = useState(null)
  const [deletingTimetable, setDeletingTimetable] = useState(null)
  const [timetableOptions, setTimetableOptions] = useState(false)
  const timetableSelectorRef = useRef(null)

  useClickOutside(timetableSelectorRef, () => setTimetableOptions(false))

  const subjects = currentTimetable?.subjects || []
  const {
    isEditing: isEditingClasses,
    isSaving: isSavingClasses,
    error: classEditError,
    enterEditMode,
    cancelEditMode,
    saveEditMode,
    addClass,
    changeClass,
    removeClass,
  } = useTimetableClassEditor({ classes, setClasses, subjects, updateClasses })

  const handleClick = () => {
    setTimetableOptions(false)
    setCreating(true)
  }

  const handleTimetableSelect = async (id) => {
    if (id === currentTimetable?._id) return setTimetableOptions(false)
    try {
      await selectTimetable(id)
      setTimetableOptions(false)
    } catch {
      // The hook stores and renders the request error.
    }
  }

  const handleEditTimetable = (item, event) => {
    event?.stopPropagation()
    setTimetableOptions(false)
    setEditingTimetable(item)
  }

  const handleDeleteTimetable = (item, event) => {
    event?.stopPropagation()
    setTimetableOptions(false)
    setDeletingTimetable(item)
  }

  const timetableName = currentTimetable?.name || "Timetable"
  const classUpdateBlocked = isSavingClasses || Boolean(classEditError)

  useEffect(() => {
    if (editClassesRequest > 0 && !isEditingClasses && !timetableLoading) {
      enterEditMode()
    }
  }, [editClassesRequest, enterEditMode, isEditingClasses, timetableLoading])

  return (
    <div className='timetable_wrapper'>
      <div className='timetable_navbar'>
        <div className="timetable_today">
          <p className='day-name'>{VISUAL_WEEK_DAY[today.dayOfWeek - 1]}</p>
          <p className='date'>{today.day} <span>{VISULE_MONTH_NAME[today.month - 1]}</span></p>
        </div>
      </div>

      <div className="titmetable_editmodel">
        <div className="timetable-selector" ref={timetableSelectorRef}>
          {currentTimetable?.name && <SecondaryButton text={timetableName} onClick={() => setTimetableOptions((open) => !open)} disabled={classUpdateBlocked} />}

          {timetableOptions && (
            <div className="timetable_list_show" role="menu" aria-label="Choose timetable">
              {timetable_list.map((item) => (
                <div className={`timetable_list_show__row${item._id === currentTimetable?._id ? " is-active" : ""}`} key={item._id}>
                  <button type="button" role="menuitem" className="timetable_list_show__item" onClick={() => handleTimetableSelect(item._id)}>{item.name}</button>
                  <button type="button" className="timetable_list_show__edit" onClick={(event) => handleEditTimetable(item, event)} aria-label={`Edit ${item.name}`} title="Edit timetable"><Pen size={15} aria-hidden="true" /></button>
                  <button type="button" className="timetable_list_show__delete" onClick={(event) => handleDeleteTimetable(item, event)} aria-label={`Delete ${item.name}`} title="Delete timetable"><Trash2 size={15} aria-hidden="true" /></button>
                </div>
              ))}
              <button type="button" className="timetable_list_show__create" onClick={handleClick}>
                <Plus size={15} aria-hidden="true" />
                Create timetable
              </button>
            </div>
          )}
        </div>

        {hasTimetable ? (
          !isEditingClasses ? (
            <Button text={`${classes.length === 0 ? "Set Classes" : "Edit Classes"}`} onClick={enterEditMode} disabled={timetableLoading} />
          ) : (
            <div className="timetable-class-edit-actions">
              <SecondaryButton text="Cancel" onClick={cancelEditMode} disabled={isSavingClasses} />
              <Button text={isSavingClasses ? "Saving..." : "Save"} onClick={saveEditMode} disabled={classUpdateBlocked} />
            </div>
          )
        ) : (
          <Button text="Create timetable" icon={Plus} onClick={handleClick} />
        )}
      </div>

      <div className="timetable_layout">
        {!hasCheckedTimetables ? (
          <TimetableSkeleton />
        ) : error && !classEditError ? (
          <div className="timetable_error" role="alert">
            <p>Couldn&apos;t load your timetable: {error}</p>
            <Button text="Try again" onClick={() => loadActiveTimetable().catch(() => { })} />
          </div>
        ) : hasTimetable ? (
          <div className={`timetable-layout-state${classUpdateBlocked ? " timetable-layout-state--blocked" : ""}`}>
            <div className={classUpdateBlocked ? "timetable-layout-state__content--blurred" : ""}>
              <TimetableLayout
                classes={classes}
                subjects={subjects}
                isEditing={isEditingClasses && !classUpdateBlocked}
                onAddClass={addClass}
                onChangeClass={changeClass}
                onRemoveClass={removeClass}
              />
            </div>
            {classUpdateBlocked && <div className="timetable-layout-state__skeleton"><TimetableSkeleton /></div>}
          </div>
        ) : (
          <CreateTimetable onCreate={handleClick} />
        )}
      </div>

      {creating && <CreateTimeTableForm onClose={() => setCreating(false)} />}
      {editingTimetable && <UpdateTimetableForm timetable={editingTimetable} onClose={() => setEditingTimetable(null)} />}
      {deletingTimetable && <DeleteTimetableModal timetable={deletingTimetable} onClose={() => setDeletingTimetable(null)} />}
      {classEditError && <p className="timetable_error" role="alert">{classEditError}</p>}
    </div>
  )
}

export default Timetable
