import { useState, useCallback } from 'react'
import { crearTarea, actualizarTarea } from '../../../services/tasks'

export function useTaskForm(nombreProyecto) {
  const [loading, setLoading] = useState(false)

  const handleCrear = useCallback(async (data) => {
    if (!nombreProyecto) return
    setLoading(true)
    try {
      await crearTarea(nombreProyecto, data)
    } finally {
      setLoading(false)
    }
  }, [nombreProyecto])

  const handleActualizar = useCallback(async (tareaId, data) => {
    if (!nombreProyecto) return
    setLoading(true)
    try {
      await actualizarTarea(nombreProyecto, tareaId, data)
    } finally {
      setLoading(false)
    }
  }, [nombreProyecto])

  const handleSubmit = useCallback(async (tareaId, data) => {
    if (!nombreProyecto) return
    if (tareaId) {
      await handleActualizar(tareaId, data)
    } else {
      await handleCrear(data)
    }
  }, [nombreProyecto, handleCrear, handleActualizar])

  return {
    loading,
    handleSubmit,
  }
}