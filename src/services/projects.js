import { db } from '../lib/firebase.js'
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export async function obtenerProyectos() {
  const snapshot = await getDocs(collection(db, 'proyectos'))
  const proyectos = []
  snapshot.forEach(docSnapshot => {
    const data = docSnapshot.data()
    proyectos.push({ 
      id: docSnapshot.id, 
      name: data.name,
      description: data.description,
      color: data.color,
      icon: data.icon,
      createdAt: data.createdAt
    })
  })
  return proyectos
}

export async function crearProyecto(proyecto) {
  const projectRef = doc(collection(db, 'proyectos'), proyecto.id)
  await setDoc(projectRef, proyecto)
  return proyecto.id
}

export async function actualizarProyecto(projectId, proyecto) {
  const projectRef = doc(db, 'proyectos', projectId)
  await updateDoc(projectRef, proyecto)
  return true
}

export async function eliminarProyecto(projectId) {
  const projectRef = doc(db, 'proyectos', projectId)
  await deleteDoc(projectRef)
  return true
}