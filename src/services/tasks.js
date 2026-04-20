import { db } from '../lib/firebase.js'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore'

export async function crearTarea(nombreProyecto, tarea) {
  if (!tarea.titulo) {
    console.error('Error: titulo requerido')
    return null
  }

  if (!nombreProyecto) {
    console.error('Error: nombreProyecto requerido')
    return null
  }

  const data = {
    titulo: tarea.titulo,
    descripcion: tarea.descripcion || '',
    estado: tarea.estado || 'todo',
    prioridad: tarea.prioridad || 'medium',
    dueDate: tarea.dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const tareasColRef = collection(db, 'proyectos', nombreProyecto, 'tareas')
  const docRef = await addDoc(tareasColRef, data)
  console.log('Tarea creada:', docRef.id)
  return docRef.id
}

export async function obtenerTareas(nombreProyecto) {
  if (!nombreProyecto) {
    console.error('Error: nombreProyecto requerido')
    return []
  }

  const tareasColRef = collection(db, 'proyectos', nombreProyecto, 'tareas')
  const q = query(tareasColRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  const tareas = []
  
  snapshot.forEach(doc => {
    tareas.push({ id: doc.id, ...doc.data() })
  })
  console.log('Tareas obtenidas:', tareas.length)
  return tareas
}

export async function obtenerConteoTareas(nombreProyecto) {
  if (!nombreProyecto) return { todo: 0, in_progress: 0, in_review: 0, done: 0, vencidas: 0 }

  const tareasColRef = collection(db, 'proyectos', nombreProyecto, 'tareas')
  const snapshot = await getDocs(tareasColRef)
  
  const conteo = { todo: 0, in_progress: 0, in_review: 0, done: 0, vencidas: 0 }
  const now = new Date()
  
  snapshot.forEach(doc => {
    const data = doc.data()
    const estado = data.estado || 'todo'
    if (conteo.hasOwnProperty(estado)) {
      conteo[estado]++
    }
    // Vencidas: tiene dueDate, no está completada, y la fecha ya pasó
    if (data.dueDate && estado !== 'done') {
      const dueDate = new Date(data.dueDate)
      if (dueDate < now) {
        conteo.vencidas++
      }
    }
  })
  return conteo
}

export async function actualizarTarea(nombreProyecto, tareaId, tarea) {
  if (!nombreProyecto || !tareaId) {
    console.error('Error: nombreProyecto y tareaId requeridos')
    return false
  }

  const docRef = doc(db, 'proyectos', nombreProyecto, 'tareas', tareaId)
  const data = {
    ...tarea,
    updatedAt: new Date().toISOString()
  }

  await updateDoc(docRef, data)
  console.log('Tarea actualizada:', tareaId)
  return true
}

export async function eliminarTarea(nombreProyecto, tareaId) {
  if (!nombreProyecto || !tareaId) {
    console.error('Error: nombreProyecto y tareaId requeridos')
    return false
  }

  const docRef = doc(db, 'proyectos', nombreProyecto, 'tareas', tareaId)
  await deleteDoc(docRef)
  console.log('Tarea eliminada:', tareaId)
  return true
}

export async function agregarComentario(nombreProyecto, tareaId, comentario) {
  if (!nombreProyecto || !tareaId) {
    console.error('Error: nombreProyecto y tareaId requeridos')
    return false
  }

  const comentariosColRef = collection(db, 'proyectos', nombreProyecto, 'tareas', tareaId, 'comentarios')
  const data = {
    texto: comentario.texto,
    autor: comentario.autor || 'Usuario',
    fecha: new Date().toISOString()
  }

  await addDoc(comentariosColRef, data)
  console.log('Comentario agregado')
  return true
}

export async function agregarAdjunto(nombreProyecto, tareaId, adjunto) {
  if (!nombreProyecto || !tareaId) {
    console.error('Error: nombreProyecto y tareaId requeridos')
    return false
  }

  const adjuntosColRef = collection(db, 'proyectos', nombreProyecto, 'tareas', tareaId, 'adjuntos')
  const data = {
    url: adjunto.url,
    nombre: adjunto.nombre || 'archivo',
    fecha: new Date().toISOString()
  }

  await addDoc(adjuntosColRef, data)
  console.log('Adjunto agregado')
  return true
}