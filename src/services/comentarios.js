import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export async function agregarComentario(tareaId, texto, autor = '') {
  try {
    if (!texto?.trim()) {
      throw new Error('El comentario no puede estar vacío')
    }

    const tareaRef = doc(db, 'tareas', tareaId)
    const tareaSnap = await getDoc(tareaRef)
    if (!tareaSnap.exists()) {
      throw new Error('Tarea no encontrada')
    }
    const tarea = tareaSnap.data()

    const comentarioId = uuidv4()

    const nuevoComentario = {
      id: comentarioId,
      texto: texto.trim(),
      autor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const historialActual = tarea.historial || []
    const nuevoHistorial = [nuevoComentario, ...historialActual]

    await updateDoc(tareaRef, {
      historial: nuevoHistorial,
      updatedAt: new Date().toISOString()
    })

    return nuevoComentario
  } catch (error) {
    console.error('Error agregando comentario:', error)
    throw error
  }
}

export async function obtenerComentarios(tareaId) {
  try {
    const tareaRef = doc(db, 'tareas', tareaId)
    const tareaSnap = await getDoc(tareaRef)

    if (!tareaSnap.exists()) {
      return []
    }

    const historial = tareaSnap.data().historial || []
    return historial.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error obteniendo comentarios:', error)
    throw error
  }
}

export async function actualizarComentario(tareaId, comentarioId, texto) {
  try {
    if (!texto?.trim()) {
      throw new Error('El comentario no puede estar vacío')
    }

    const tareaRef = doc(db, 'tareas', tareaId)
    const tareaSnap = await getDoc(tareaRef)
    if (!tareaSnap.exists()) {
      throw new Error('Tarea no encontrada')
    }
    const tarea = tareaSnap.data()

    const comentario = tarea.historial?.find(c => c.id === comentarioId)
    if (!comentario) {
      throw new Error('Comentario no encontrado')
    }

    comentario.texto = texto.trim()
    comentario.updatedAt = new Date().toISOString()

    const nuevoHistorial = tarea.historial.map(c =>
      c.id === comentarioId ? comentario : c
    )

    await updateDoc(tareaRef, {
      historial: nuevoHistorial,
      updatedAt: new Date().toISOString()
    })

    return comentario
  } catch (error) {
    console.error('Error actualizando comentario:', error)
    throw error
  }
}

export async function eliminarComentario(tareaId, comentarioId) {
  try {
    const tareaRef = doc(db, 'tareas', tareaId)
    const tareaSnap = await getDoc(tareaRef)
    if (!tareaSnap.exists()) {
      throw new Error('Tarea no encontrada')
    }
    const tarea = tareaSnap.data()

    const nuevoHistorial = tarea.historial.filter(c => c.id !== comentarioId)

    await updateDoc(tareaRef, {
      historial: nuevoHistorial,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error eliminando comentario:', error)
    throw error
  }
}