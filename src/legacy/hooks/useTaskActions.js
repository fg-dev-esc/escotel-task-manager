import { useCallback } from 'react'
import { useTasks } from './useTasks'

export function useTaskActions() {
  const { dispatch } = useTasks()

  const addTask = useCallback(
    (newTask) => {
      dispatch({ type: 'ADD_TASK', payload: newTask })
    },
    [dispatch]
  )

  const updateTask = useCallback(
    (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task })
    },
    [dispatch]
  )

  const deleteTask = useCallback(
    (taskId) => {
      dispatch({ type: 'DELETE_TASK', payload: taskId })
    },
    [dispatch]
  )

  const toggleSubtask = useCallback(
    (taskId, subtaskId) => {
      dispatch({
        type: 'TOGGLE_SUBTASK',
        payload: { taskId, subtaskId },
      })
    },
    [dispatch]
  )

  return { addTask, updateTask, deleteTask, toggleSubtask }
}
