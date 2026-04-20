import { createContext, useContext, useState, useEffect } from 'react'
import { obtenerProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from '../services/projects'

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const recargar = async () => {
    setLoading(true)
    try {
      const data = await obtenerProyectos()
      setProjects(data.map(p => ({
        ...p,
        icon: p.icon || 'FolderOutlined',
        color: p.color || '#1890ff'
      })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    recargar()
  }, [])

  return (
    <ProjectContext.Provider value={{ projects, loading, recargar }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (!context) {
    return { projects: [], loading: true, recargar: () => {} }
  }
  return context
}