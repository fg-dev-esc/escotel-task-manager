import { useState, useEffect, useCallback, useRef } from 'react'
import { obtenerTareas, actualizarTarea, eliminarTarea } from '../../../services/tasks'

export function useTaskList(nombreProyecto) {
  const [tareas, setTareas] = useState([])
  const [error, setError] = useState(null)
  const tareasRef = useRef([])

  const cargarTareas = useCallback(async () => {
    if (!nombreProyecto) return
    setError(null)
    try {
      const resultado = await obtenerTareas(nombreProyecto)
      tareasRef.current = resultado
      setTareas(resultado)
    } catch (e) {
      setError(e.message)
      setTareas(tareasRef.current)
    }
  }, [nombreProyecto])

  useEffect(() => {
    cargarTareas()
  }, [cargarTareas])

  const handleActualizar = async (tareaId, data) => {
    await actualizarTarea(nombreProyecto, tareaId, data)
    await cargarTareas()
  }

  const handleEliminar = async (tareaId) => {
    await eliminarTarea(nombreProyecto, tareaId)
    await cargarTareas()
  }

  return {
    tareas,
    error,
    recargar: cargarTareas,
    actualizar: handleActualizar,
    eliminar: handleEliminar,
  }
}