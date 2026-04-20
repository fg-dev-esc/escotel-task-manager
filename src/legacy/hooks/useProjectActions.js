import { useCallback } from 'react'
import { useProjects } from './useProjects'

export function useProjectActions() {
  const { dispatch } = useProjects()

  const addProject = useCallback(
    (newProject) => {
      dispatch({ type: 'ADD_PROJECT', payload: newProject })
    },
    [dispatch]
  )

  const updateProject = useCallback(
    (project) => {
      dispatch({ type: 'UPDATE_PROJECT', payload: project })
    },
    [dispatch]
  )

  const deleteProject = useCallback(
    (projectId) => {
      dispatch({ type: 'DELETE_PROJECT', payload: projectId })
    },
    [dispatch]
  )

  return { addProject, updateProject, deleteProject }
}
