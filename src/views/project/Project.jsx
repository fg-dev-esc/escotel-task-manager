import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Typography, Segmented, Space } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import TaskList from './components/TaskList'
import TaskKanban from './components/TaskKanban'
import TaskForm from './components/TaskForm'
import TaskFormDrawer from './components/TaskFormDrawer'
import { useTaskList } from './components/useTaskList'
import { useAreas } from '../../hooks/useAreas.jsx'

const { Title, Text } = Typography

export default function Project() {
  const { id: areaId } = useParams()
  const navigate = useNavigate()
  const { areas } = useAreas()
  const {
    tareas,
    stats,
    cargarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
  } = useTaskList(areaId)

  const [viewMode, setViewMode] = useState('kanban')
  const [showForm, setShowForm] = useState(false)
  const [editandoTarea, setEditandoTarea] = useState(null)

  const area = areas.find(a => a.id === areaId)
  const areaDisplay = area ? area.nombre : areaId

  const handleEdit = tarea => {
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

  const handleSubmitForm = async values => {
    try {
      if (editandoTarea) {
        await actualizarTarea(editandoTarea.id, values)
      } else {
        await crearTarea(values)
      }
      handleClose()
    } catch (error) {
      console.error('Error guardando tarea:', error)
    }
  }

  const handleMoverTarea = async (tareaId, nuevoEstado) => {
    try {
      await actualizarTarea(tareaId, { estado: nuevoEstado })
    } catch (error) {
      console.error('Error moviendo tarea:', error)
    }
  }

  const handleEliminarTarea = async tareaId => {
    try {
      await eliminarTarea(tareaId)
    } catch (error) {
      console.error('Error eliminando tarea:', error)
    }
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
            <Title level={1} style={{ margin: 0 }}>
              {areaDisplay}
            </Title>
            <Text>
              {stats.activas} activas • {stats.completadas} completadas
              {stats.vencidas > 0 && ` • ${stats.vencidas} vencidas`}
            </Text>
          </div>
          <Space>
            <Segmented
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: 'lista', icon: <BarsOutlined /> },
                { value: 'kanban', icon: <AppstoreOutlined /> }
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
          onDeleteTask={handleEliminarTarea}
        />
      ) : (
        <TaskKanban
          tareas={tareas}
          columnas={[
            { id: 'todo', label: 'POR HACER' },
            { id: 'in_progress', label: 'EN CURSO' },
            { id: 'in_review', label: 'EN REVISION' },
            { id: 'done', label: 'COMPLETADO' }
          ]}
          onMoverTarea={handleMoverTarea}
          onTaskClick={handleEdit}
          onDeleteTask={handleEliminarTarea}
        />
      )}

      {/* Modal para CREAR */}
      {!editandoTarea && (
        <TaskForm
          visible={showForm}
          tarea={null}
          onClose={handleClose}
          onSubmit={handleSubmitForm}
        />
      )}

      {/* Drawer para EDITAR */}
      {editandoTarea && (
        <TaskFormDrawer
          open={showForm}
          tarea={editandoTarea}
          onClose={handleClose}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  )
}
