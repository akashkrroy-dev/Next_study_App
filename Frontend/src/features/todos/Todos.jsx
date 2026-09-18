import { useEffect, useState, useRef } from 'react'
import { AngleDown, AngleUp, Plus } from 'reicon-react'
import { useUser } from '../../context/UserContext.jsx'
import Header from '../../components/ui/Header.jsx'
import Button from '../../components/ui/buttons/Button.jsx'
import ShowTodo from './components/ShowTodo.jsx'
import DropDown from './components/DropDown.jsx'
import useClickOutside from '../../hooks/useClickOutside.js'
import { getTodos, addTodo } from "./todoApi.js"
import { useTodoContext } from './context/TodoContext.jsx'
import { useToast } from '../../hooks/useToast.jsx'
import {
  priorityOptions,
  todoCategoryOptions,
  todoPages,
  getDueDateOptions,
  formatDate,
  toDateOnly,
} from './hooks/useDefaultData.js'
import "./css/Todos.css"

const MAX_TITLE_CHARS = 250

const Todos = () => {
  const { user, settings, userLoading } = useUser()

  // -- User-derived data ------------------------------------------------
  const [todoCategorys, setTodoCategorys] = useState(null)
  const { reload, triggerReload } = useTodoContext()

  // -- Create-todo form state --------------------------------------------
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState(priorityOptions[1])
  const [dueDate, setDueDate] = useState(getDueDateOptions()[1].date)
  const [todoCategory, setTodoCategory] = useState(todoCategoryOptions[0])
  const toast = useToast()

  // -- Dropdown open/close state -------------------------------------------
  const [openPriority, setOpenPriority] = useState(false)
  const [openDueDate, setOpenDueDate] = useState(false)
  const [openCategorys, setOpenCategorys] = useState(false)

  // -- Refs for click-outside detection --------------------------------------------
  const priorityRef = useRef(null)
  const dueDateRef = useRef(null)
  const categoryRef = useRef(null)

  // -- Ref for the auto-growing title textarea --------------------------------------------
  const titleRef = useRef(null)

  useClickOutside(priorityRef, () => setOpenPriority(false))
  useClickOutside(dueDateRef, () => setOpenDueDate(false))
  useClickOutside(categoryRef, () => setOpenCategorys(false))

  // -- Page / filter state --------------------------------------------
  const [page, setPage] = useState("all")

  // -- Fetched todo lists --------------------------------------------
  const [todayTodos, setTodayTodos] = useState([])
  const [upcomingTodos, setUpcomingTodos] = useState([])
  const [completedTodos, setCompletedTodos] = useState([])
  const [expiredTodos, setExpiredTodos] = useState([])
  const [todosLoading, setTodosLoading] = useState(true)
  const [todosError, setTodosError] = useState("")

  // -- Effects --------------------------------------------
  useEffect(() => {
    if (!user) return
    const configuredCategories = settings?.todoCategory
      ?.map((category) => typeof category === "string" ? category : category?.name)
      .filter(Boolean)
    const categories = configuredCategories?.length ? configuredCategories : todoCategoryOptions
    setTodoCategorys(categories)
    setTodoCategory(categories[0])
  }, [user, settings, userLoading])

  useEffect(() => {
    const fetchTodos = async () => {
      setTodosLoading(true)
      setTodosError("")
      try {
        const res = await getTodos()
        setTodayTodos(res.data.today || [])
        setUpcomingTodos(res.data.upcoming || [])
        setCompletedTodos(res.data.completed || [])
        setExpiredTodos(res.data.expired || [])
      } catch (err) {
        setTodosError("Unable to load todos.")
      } finally {
        setTodosLoading(false)
      }
    }

    fetchTodos()
  }, [reload])

  // Auto-grow the title textarea up to the CSS max-height (~3 lines).
  // overflow-y stays "hidden" by default in CSS and we only switch it to
  // "auto" here once content genuinely exceeds max-height - if we leave
  // overflow-y: auto in CSS instead, scrollHeight vs. the height we set
  // can be off by a rounding pixel and a scrollbar appears even when empty.
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = "auto"
    const maxHeight = parseFloat(getComputedStyle(el).maxHeight)
    const needsScroll = el.scrollHeight > maxHeight
    el.style.height = `${needsScroll ? maxHeight : el.scrollHeight}px`
    el.style.overflowY = needsScroll ? "auto" : "hidden"
  }, [title])

  // -- Derived values --------------------------------------------
  // -- Handlers --------------------------------------------
  const handleAddTodo = async () => {
    if (title.trim().length < 1) return
    if (title.length > MAX_TITLE_CHARS) return

    const payload = {
      title: title.trim(),
      priority,
      dueDate: toDateOnly(dueDate),
      category: todoCategory,
    }

    try {
      await addTodo(payload)
      triggerReload()
      setTitle("")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't add your task.")
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTodo()
    }
    // Shift+Enter falls through to the browser's default behavior -> newline
  }

  const titleOverLimit = title.length > MAX_TITLE_CHARS

  const sectionsByPage = {
    all: [
      { key: "today", label: "Today", todos: todayTodos },
      { key: "upcoming", label: "Upcoming", todos: upcomingTodos },
      { key: "completed", label: "Completed", todos: completedTodos },
    ],
    today: [{ key: "today", label: "Today", todos: todayTodos }],
    upcoming: [{ key: "upcoming", label: "Upcoming", todos: upcomingTodos }],
    expired: [{ key: "expired", label: "Expired", todos: expiredTodos }],
    completed: [{ key: "completed", label: "Completed", todos: completedTodos }],
  }

  return (
    <div className='todos_wrapper'>
      <Header name="todos" />

      <div className='new_todos'>
        <div className="todo_input_warapper">
          <div>
            <textarea
              ref={titleRef}
              rows={1}
              placeholder='Add a new task'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              aria-invalid={titleOverLimit}
              className={titleOverLimit ? "is-over-limit" : undefined}
            />
            <Button text="Add todo" icon={Plus} className="todo-add-button" onClick={handleAddTodo} threshold={600} disabled={!title.trim() || titleOverLimit} />
          </div>
          <div>
            <div className="dropdown_wrap" ref={priorityRef}>
              <button className='add_priority' onClick={() => setOpenPriority(!openPriority)}>
                {priority}
                {openPriority ? <AngleDown size={14} /> : <AngleUp size={14} />}
              </button>
              {openPriority && <DropDown options={priorityOptions} setFunction={(value) => { setPriority(value); setOpenPriority(false) }} />}
            </div>

            <div className="dropdown_wrap" ref={dueDateRef}>
              <button className='dueDate' onClick={() => setOpenDueDate(!openDueDate)}>
                {formatDate(dueDate)}
                {openDueDate ? <AngleDown size={14} /> : <AngleUp size={14} />}
              </button>
              {openDueDate && <DropDown options={getDueDateOptions()} setFunction={(value) => { setDueDate(value); setOpenDueDate(false) }} />}
            </div>

            <div className="dropdown_wrap" ref={categoryRef}>
              <button className='add_category' onClick={() => setOpenCategorys(!openCategorys)}>
                {todoCategory}
                {openCategorys ? <AngleDown size={14} /> : <AngleUp size={14} />}
              </button>
              {openCategorys && todoCategorys && <DropDown options={todoCategorys} setFunction={(value) => { setTodoCategory(value); setOpenCategorys(false) }} />}
            </div>
          </div>
        </div>
      </div>

      <div className="todos">
        <div>
          <div className="todos_options_show">
            {todoPages.map((op) => (
              <div key={op} className={op === page ? "active_show_option" : ""} onClick={() => setPage(op)}>{op}</div>
            ))}
          </div>
          <Button text={todosLoading ? "Refreshing..." : "Refresh"} onClick={triggerReload} threshold={600} disabled={todosLoading} />
        </div>
        <div className="todos_shoing">
          {todosLoading && !todayTodos.length && !upcomingTodos.length && !completedTodos.length && !expiredTodos.length ? (
            <div className="todos_state" role="status">Loading todos...</div>
          ) : todosError ? (
            <div className="todos_state todos_state--error" role="alert">
              <p>{todosError}</p>
              <Button text="Refresh" onClick={triggerReload} threshold={600} />
            </div>
          ) : (
            <ShowTodo sections={sectionsByPage[page] ?? []} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Todos