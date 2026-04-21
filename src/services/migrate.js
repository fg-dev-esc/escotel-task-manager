import { collection, getDocs, addDoc, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from './lib/firebase'

/**
 * SCRIPT DE MIGRACIÓN: Proyectos → Áreas, Tareas subcollections → Tareas flat
 * 
 * Instrucciones:
 * 1. Crear una ruta temporal en App.jsx que llame esta función (ej: /migrate)
 * 2. Ejecutar una sola vez
 * 3. Validar en Firebase Console
 * 4. Eliminar la ruta temporal
 * 5. Eliminar colección "proyectos" manualmente en Console
 */

export async function migrateProyectosToAreas() {
  console.log('🚀 Iniciando migración...')

  try {
    // PASO 1: Obtener todos los proyectos
    console.log('📝 Paso 1: Leyendo proyectos...')
    const proyectosSnapshot = await getDocs(collection(db, 'proyectos'))
    const proyectos = []

    proyectosSnapshot.forEach(doc => {
      proyectos.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`✅ Encontrados ${proyectos.length} proyectos`)

    // PASO 2: Migrar cada proyecto a área
    console.log('📝 Paso 2: Creando áreas...')
    for (const proyecto of proyectos) {
      const areaData = {
        nombre: proyecto.name,
        descripcion: proyecto.description || '',
        color: proyecto.color || '#1890ff',
        icon: proyecto.icon || 'FolderOutlined',
        createdAt: proyecto.createdAt,
        updatedAt: proyecto.updatedAt
      }

      // Crear área con mismo ID del proyecto
      await setDoc(doc(db, 'áreas', proyecto.id), areaData)
      console.log(`✅ Área creada: ${proyecto.name}`)

      // PASO 3: Migrar tareas del proyecto a colección flat
      console.log(`📝 Migrando tareas de "${proyecto.name}"...`)
      const tareasSnapshot = await getDocs(
        collection(db, 'proyectos', proyecto.id, 'tareas')
      )

      let tareasMigradas = 0
      for (const tareaDoc of tareasSnapshot.docs) {
        const tareaData = tareaDoc.data()

        // Crear tarea en colección flat con mismo ID
        await setDoc(doc(db, 'tareas', tareaDoc.id), {
          areaId: proyecto.id, // Referencia al área
          titulo: tareaData.titulo,
          descripcion: tareaData.descripcion || '',
          estado: tareaData.estado || 'todo',
          prioridad: tareaData.prioridad || 'medium',
          dueDate: tareaData.dueDate || null,
          createdAt: tareaData.createdAt,
          updatedAt: tareaData.updatedAt
        })

        tareasMigradas++
      }

      console.log(`✅ ${tareasMigradas} tareas migradas para "${proyecto.name}"`)
    }

    console.log('✨ Migración completada correctamente')
    console.log('⚠️ Próximo paso: Eliminar colección "proyectos" manualmente en Firebase Console')

    return {
      success: true,
      proyectosMigrados: proyectos.length,
      mensaje: 'Migración completada. Verifica en Firebase Console.'
    }
  } catch (error) {
    console.error('❌ Error en migración:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * FUNCIÓN PARA VERIFICAR LA MIGRACIÓN
 */
export async function verificarMigracion() {
  console.log('🔍 Verificando migración...')

  try {
    // Contar áreas
    const areasSnapshot = await getDocs(collection(db, 'áreas'))
    console.log(`✅ Áreas encontradas: ${areasSnapshot.size}`)

    // Contar tareas
    const tareasSnapshot = await getDocs(collection(db, 'tareas'))
    console.log(`✅ Tareas encontradas: ${tareasSnapshot.size}`)

    // Validar que cada tarea tiene areaId
    let tareasValidas = 0
    let tareasInvalidas = 0

    tareasSnapshot.forEach(doc => {
      const tarea = doc.data()
      if (tarea.areaId) {
        tareasValidas++
      } else {
        tareasInvalidas++
        console.warn(`⚠️ Tarea sin areaId: ${doc.id}`)
      }
    })

    console.log(`✅ Tareas válidas: ${tareasValidas}`)
    if (tareasInvalidas > 0) {
      console.error(`❌ Tareas inválidas: ${tareasInvalidas}`)
    }

    return {
      areas: areasSnapshot.size,
      tareas: tareasSnapshot.size,
      tareasValidas,
      tareasInvalidas
    }
  } catch (error) {
    console.error('❌ Error verificando:', error)
  }
}
