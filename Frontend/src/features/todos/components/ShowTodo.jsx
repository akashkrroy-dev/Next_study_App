import TodoCard from "./TodoCard.jsx"
import "./css/ShowTodo.css"

const ShowTodo = ({ sections }) => {
  const hasAny = sections.some((section) => section.todos.length > 0)

  if (!hasAny) {
    return <div className="no_todos"><p>No todos yet.</p></div>
  }

  return (
    <>
      {sections.map((section) =>
        section.todos.length === 0 ? null : (
          <div key={section.key} className="todos_section">
            <p className="todos_section_title">
              {section.label}
              <span className="todos_section_count">{section.todos.length}</span>
            </p>
            {section.todos.map((todo) => (
              <TodoCard key={todo._id} todo={todo} />
            ))}
          </div>
        )
      )}
    </>
  )
}

export default ShowTodo