import React, { createContext, useContext, useState, useCallback } from 'react'

const TodoContext = createContext(null)

export const TodoProvider = ({ children }) => {
  const [reload, setReload] = useState(0)

  const triggerReload = useCallback(() => {
    setReload((r) => r + 1)
  }, [])

  return (
    <TodoContext.Provider value={{ reload, triggerReload }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodoContext = () => {
  const ctx = useContext(TodoContext)
  if (!ctx) {
    throw new Error('useTodoContext must be used within a TodoProvider')
  }
  return ctx
}