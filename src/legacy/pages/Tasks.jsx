import { useState } from 'react'
import { Button, Typography, Segmented, Space } from 'antd'
import { PlusOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import TaskList from '../features/TaskList/TaskList'
import TaskKanban from '../features/TaskKanban/TaskKanban'
import TaskForm from '../features/TaskForm/TaskForm'
import { useTaskList } from '../features/TaskList/useTaskList'
import { useTaskForm } from '../features/TaskForm/useTaskForm'
import { actualizarTarea } from '../services/tasks'

const { Title, Text } = Typography

export default function TasksPage({ proyectoId }) {
  const { tareas, loading, recargar } = useTaskList()
  const { handleSubmit } = useTaskForm()
  
  const [viewMode, setViewMode] = useState('lista')
  const [showForm, setShowForm] = useState(false)
  const [editandoTarea, setEditandoTarea] = useState(null)

  const tareasFiltradas = proyectoId 
    ? tareas.filter(t => t.proyectoId === proyectoId)
    : tareas

  const handleEdit = (tarea) => {
    setEditandoTarea(tarea)
    setShowForm(true)
  }

  const handleNew = () => {
    setEditandoTarea(null)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditandoTarea(null)
  }

  const handleSubmitForm = async (values) => {
    if (editandoTarea) {
      await handleSubmit(editandoTarea.id, values)
    } else {
      await handleSubmit(null, values)
    }
    recargar()
  }

  return (
    <div style={{ padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Title level={1} style={{ margin: 0 }}>Tareas</Title>
          <Text>{tareasFiltradas.length} tareas</Text>
        </div>
        <Space>
          <Segmented 
            value={viewMode} 
            onChange={setViewMode}
            options={[
              { value: 'lista', icon: <BarsOutlined />, label: 'Lista' },
              { value: 'kanban', icon: <AppstoreOutlined />, label: 'Kanban' },
            ]} 
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
            Nueva Tarea
          </Button>
        </Space>
      </header>

      {viewMode === 'lista' ? (
        <TaskList 
          tareas={tareasFiltradas} 
          onEditTask={handleEdit} 
          onRecargar={recargar} 
        />
      ) : (
         <TaskKanban 
           tareas={tareasFiltradas}
           columnas={[
             { id: 'todo', label: 'POR HACER' },
             { id: 'in_progress', label: 'EN CURSO' },
             { id: 'in_review', label: 'EN REVISION' },
             { id: 'done', label: 'COMPLETADO' },
           ]}
           onMoverTarea={async (id, estado) => {
             await actualizarTarea(id, { estado })
           }}
           onTaskClick={handleEdit}
           recargar={recargar}
         />
      )}

      <TaskForm 
        visible={showForm} 
        tarea={editandoTarea} 
        onClose={handleClose} 
        onSubmit={handleSubmitForm}
      />
    </div>
  )
}