import { db } from '../src/lib/firebase.js'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const COLECCION = 'test'

export async function testFirebase() {
  console.log('=== TEST FIREBASE ===')

  // 1. Agregar
  const docRef = await addDoc(collection(db, COLECCION), {
    mensaje: 'Hola Firebase!',
    fecha: new Date().toISOString()
  })
  const id = docRef.id
  console.log('Agregado, ID:', id)

  // 2. Leer
  const snapshot = await getDocs(collection(db, COLECCION))
  console.log('Total docs:', snapshot.size)

  // 3. Actualizar
  await updateDoc(doc(db, COLECCION, id), { mensaje: 'Actualizado!' })
  console.log('Actualizado')

  // 4. Eliminar
  await deleteDoc(doc(db, COLECCION, id))
  console.log('Eliminado')

  console.log('=== TEST OK ===')
  return true
}

// Ejecutar
testFirebase().catch(console.error)