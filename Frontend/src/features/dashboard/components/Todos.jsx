import { useEffect, useState } from "react"
import Button from "../../../components/ui/buttons/Button.jsx"
import { updateTodoStatus } from "../../todos/todoApi.js"

const Todos = ({ todos = [], error = "" }) => {
  const [items, setItems] = useState(todos)
  const [updatingId, setUpdatingId] = useState(null)
  const [actionError, setActionError] = useState("")

  useEffect(() => {
    setItems(todos)
  }, [todos])

  const completeTodo = async (todo) => {
    if (todo.isCompleted || updatingId) return
    setUpdatingId(todo._id)
    try {
      await updateTodoStatus(todo._id, true)
      setItems((current) => current.filter((item) => item._id !== todo._id))
      setActionError("")
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Unable to complete todo.")
    } finally {
      setUpdatingId(null)
    }
  }

  if (error) return <div className="dashboard-todos"><h2>Todos</h2><p role="alert">{error}</p></div>

  return (
    <div className="dashboard-todos">
      <h2>Upcoming todos</h2>
      {actionError && <p role="alert">{actionError}</p>}
      {!items.length ? <p>No upcoming todos.</p> : (
        <ul>
          {items.map((todo) => (
            <li className="dashboard-todos__item" key={todo._id}>
              <div>
                <strong>{todo.title}</strong>
                <span>{todo.priority} · {formatDate(todo.dueDate)}</span>
              </div>
              <Button
                text="Complete"
                onClick={() => completeTodo(todo)}
                threshold={600}
                disabled={updatingId === todo._id}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Todos

const formatDate = (value) => {
  if (!value) return "No due date"
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(value))
}