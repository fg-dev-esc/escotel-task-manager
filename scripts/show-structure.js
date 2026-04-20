import { db } from '../src/lib/firebase.js'
import { collection, getDocs, doc } from 'firebase/firestore'

export async function mostrarEstructuraJSON() {
  console.log('=== ESTRUCTURA COMPLETA DE FIRESTORE ===\n')

  try {
    const proyectosSnapshot = await getDocs(collection(db, 'proyectos'))
    const estructura = {
      proyectos: []
    }

    console.log('proyectos/:')
    
    for (const proyectoDoc of proyectosSnapshot.docs) {
      const proyectoData = proyectoDoc.data()
      console.log(`\n  ${proyectoDoc.id}/:`)
      console.log(`    name: ${proyectoData.name}`)
      console.log(`    description: ${proyectoData.description}`)
      
      const tareasColRef = collection(db, 'proyectos', proyectoDoc.id, 'tareas')
      const tareasSnapshot = await getDocs(tareasColRef)
      const proyecto = {
        id: proyectoDoc.id,
        ...proyectoData,
        tareas: []
      }

      console.log(`    tareas/: (${tareasSnapshot.size} documentos)`)
      
      for (const tareaDoc of tareasSnapshot.docs) {
        const tareaData = tareaDoc.data()
        console.log(`      ${tareaDoc.id}/`)
        console.log(`        titulo: ${tareaData.titulo}`)
        
        const comentariosColRef = collection(db, 'proyectos', proyectoDoc.id, 'tareas', tareaDoc.id, 'comentarios')
        const comentariosSnapshot = await getDocs(comentariosColRef)
        console.log(`        comentarios/: (${comentariosSnapshot.size} documentos)`)
        
        const adjuntosColRef = collection(db, 'proyectos', proyectoDoc.id, 'tareas', tareaDoc.id, 'adjuntos')
        const adjuntosSnapshot = await getDocs(adjuntosColRef)
        console.log(`        adjuntos/: (${adjuntosSnapshot.size} documentos)`)
        
        const tarea = {
          id: tareaDoc.id,
          ...tareaData,
          comentarios: []
        }

        for (const comDoc of comentariosSnapshot.docs) {
          tarea.comentarios.push({
            id: comDoc.id,
            ...comDoc.data()
          })
        }

        proyecto.tareas.push(tarea)
      }

      estructura.proyectos.push(proyecto)
    }

    console.log('\n\n=== JSON STRUCTURE ===\n')
    console.log(JSON.stringify(estructura, null, 2))
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

mostrarEstructuraJSON().catch(console.error)

