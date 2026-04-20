import { db } from '../src/lib/firebase.js'
import { collection, getDocs } from 'firebase/firestore'

export async function explorarFirestore() {
  console.log('=== EXPLORANDO FIRESTORE ===\n')

  // Colecciones probables
  const coleccionesAProbar = [
    'proyectos',
    'projects',
    'tasks',
    'tareas',
    'test'
  ]

  for (const colName of coleccionesAProbar) {
    try {
      const snapshot = await getDocs(collection(db, colName))
      console.log(`\n📁 ${colName}`)
      console.log(`   Documentos: ${snapshot.size}`)
      
      // Mostrar los IDs de los documentos
      if (snapshot.size > 0) {
        snapshot.forEach((doc, index) => {
          console.log(`   - ${index + 1}. ${doc.id}`)
          const data = doc.data()
          console.log(`     Data: ${JSON.stringify(data).substring(0, 150)}...`)
        })
      }
    } catch (error) {
      console.log(`\n❌ ${colName}: No existe o error de acceso`)
    }
  }

  console.log('\n=== FIN EXPLORACIÓN ===')
}

// Ejecutar
explorarFirestore().catch(console.error)
