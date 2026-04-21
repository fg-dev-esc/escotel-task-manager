import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { obtenerAreas, crearArea, actualizarArea, eliminarArea } from '../services/areas'

const AreasContext = createContext()

export function AreasProvider({ children }) {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // [QUERY 1] Cargar áreas una sola vez
  useEffect(() => {
    const cargarAreas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await obtenerAreas()
        setAreas(
          data.map(area => ({
            ...area,
            icon: area.icon || 'FolderOutlined',
            color: area.color || '#1890ff'
          }))
        )
      } catch (err) {
        console.error('Error cargando áreas:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarAreas()
  }, [])

  const recargar = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await obtenerAreas()
      setAreas(
        data.map(area => ({
          ...area,
          icon: area.icon || 'FolderOutlined',
          color: area.color || '#1890ff'
        }))
      )
    } catch (err) {
      console.error('Error recargando áreas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const crear = useCallback(
    async areaData => {
      try {
        const nuevaArea = await crearArea(areaData)
        setAreas(prev => [
          ...prev,
          {
            ...nuevaArea,
            icon: nuevaArea.icon || 'FolderOutlined',
            color: nuevaArea.color || '#1890ff'
          }
        ])
        return nuevaArea
      } catch (err) {
        console.error('Error creando área:', err)
        throw err
      }
    },
    []
  )

  const actualizar = useCallback(
    async (areaId, updates) => {
      try {
        await actualizarArea(areaId, updates)
        setAreas(prev =>
          prev.map(area =>
            area.id === areaId ? { ...area, ...updates } : area
          )
        )
      } catch (err) {
        console.error('Error actualizando área:', err)
        throw err
      }
    },
    []
  )

  const eliminar = useCallback(
    async areaId => {
      try {
        await eliminarArea(areaId)
        setAreas(prev => prev.filter(area => area.id !== areaId))
      } catch (err) {
        console.error('Error eliminando área:', err)
        throw err
      }
    },
    []
  )

  return (
    <AreasContext.Provider
      value={{
        areas,
        loading,
        error,
        recargar,
        crear,
        actualizar,
        eliminar
      }}
    >
      {children}
    </AreasContext.Provider>
  )
}

export function useAreas() {
  const context = useContext(AreasContext)
  if (!context) {
    return {
      areas: [],
      loading: true,
      error: null,
      recargar: () => {},
      crear: () => {},
      actualizar: () => {},
      eliminar: () => {}
    }
  }
  return context
}
