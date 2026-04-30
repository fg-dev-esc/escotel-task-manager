import { db } from '../lib/firebase.js'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore'

export async function obtenerTareasPorArea(areaId) {
  try {
    if (!areaId) {
      console.error('Error: areaId requerido')
      return []
    }

    const q = query(
      collection(db, 'tareas'),
      where('areaId', '==', areaId)
    )
    const snapshot = await getDocs(q)
    const tareas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return tareas.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  } catch (error) {
    console.error('Error obteniendo tareas por área:', error)
    return []
  }
}

export async function crearTarea(areaId, tarea) {
  try {
    if (!areaId) {
      console.error('Error: areaId requerido')
      return null
    }

    if (!tarea.titulo) {
      console.error('Error: titulo requerido')
      return null
    }

    const { titulo, descripcion, prioridad, dueDate, estado } = tarea

    const docRef = await addDoc(collection(db, 'tareas'), {
      areaId,
      titulo,
      descripcion: descripcion || '',
      prioridad: prioridad || 'medium',
      estado: estado || 'todo',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return {
      id: docRef.id,
      areaId,
      titulo,
      descripcion: descripcion || '',
      prioridad: prioridad || 'medium',
      estado: estado || 'todo',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error creando tarea:', error)
    throw error
  }
}

export async function actualizarTarea(tareaId, updates) {
  try {
    if (!tareaId) {
      console.error('Error: tareaId requerido')
      return false
    }

    const tareaRef = doc(db, 'tareas', tareaId)
    await updateDoc(tareaRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })

    return true
  } catch (error) {
    console.error('Error actualizando tarea:', error)
    throw error
  }
}

export async function eliminarTarea(tareaId) {
  try {
    if (!tareaId) {
      console.error('Error: tareaId requerido')
      return false
    }

    const tareaRef = doc(db, 'tareas', tareaId)
    await deleteDoc(tareaRef)

    return true
  } catch (error) {
    console.error('Error eliminando tarea:', error)
    throw error
  }
}

export async function eliminarTareasPorArea(areaId) {
  try {
    if (!areaId) {
      console.error('Error: areaId requerido')
      return false
    }

    const tareas = await obtenerTareasPorArea(areaId)

    for (const tarea of tareas) {
      await deleteDoc(doc(db, 'tareas', tarea.id))
    }

    return true
  } catch (error) {
    console.error('Error eliminando tareas por área:', error)
    throw error
  }
}