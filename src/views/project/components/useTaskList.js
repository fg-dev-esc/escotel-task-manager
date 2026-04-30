import { useState, useEffect, useCallback } from 'react'
import {
  obtenerTareasPorArea,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from '../../../services/tasks'

export function useTaskList(areaId) {
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarTareas = useCallback(async () => {
    if (!areaId) return

    try {
      setLoading(true)
      setError(null)
      const data = await obtenerTareasPorArea(areaId)
      setTareas(data)
    } catch (err) {
      console.error('Error cargando tareas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [areaId])

  useEffect(() => {
    cargarTareas()
  }, [cargarTareas])

  const calcularStats = useCallback(() => {
    const now = new Date()

    return {
      activas: tareas.filter(t => t.estado !== 'done').length,
      completadas: tareas.filter(t => t.estado === 'done').length,
      vencidas: tareas.filter(
        t =>
          t.estado !== 'done' &&
          t.dueDate &&
          new Date(t.dueDate) < now
      ).length,
      total: tareas.length
    }
  }, [tareas])

  const handleCrear = useCallback(
    async tarea => {
      try {
        const nuevaTarea = await crearTarea(areaId, tarea)

        setTareas(prev => [nuevaTarea, ...prev])

        return nuevaTarea
      } catch (err) {
        console.error('Error creando tarea:', err)
        throw err
      }
    },
    [areaId]
  )

  const handleActualizar = useCallback(
    async (tareaId, updates) => {
      try {
        await actualizarTarea(tareaId, updates)

        setTareas(prev =>
          prev.map(t =>
            t.id === tareaId
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          )
        )
      } catch (err) {
        console.error('Error actualizando tarea:', err)
        throw err
      }
    },
    []
  )

  const handleEliminar = useCallback(
    async tareaId => {
      try {
        await eliminarTarea(tareaId)

        setTareas(prev => prev.filter(t => t.id !== tareaId))
      } catch (err) {
        console.error('Error eliminando tarea:', err)
        throw err
      }
    },
    []
  )

  return {
    tareas,
    stats: calcularStats(),
    loading,
    error,
    cargarTareas,
    crearTarea: handleCrear,
    actualizarTarea: handleActualizar,
    eliminarTarea: handleEliminar
  }
}
