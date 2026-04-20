import { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea } from '../src/services/tasks.js'

async function testTasks() {
  console.log('=== TEST TASKS ===')

  // 1. Crear
  const id = await crearTarea({
    titulo: 'Tarea de prueba',
    descripcion: 'Descripcion de prueba',
    prioridad: 'high'
  })
  console.log('Tarea creada:', id)

  // 2. Leer
  const tareas = await obtenerTareas()
  console.log('Tareas:', tareas.length)

  // 3. Actualizar
  await actualizarTarea(id, { titulo: 'Tarea actualizada', estado: 'done' })
  console.log('Tarea actualizada')

  // 4. Eliminar
  await eliminarTarea(id)
  console.log('Tarea eliminada')

  console.log('=== TEST TASKS OK ===')
}

testTasks().catch(console.error)