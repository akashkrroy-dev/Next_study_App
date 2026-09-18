import api from "../../config/api.js";

export const getTodos = async () => api.get("/todos")
export const addTodo = async (data) => api.post("/todos", data)
export const updateTodo = async (id, data) => api.patch(`/todos/${id}`, data)
export const deleteTodo = async (id) => api.delete(`/todos/${id}`)
export const updateTodoStatus = async (id, status) => api.patch(`/todos/${id}/status`, { isCompleted: status })