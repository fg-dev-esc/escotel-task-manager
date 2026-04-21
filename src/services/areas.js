import { db } from '../lib/firebase.js'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { eliminarTareasPorArea } from './tasks'

// OBTENER TODAS LAS ÁREAS
export async function obtenerAreas() {
  try {
    const snapshot = await getDocs(collection(db, 'áreas'))
    return snapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    }))
  } catch (error) {
    console.error('Error obteniendo áreas:', error)
    return []
  }
}

// CREAR ÁREA
export async function crearArea(areaData) {
  try {
    const { nombre, descripcion, color, icon } = areaData

    const docRef = await addDoc(collection(db, 'áreas'), {
      nombre,
      descripcion: descripcion || '',
      color: color || '#1890ff',
      icon: icon || 'FolderOutlined',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return {
      id: docRef.id,
      nombre,
      descripcion: descripcion || '',
      color: color || '#1890ff',
      icon: icon || 'FolderOutlined',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error creando área:', error)
    throw error
  }
}

// ACTUALIZAR ÁREA
export async function actualizarArea(areaId, updates) {
  try {
    const areaRef = doc(db, 'áreas', areaId)
    await updateDoc(areaRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error actualizando área:', error)
    throw error
  }
}

// ELIMINAR ÁREA (+ sus tareas)
export async function eliminarArea(areaId) {
  try {
    // Primero eliminar todas las tareas del área
    await eliminarTareasPorArea(areaId)

    // Luego eliminar el área
    const areaRef = doc(db, 'áreas', areaId)
    await deleteDoc(areaRef)
  } catch (error) {
    console.error('Error eliminando área:', error)
    throw error
  }
}
