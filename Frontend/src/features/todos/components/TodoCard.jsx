import React, { useRef, useState } from 'react'
import { Check, Pen, Trash2 } from 'reicon-react';
import { deleteTodo, updateTodoStatus } from "../todoApi.js"
import { useTodoContext } from '../context/TodoContext.jsx';
import EditTodo from './EditTodo.jsx';
import SecondaryButton from '../../../components/ui/buttons/SecondaryButton.jsx'
import { useToast } from '../../../hooks/useToast.jsx'
import "./css/TodoCard.css"
import { createLatestThreshold } from "../../../utils/js/threshold.js"

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

const hexToRgbString = (hex, alpha = 1) => {
  const { r, g, b } = hexToRgb(hex)
  return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const priorityColors = { low: "#e0ffc2", medium: "#014bba", high: "#dd0426" }

const dueDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: 'numeric',
  month: 'short'
})

const formatDueDate = (dueDate) => dueDateFormatter.format(new Date(String(dueDate).slice(0, 10) + "T00:00:00"))


//* START
const TodoCard = ({ todo }) => {
  const { triggerReload } = useTodoContext()
  const toast = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isChack, seIsChack] = useState(todo.isCompleted)
  const [isUpdating, setIsUpdating] = useState(false)
  const [threshold] = useState(() => createLatestThreshold())
  const statusRef = useRef(todo.isCompleted)

  const handleToggle = async () => {
    if (todo.isExpired || isUpdating) return
    const next = !statusRef.current
    statusRef.current = next
    seIsChack(next)
    threshold(async () => {
      setIsUpdating(true)
      try {
        await updateTodoStatus(todo._id, next)
        triggerReload()
      } catch {
        toast.error("Couldn't update this task.")
        statusRef.current = !next
        seIsChack(!next)
      } finally {
        setIsUpdating(false)
      }
    })
  }

  const hendleEditOn = () => setIsEditing(true)
  const handleDelete = async () => {
    try {
      await deleteTodo(todo._id)
      triggerReload()
    } catch {
      toast.error("Couldn't delete this task.")
    }
  }

  return (
    <div className={`todo_card ${isChack ? 'todo_card_completed' : ''}`}>
      <div className="todos_chakbox">
        <input type="checkbox" checked={isChack} onChange={handleToggle} disabled={todo.isExpired || isUpdating} aria-label={`Mark ${todo.title} complete`} />
        <Check size={14} className="chakbox_icon" />
      </div>
      <div>
        <div className={`titel ${isChack ? 'titel_completed' : ''}`}>{todo.title}</div>
        <div className="todo_info">
          <div className={`dueDate ${todo.isExpired && !isChack ? 'dueDate_expired' : ''}`}>
            <span>due</span>
            <span>{formatDueDate(todo.dueDate)}</span>
          </div>
          <div
            className='priority'
            style={{
              color: hexToRgbString(priorityColors[todo.priority]),
              background: hexToRgbString(priorityColors[todo.priority], 0.1),
            }}
          >
            {todo.priority}
          </div>
          <div className='todo_category'>{todo.category}</div>
        </div>
      </div>

      <div>
        <div className="edit_btn_todo">
          <SecondaryButton text="Edit" icon={Pen} onClick={hendleEditOn} className="todo-action-button" />
          <SecondaryButton text="Delete" icon={Trash2} onClick={handleDelete} className="todo-action-button todo-action-button--delete" />
        </div>
      </div>

      {isEditing && <EditTodo todo={todo} setIsEditing={setIsEditing} />}
    </div>
  )
}

export default TodoCard