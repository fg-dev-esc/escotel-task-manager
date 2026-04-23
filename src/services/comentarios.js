import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

export async function agregarComentario(tareaId, texto, fotosFiles = []) {
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

    // Subir fotos a Storage
    const fotosUpload = []
    for (const archivo of fotosFiles) {
      const fotoId = uuidv4()
      const rutaStorage = `comentarios/${tareaId}/${comentarioId}/${fotoId}`
      const storageRef = ref(storage, rutaStorage)

      await uploadBytes(storageRef, archivo)
      const url = await getDownloadURL(storageRef)

      fotosUpload.push({
        id: fotoId,
        nombre: archivo.name,
        url: url,
        timestamp: new Date().toISOString()
      })
    }

    // Crear objeto comentario
    const nuevoComentario = {
      id: comentarioId,
      texto: texto.trim(),
      fotos: fotosUpload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Agregar a array historial (nuevo comentario al inicio)
    const historialActual = tarea.historial || []
    const nuevoHistorial = [nuevoComentario, ...historialActual]

    // Actualizar tarea en Firestore
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

export async function actualizarComentario(
  tareaId,
  comentarioId,
  texto,
  fotosNuevas = [],
  fotosAEliminar = []
) {
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

    // Encontrar comentario
    const comentario = tarea.historial?.find(c => c.id === comentarioId)
    if (!comentario) {
      throw new Error('Comentario no encontrado')
    }

    // Eliminar fotos del Storage
    for (const fotoId of fotosAEliminar) {
      const rutaStorage = `comentarios/${tareaId}/${comentarioId}/${fotoId}`
      const fotoRef = ref(storage, rutaStorage)
      await deleteObject(fotoRef).catch(() => {
      })
    }

    // Subir fotos
    const fotosUpload = []
    for (const archivo of fotosNuevas) {
      const fotoId = uuidv4()
      const rutaStorage = `comentarios/${tareaId}/${comentarioId}/${fotoId}`
      const storageRef = ref(storage, rutaStorage)

      await uploadBytes(storageRef, archivo)
      const url = await getDownloadURL(storageRef)

      fotosUpload.push({
        id: fotoId,
        nombre: archivo.name,
        url: url,
        timestamp: new Date().toISOString()
      })
    }

    // Filtrar fotos existentes que no se eliminen
    const fotosExistentes = comentario.fotos?.filter(
      f => !fotosAEliminar.includes(f.id)
    ) || []

    // Actualizar comentario
    comentario.texto = texto.trim()
    comentario.fotos = [...fotosExistentes, ...fotosUpload]
    comentario.updatedAt = new Date().toISOString()

    // Actualizar array historial
    const nuevoHistorial = tarea.historial.map(c =>
      c.id === comentarioId ? comentario : c
    )

    // Guardar en Firestore
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

/**
 * Eliminar comentario y sus fotos
 * @param {string} tareaId - ID de la tarea
 * @param {string} comentarioId - ID del comentario
 * @returns {Promise<void>}
 */
export async function eliminarComentario(tareaId, comentarioId) {
  try {
    // Obtener tarea
    const tareaRef = doc(db, 'tareas', tareaId)
    const tareaSnap = await getDoc(tareaRef)
    if (!tareaSnap.exists()) {
      throw new Error('Tarea no encontrada')
    }
    const tarea = tareaSnap.data()

    // Encontrar comentario
    const comentario = tarea.historial?.find(c => c.id === comentarioId)
    if (!comentario) {
      throw new Error('Comentario no encontrado')
    }

    // Eliminar fotos del Storage
    for (const foto of comentario.fotos || []) {
      const rutaStorage = `comentarios/${tareaId}/${comentarioId}/${foto.id}`
      const fotoRef = ref(storage, rutaStorage)
      await deleteObject(fotoRef).catch(() => {
        // Continuar si la foto no existe
      })
    }

    // Remover comentario del array historial
    const nuevoHistorial = tarea.historial.filter(c => c.id !== comentarioId)

    // Actualizar tarea
    await updateDoc(tareaRef, {
      historial: nuevoHistorial,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error eliminando comentario:', error)
    throw error
  }
}
