import { useState, useCallback } from 'react'
import {
  agregarComentario as agregarComentarioService,
  obtenerComentarios as obtenerComentariosService,
  actualizarComentario as actualizarComentarioService,
  eliminarComentario as eliminarComentarioService
} from '../services/comentarios'


export function useComentarios(tareaId) {
  const [comentarios, setComentarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargarComentarios = useCallback(async () => {
    if (!tareaId) return

    try {
      setLoading(true)
      setError(null)
      const data = await obtenerComentariosService(tareaId)
      setComentarios(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error cargando comentarios:', err)
    } finally {
      setLoading(false)
    }
  }, [tareaId])

  // Agregar comentario
  const agregarComentario = useCallback(
    async (texto, fotos = [], autor = '') => {
      if (!tareaId) return false

      try {
        setLoading(true)
        setError(null)
        const nuevoComentario = await agregarComentarioService(tareaId, texto, fotos, autor)
        setComentarios(prev => [nuevoComentario, ...prev])
        return true
      } catch (err) {
        setError(err.message)
        console.error('Error agregando comentario:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [tareaId]
  )

  // Actualizar comentario
  const actualizarComentario = useCallback(
    async (comentarioId, texto, fotosNuevas = [], fotosAEliminar = []) => {
      if (!tareaId) return false

      try {
        setLoading(true)
        setError(null)
        const comentarioActualizado = await actualizarComentarioService(
          tareaId,
          comentarioId,
          texto,
          fotosNuevas,
          fotosAEliminar
        )
        // Actualizar en la lista
        setComentarios(prev =>
          prev.map(c => (c.id === comentarioId ? comentarioActualizado : c))
        )
        return true
      } catch (err) {
        setError(err.message)
        console.error('Error actualizando comentario:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [tareaId]
  )

  // Eliminar comentario
  const eliminarComentario = useCallback(
    async (comentarioId) => {
      if (!tareaId) return false

      try {
        setLoading(true)
        setError(null)
        await eliminarComentarioService(tareaId, comentarioId)
        // Remover de la lista
        setComentarios(prev => prev.filter(c => c.id !== comentarioId))
        return true
      } catch (err) {
        setError(err.message)
        console.error('Error eliminando comentario:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [tareaId]
  )

  return {
    comentarios,
    loading,
    error,
    cargarComentarios,
    agregarComentario,
    actualizarComentario,
    eliminarComentario
  }
}
