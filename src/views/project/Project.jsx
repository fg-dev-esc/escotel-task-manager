import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Typography, Segmented, Space, Empty, Skeleton, Alert } from 'antd'
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
    loading,
    error,
    crearTarea,
    actualizarTarea,
    eliminarTarea
  } = useTaskList(areaId)

  const [viewMode, setViewMode] = useState('kanban')
  const [showForm, setShowForm] = useState(false)
  const [editandoTarea, setEditandoTarea] = useState(null)

  const area = areas.find(a => a.id === areaId)
  const areaDisplay = area ? area.nombre : areaId
  const areaColor = area?.color || '#2F6BFF'

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
    <div className="app-page">
      <header className="app-page-header" style={{ alignItems: 'center' }}>
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ marginBottom: 14 }}
          >
            Volver
          </Button>
          <div className="app-kicker">Project workspace</div>
          {loading ? (
            <Skeleton.Input active size="large" style={{ width: 200, height: 38, marginTop: 4 }} />
          ) : (
            <Title level={1} className="app-title" style={{ margin: 0 }}>
              {areaDisplay}
            </Title>
          )}
{loading ? (
            <Skeleton.Input active size="small" style={{ width: 160, height: 16, marginTop: 8 }} />
          ) : (
            <div>{/* 
          <Text className="app-subtitle" style={{ display: 'block' }}>
            {stats.activas} activas · {stats.completadas} completadas{stats.vencidas > 0 ? ` · ${stats.vencidas} vencidas` : ''}
          </Text>
        */}</div>
          )}
        </div>

        <Space size={12} wrap>
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'lista', icon: <BarsOutlined /> },
              { value: 'kanban', icon: <AppstoreOutlined /> }
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNew} size="large">
            Nueva tarea
          </Button>
        </Space>
      </header>

      <div className="app-surface-row" style={{ marginBottom: 24 }}>
        {loading ? (
          <>
            <div className="app-stat">
              <Skeleton.Input active size="small" style={{ width: 60, height: 12, marginBottom: 8 }} />
              <Skeleton.Input active size="large" style={{ width: 40, height: 32 }} />
              <Skeleton.Input active size="small" style={{ width: 120, height: 12, marginTop: 8 }} />
            </div>
            <div className="app-stat">
              <Skeleton.Input active size="small" style={{ width: 80, height: 12, marginBottom: 8 }} />
              <Skeleton.Input active size="large" style={{ width: 40, height: 32 }} />
              <Skeleton.Input active size="small" style={{ width: 140, height: 12, marginTop: 8 }} />
            </div>
            <div className="app-stat">
              <Skeleton.Input active size="small" style={{ width: 60, height: 12, marginBottom: 8 }} />
              <Skeleton.Input active size="large" style={{ width: 40, height: 32 }} />
              <Skeleton.Input active size="small" style={{ width: 180, height: 12, marginTop: 8 }} />
            </div>
          </>
        ) : (
          <>
            <div className="app-stat">
              <div className="app-stat-label">Activas</div>
              <div className="app-stat-value">{stats.activas}</div>
              <div className="app-stat-meta">Tareas aún en progreso.</div>
            </div>
            <div className="app-stat">
              <div className="app-stat-label">Completadas</div>
              <div className="app-stat-value">{stats.completadas}</div>
              <div className="app-stat-meta">Trabajo finalizado y cerrado.</div>
            </div>
            <div className="app-stat">
              <div className="app-stat-label">Vencidas</div>
              <div className="app-stat-value">{stats.vencidas}</div>
              <div className="app-stat-meta">Atención operativa requerida.</div>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="app-panel" style={{ padding: 24 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : error ? (
        <Alert type="error" showIcon message="No se pudieron cargar las tareas" description={error} />
      ) : tareas.length === 0 ? (
        <div className="app-empty-shell" style={{ padding: '72px 24px', textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <div style={{ fontWeight: 650, marginBottom: 4 }}>No hay tareas todavía</div>
                <Text type="secondary">Crea la primera para empezar a distribuir el trabajo.</Text>
              </div>
            }
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
              Crear primera tarea
            </Button>
          </Empty>
        </div>
      ) : viewMode === 'lista' ? (
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
            { id: 'in_review', label: 'EN REVISIÓN' },
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
