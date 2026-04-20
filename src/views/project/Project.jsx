import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Typography, Segmented, Space } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import TaskList from './components/TaskList'
import TaskKanban from './components/TaskKanban'
import TaskForm from './components/TaskForm'
import { useTaskList } from './components/useTaskList'
import { useTaskForm } from './components/useTaskForm'
import { useProjects } from '../../hooks/useProjects.jsx'
import { actualizarTarea } from '../../services/tasks'

const { Title, Text } = Typography

export default function Project() {
  const { id: nombreProyecto } = useParams()
  const navigate = useNavigate()
  const { projects } = useProjects()
  const { tareas, recargar } = useTaskList(nombreProyecto)
  const { handleSubmit } = useTaskForm(nombreProyecto)
  
  const [viewMode, setViewMode] = useState('lista')
  const [showForm, setShowForm] = useState(false)
  const [editandoTarea, setEditandoTarea] = useState(null)

  const proyecto = projects.find(p => p.id === nombreProyecto)
  const nombreProyectoDisplay = proyecto ? proyecto.name : nombreProyecto

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
      <header style={{ marginBottom: 24 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Title level={1} style={{ margin: 0 }}>{nombreProyectoDisplay}</Title>
            <Text>{tareas.length} tareas</Text>
          </div>
          <Space>
            <Segmented 
              value={viewMode} 
              onChange={setViewMode}
              options={[
                { value: 'lista', icon: <BarsOutlined /> },
                { value: 'kanban', icon: <AppstoreOutlined /> },
              ]} 
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
              Nueva Tarea
            </Button>
          </Space>
        </div>
      </header>

      {viewMode === 'lista' ? (
        <TaskList 
          tareas={tareas} 
          onEditTask={handleEdit} 
          onRecargar={recargar} 
        />
      ) : (
         <TaskKanban 
           tareas={tareas}
           columnas={[
             { id: 'todo', label: 'POR HACER' },
             { id: 'in_progress', label: 'EN CURSO' },
             { id: 'in_review', label: 'EN REVISION' },
             { id: 'done', label: 'COMPLETADO' },
           ]}
           onMoverTarea={async (tareaId, estado) => {
             await actualizarTarea(nombreProyecto, tareaId, { estado })
             recargar()
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