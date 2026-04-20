import { createContext, useReducer, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const UIContext = createContext()

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const initialUIState = {
  siderCollapsed: false,
  activeView: 'dashboard',
  drawerOpen: false,
  selectedTaskId: null,
  theme: prefersDark ? 'dark' : 'light',
}

const uiReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDER':
      return { ...state, siderCollapsed: !state.siderCollapsed }

    case 'SET_VIEW':
      return { ...state, activeView: action.payload }

    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true, selectedTaskId: action.payload || null }

    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false, selectedTaskId: null }

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }

    case 'SET_THEME':
      return { ...state, theme: action.payload }

    default:
      return state
  }
}

export function UIProvider({ children }) {
  const [storedUI, setStoredUI] = useLocalStorage('etm_ui', initialUIState)
  const [uiState, dispatch] = useReducer(uiReducer, storedUI)

  // Sincronizar cambios con localStorage
  useEffect(() => {
    setStoredUI(uiState)
  }, [uiState, setStoredUI])

  return (
    <UIContext.Provider value={{ uiState, dispatch }}>
      {children}
    </UIContext.Provider>
  )
}
