import { db } from './firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const COLECCION_TEST = 'test'

export async function testAgregar() {
  const docRef = await addDoc(collection(db, COLECCION_TEST), {
    mensaje: 'Hola Firebase!',
    fecha: new Date().toISOString()
  })
  console.log('Documento creado con ID:', docRef.id)
  return docRef.id
}

export async function testLeer() {
  const snapshot = await getDocs(collection(db, COLECCION_TEST))
  console.log('Documentos encontrados:', snapshot.size)
  snapshot.forEach(doc => {
    console.log('  -', doc.id, doc.data())
  })
}

export async function testActualizar(docId) {
  await updateDoc(doc(db, COLECCION_TEST, docId), {
    mensaje: 'Actualizado!'
  })
  console.log('Documento actualizado')
}

export async function testEliminar(docId) {
  await deleteDoc(doc(db, COLECCION_TEST, docId))
  console.log('Documento eliminado')
}

export async function testCompleto() {
  console.log('=== TEST COMPLETO FIREBASE ===')
  const id = await testAgregar()
  await testLeer()
  await testActualizar(id)
  await testEliminar(id)
  console.log('=== TEST FINALIZADO ===')
}