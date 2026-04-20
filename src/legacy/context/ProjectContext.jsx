import { createContext, useReducer, useEffect, useState } from 'react'
import { obtenerProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from '../services/projects.js'
import { v4 as uuidv4 } from 'uuid'

export const ProjectContext = createContext()

const projectReducer = (state, action) => {
  if (action.type === 'ADD_PROJECT') {
    return [...state, action.payload]
  }
  if (action.type === 'UPDATE_PROJECT') {
    return state.map((p) => {
      if (p.id === action.payload.id) {
        return action.payload
      }
      return p
    })
  }
  if (action.type === 'DELETE_PROJECT') {
    return state.filter((p) => p.id !== action.payload)
  }
  if (action.type === 'SET_PROJECTS') {
    return action.payload
  }
  return state
}

export function ProjectProvider({ children }) {
  const [projects, dispatch] = useReducer(projectReducer, [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarProyectos = async () => {
      const proyectos = await obtenerProyectos()
      const proyectosConDefaults = proyectos.map(p => ({
        ...p,
        icon: p.icon || 'FolderOutlined',
        color: p.color || '#1890ff'
      }))
      dispatch({ type: 'SET_PROJECTS', payload: proyectosConDefaults })
      setLoading(false)
    }
    cargarProyectos()
  }, [])

  const dispatchWithFirebase = async (action) => {
    if (action.type === 'ADD_PROJECT') {
      const nuevoProyecto = action.payload
      await crearProyecto(nuevoProyecto)
      dispatch(action)
    }
    if (action.type === 'UPDATE_PROJECT') {
      const proyecto = action.payload
      await actualizarProyecto(proyecto.id, proyecto)
      dispatch(action)
    }
    if (action.type === 'DELETE_PROJECT') {
      const projectId = action.payload
      await eliminarProyecto(projectId)
      dispatch(action)
    }
  }

  return (
    <ProjectContext.Provider value={{ projects, dispatch: dispatchWithFirebase, loading }}>
      {children}
    </ProjectContext.Provider>
  )
}


