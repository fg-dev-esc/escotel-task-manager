import { useState, useEffect, useCallback, useRef } from 'react'
import { obtenerTareas, actualizarTarea } from '../../services/tasks'

const COLUMNAS = [
  { id: 'todo', label: 'POR HACER' },
  { id: 'in_progress', label: 'EN CURSO' },
  { id: 'in_review', label: 'EN REVISION' },
  { id: 'done', label: 'COMPLETADO' },
]

export function useTaskKanban(proyectoId) {
  const [tareas, setTareas] = useState([])
  const tareasRef = useRef([])

  const cargarTareas = useCallback(async () => {
    try {
      const resultado = await obtenerTareas()
      const filtradas = proyectoId 
        ? resultado.filter(t => t.proyectoId === proyectoId)
        : resultado
      tareasRef.current = filtradas
      setTareas(filtradas)
    } catch (e) {
      console.error(e)
      setTareas(tareasRef.current)
    }
  }, [proyectoId])

  useEffect(() => {
    cargarTareas()
  }, [cargarTareas])

  const moverTareaOptimista = (tareaId, nuevoEstado) => {
    setTareas(prev => prev.map(t => 
      t.id === tareaId ? { ...t, estado: nuevoEstado } : t
    ))
  }

  const sincronizar = async () => {
    await cargarTareas()
  }

  return {
    tareas,
    columnas: COLUMNAS,
    recargar: cargarTareas,
    sincronizar,
    moverTareaOptimista,
  }
}