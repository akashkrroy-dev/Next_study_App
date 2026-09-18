import { useState, useRef, useEffect } from 'react'
import { Temporal } from 'temporal-polyfill'
import { AngleDown, AngleUp } from 'reicon-react'
import DropDown from './DropDown.jsx'
import Button from '../../../components/ui/buttons/Button.jsx'
import SecondaryButton from '../../../components/ui/buttons/SecondaryButton.jsx'
import useClickOutside from '../../../hooks/useClickOutside.js'
import { updateTodo } from '../todoApi.js'
import { useTodoContext } from '../context/TodoContext.jsx'
import { useUser } from '../../../context/UserContext.jsx'
import { useToast } from '../../../hooks/useToast.jsx'
import {
  priorityOptions,
  todoCategoryOptions,
  getDueDateOptions,
  formatDate,
  toDateOnly,
  fromDateOnly,
} from '../hooks/useDefaultData.js'
import "./css/EditTodo.css"

const EditTodo = ({ todo, setIsEditing }) => {
  const initialDueDate = fromDateOnly(todo.dueDate) || Temporal.Now.plainDateISO()

  const { triggerReload } = useTodoContext()
  const toast = useToast()
  const { settings } = useUser()

  const configuredCategories = settings?.todoCategory
    ?.map((category) => typeof category === "string" ? category : category?.name)
    .filter(Boolean)
  const categories = configuredCategories?.length ? configuredCategories : todoCategoryOptions

  const [todoData, setTodoData] = useState({
    title: todo.title,
    priority: todo.priority,
    category: todo.category,
    dueDate: initialDueDate,
  })

  const [openPriority, setOpenPriority] = useState(false)
  const [openDueDate, setOpenDueDate] = useState(false)
  const [openCategorys, setOpenCategorys] = useState(false)

  const overLayRef = useRef(null)
  const priorityRef = useRef(null)
  const dueDateRef = useRef(null)
  const categoryRef = useRef(null)
  const titleRef = useRef(null)

  useClickOutside(priorityRef, () => setOpenPriority(false))
  useClickOutside(dueDateRef, () => setOpenDueDate(false))
  useClickOutside(categoryRef, () => setOpenCategorys(false))

  // Auto-grow title: 2-line default, up to 5 lines max.
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = "auto"
    const maxHeight = parseFloat(getComputedStyle(el).maxHeight)
    const needsScroll = el.scrollHeight > maxHeight
    el.style.height = `${needsScroll ? maxHeight : Math.max(el.scrollHeight, el.dataset.min)}px`
    el.style.overflowY = needsScroll ? "auto" : "hidden"
  }, [todoData.title])

  const updateField = (field, value) => {
    setTodoData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!todoData.title.trim()) return

    try {
      await updateTodo(todo._id, {
        ...todoData,
        dueDate: toDateOnly(todoData.dueDate),
      })
      triggerReload()
      setIsEditing(false)
    } catch {
      toast.error("Couldn't save your changes.")
    }
  }

  return (
    <div className='edit_todo_overlay' onClick={handleCancel}>
      <div className='edit_todo_model' onClick={(e) => e.stopPropagation()} ref={overLayRef}>

        <textarea
          ref={titleRef}
          data-min={2.4 * 16}
          className='edit_title_input'
          rows={2}
          value={todoData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder='Task title'
        />

        <div className='edit_todo_row'>
          <div className="edit_dropdown_wrap" ref={priorityRef}>
            <button className='edit_priority_btn' onClick={() => setOpenPriority(!openPriority)}>
              {todoData.priority}
              {openPriority ? <AngleDown size={14} /> : <AngleUp size={14} />}
            </button>
            {openPriority && (
              <DropDown
                options={priorityOptions}
                setFunction={(val) => { updateField('priority', val); setOpenPriority(false) }}
              />
            )}
          </div>

          <div className="edit_dropdown_wrap" ref={dueDateRef}>
            <button className='edit_duedate_btn' onClick={() => setOpenDueDate(!openDueDate)}>
              {formatDate(todoData.dueDate)}
              {openDueDate ? <AngleDown size={14} /> : <AngleUp size={14} />}
            </button>
            {openDueDate && (
              <DropDown
                options={getDueDateOptions()}
                setFunction={(val) => { updateField('dueDate', val); setOpenDueDate(false) }}
              />
            )}
          </div>

          <div className="edit_dropdown_wrap" ref={categoryRef}>
            <button className='edit_category_btn' onClick={() => setOpenCategorys(!openCategorys)}>
              {todoData.category}
              {openCategorys ? <AngleDown size={14} /> : <AngleUp size={14} />}
            </button>
            {openCategorys && (
              <DropDown
                options={categories}
                setFunction={(val) => { updateField('category', val); setOpenCategorys(false) }}
              />
            )}
          </div>
        </div>

        <div className='edit_todo_actions'>
          <SecondaryButton text="Cancel" onClick={handleCancel} />
          <Button text="Save" onClick={handleSave} />
        </div>
      </div>
    </div>
  )
}

export default EditTodo