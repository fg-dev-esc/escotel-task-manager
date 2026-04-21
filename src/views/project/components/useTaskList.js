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

  // [QUERY 2] Cargar tareas cuando entra al área
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

  // STATS CALCULADOS EN CLIENTE (EN MEMORIA)
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

  // CREAR TAREA (LOCAL + FIRESTORE)
  const handleCrear = useCallback(
    async tarea => {
      try {
        const nuevaTarea = await crearTarea(areaId, tarea)

        // Agregar a Context local
        setTareas(prev => [nuevaTarea, ...prev])

        return nuevaTarea
      } catch (err) {
        console.error('Error creando tarea:', err)
        throw err
      }
    },
    [areaId]
  )

  // ACTUALIZAR TAREA (LOCAL + FIRESTORE)
  const handleActualizar = useCallback(
    async (tareaId, updates) => {
      try {
        await actualizarTarea(tareaId, updates)

        // Actualizar Context local (UI responde al instante)
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

  // ELIMINAR TAREA (LOCAL + FIRESTORE)
  const handleEliminar = useCallback(
    async tareaId => {
      try {
        await eliminarTarea(tareaId)

        // Actualizar Context local
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
    stats: calcularStats(), // Se recalcula cada render
    loading,
    error,
    cargarTareas,
    crearTarea: handleCrear,
    actualizarTarea: handleActualizar,
    eliminarTarea: handleEliminar
  }
}
