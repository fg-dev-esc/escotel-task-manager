import { useCallback } from 'react'
import { useUI } from './useUI'

export function useUIActions() {
  const { dispatch } = useUI()

  const toggleSider = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDER' })
  }, [dispatch])

  const openDrawer = useCallback(
    (taskId) => {
      dispatch({ type: 'OPEN_DRAWER', payload: taskId })
    },
    [dispatch]
  )

  const closeDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' })
  }, [dispatch])

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' })
  }, [dispatch])

  return { toggleSider, openDrawer, closeDrawer, toggleTheme }
}
