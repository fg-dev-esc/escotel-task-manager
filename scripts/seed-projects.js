import { db } from '../src/lib/firebase.js'
import { collection, setDoc, doc, addDoc } from 'firebase/firestore'

export async function crearProyectoConTareas() {
  console.log('=== CREANDO PROYECTO Y TAREAS ===\n')

  try {
    const nombreProyecto = 'tareas'
    const projectRef = doc(collection(db, 'proyectos'), nombreProyecto)
    
    await setDoc(projectRef, {
      name: nombreProyecto,
      description: 'Proyecto de tareas de ejemplo',
      color: '#1890ff',
      icon: 'ProjectOutlined',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('Proyecto creado:', nombreProyecto)

    const tareas = [
      {
        titulo: 'Tarea 1: Revisar documentación',
        descripcion: 'Leer la documentación del proyecto',
        estado: 'todo',
        prioridad: 'high'
      },
      {
        titulo: 'Tarea 2: Configurar base de datos',
        descripcion: 'Configurar Firebase Firestore',
        estado: 'in-progress',
        prioridad: 'high'
      },
      {
        titulo: 'Tarea 3: Crear componentes UI',
        descripcion: 'Diseñar los componentes de React',
        estado: 'todo',
        prioridad: 'medium'
      },
      {
        titulo: 'Tarea 4: Testing',
        descripcion: 'Escribir tests unitarios',
        estado: 'todo',
        prioridad: 'low'
      }
    ]

    console.log('Agregando tareas...')
    
    const tareasColRef = collection(db, 'proyectos', nombreProyecto, 'tareas')
    for (const tarea of tareas) {
      await addDoc(tareasColRef, {
        ...tarea,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    console.log('Proyecto creado exitosamente')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

crearProyectoConTareas().catch(console.error)

