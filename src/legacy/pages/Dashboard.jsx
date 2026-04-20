import { useState } from 'react'
import { Row, Col, Typography, Segmented, theme, Space, Button } from 'antd'
import { AppstoreOutlined, BarsOutlined, PlusOutlined } from '@ant-design/icons'
import TaskKanban from '../components/tasks/TaskKanban'
import TaskList from '../components/tasks/TaskList'
import TaskForm from '../components/tasks/TaskForm'
import TaskDrawer from '../components/tasks/TaskDrawer'
import { useTasks } from '../hooks/useTasks'
import { useUI } from '../hooks/useUI'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

const { Title, Text } = Typography
dayjs.extend(isBetween)

export default function Dashboard() {
  const { filteredTasks } = useTasks()
  const { uiState, dispatch } = useUI()
  const { token } = theme.useToken()
  const [viewMode, setViewMode] = useState('kanban')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const stats = [
    { label: 'TOTAL TAREAS', value: filteredTasks.length },
    { label: 'COMPLETADAS HOY', value: filteredTasks.filter(t => t.status === 'done' && dayjs(t.updatedAt).isSame(dayjs(), 'day')).length },
    { label: 'VENCIDAS', value: filteredTasks.filter(t => t.dueDate && dayjs(t.dueDate).isBefore(dayjs(), 'day') && t.status !== 'done').length, color: token.colorError },
    { label: 'EN CURSO', value: filteredTasks.filter(t => t.status === 'in_progress').length },
  ]

  const handleTaskClick = (taskId) => {
    dispatch({ type: 'OPEN_DRAWER', payload: taskId })
  }

  const handleEditTask = (taskId) => {
    const task = filteredTasks.find((t) => t.id === taskId)
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  return (
    <div className="reveal active">
      <header style={{ marginBottom: '48px' }}>
        <Title level={1} style={{ 
          margin: 0, 
          fontSize: '48px', 
          fontWeight: 300, 
          letterSpacing: '-0.04em',
          color: token.colorText
        }}>
          Resumen <span style={{ color: token.colorTextDescription }}>— Tablero</span>
        </Title>
      </header>

      <Row gutter={[32, 32]} style={{ marginBottom: '64px' }}>
        {stats.map((stat, idx) => (
          <Col key={stat.label} xs={12} sm={6}>
            <div className={`reveal active delay-${idx + 1}00`} style={{ 
              borderTop: `1px solid ${token.colorBorderSecondary}`,
              paddingTop: '16px'
            }}>
              <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>
                {stat.label}
              </Text>
              <div style={{ 
                fontSize: '42px', 
                fontWeight: 200, 
                color: stat.color || token.colorText,
                lineHeight: 1
              }}>
                {stat.value}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        marginBottom: '24px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        paddingBottom: '16px'
      }}>
        <Title level={3} style={{ margin: 0, fontWeight: 600, fontSize: '20px' }}>Flujo de Trabajo</Title>
        <Space size="middle">
          <Segmented 
            value={viewMode} 
            onChange={setViewMode} 
            options={[
              { value: 'kanban', icon: <AppstoreOutlined /> },
              { value: 'lista', icon: <BarsOutlined /> }
            ]} 
            style={{ background: token.colorBgContainer }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddTask}
            style={{ borderRadius: '2px' }}
          >
            Crear Tarea
          </Button>
        </Space>
      </div>

      <div className="reveal active delay-300">
        {viewMode === 'kanban' ? (
          <TaskKanban
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onEditTask={handleEditTask}
          />
        )}
      </div>

      <TaskForm
        visible={showTaskForm}
        task={editingTask}
        onClose={handleCloseForm}
      />

      <TaskDrawer
        taskId={uiState.selectedTaskId}
        visible={uiState.drawerOpen}
        onClose={() => dispatch({ type: 'CLOSE_DRAWER' })}
      />
    </div>
  )
}
