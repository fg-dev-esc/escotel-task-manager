import { Drawer, Form, Input, Select, DatePicker, Button, Divider, Checkbox, Space, Modal, message, theme, Typography } from 'antd'
import { DeleteOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'
import { useTasks } from '../../hooks/useTasks'
import { useProjects } from '../../hooks/useProjects'
import { useUI } from '../../hooks/useUI'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'

const { Title, Text } = Typography

export default function TaskDrawer({ taskId, visible, onClose }) {
  const [form] = Form.useForm()
  const { tasks, dispatch } = useTasks()
  const { projects } = useProjects()
  const { token } = theme.useToken()
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const task = tasks.find((t) => t.id === taskId)

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        projectId: task.projectId,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        tags: task.tags,
      })
    }
  }, [task, form])

  if (!task) return null

  const handleFieldChange = (field, value) => {
    const updatedTask = { ...task, [field]: value, updatedAt: dayjs().toISOString() }
    if (field === 'dueDate') {
      updatedTask.dueDate = value ? value.toISOString() : null
    }
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
  }

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const updatedTask = {
        ...task,
        subtasks: [...task.subtasks, { id: uuidv4(), title: newSubtaskTitle, done: false }],
        updatedAt: dayjs().toISOString(),
      }
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
      setNewSubtaskTitle('')
      message.success('Subtarea añadida')
    }
  }

  const handleDeleteTask = () => {
    Modal.confirm({
      title: 'Eliminar tarea',
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk() {
        dispatch({ type: 'DELETE_TASK', payload: task.id })
        message.success('Tarea eliminada')
        onClose()
      },
    })
  }

  return (
    <Drawer
      title={<span className="mono-label" style={{ opacity: 1, fontWeight: 700 }}>DETALLES DE TAREA</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      extra={
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={handleDeleteTask}
          style={{ fontSize: '12px' }}
        >
          <span className="mono-label" style={{ color: 'inherit', opacity: 1 }}>ELIMINAR</span>
        </Button>
      }
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}` },
        body: { padding: '32px' }
      }}
    >
      <Form layout="vertical" autoComplete="off">
        <Form.Item label={<span className="mono-label">TITLE</span>}>
          <Input
            variant="borderless"
            value={task.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            style={{ 
              fontSize: '24px', 
              fontWeight: 600, 
              padding: 0, 
              letterSpacing: '-0.02em',
              color: token.colorText 
            }}
          />
        </Form.Item>

        <Form.Item label={<span className="mono-label">DESCRIPTION</span>}>
          <Input.TextArea
            variant="borderless"
            rows={4}
            value={task.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Add a detailed description..."
            style={{ padding: 0, fontSize: '15px' }}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>STATUS</Text>
            <Select
              variant="borderless"
              value={task.status}
              onChange={(value) => handleFieldChange('status', value)}
              style={{ width: '100%', padding: 0 }}
              popupClassName="glass-effect"
            >
              <Select.Option value="todo">TODO</Select.Option>
              <Select.Option value="in_progress">IN PROGRESS</Select.Option>
              <Select.Option value="in_review">REVIEW</Select.Option>
              <Select.Option value="done">DONE</Select.Option>
            </Select>
          </div>
          <div>
            <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>PRIORITY</Text>
            <Select
              variant="borderless"
              value={task.priority}
              onChange={(value) => handleFieldChange('priority', value)}
              style={{ width: '100%', padding: 0 }}
            >
              <Select.Option value="critical">CRITICAL</Select.Option>
              <Select.Option value="high">HIGH</Select.Option>
              <Select.Option value="medium">MEDIUM</Select.Option>
              <Select.Option value="low">LOW</Select.Option>
            </Select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>PROJECT</Text>
            <Select
              variant="borderless"
              value={task.projectId}
              onChange={(value) => handleFieldChange('projectId', value)}
              placeholder="Select project"
              style={{ width: '100%', padding: 0 }}
            >
              {projects.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>DUE DATE</Text>
            <DatePicker
              variant="borderless"
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={(value) => handleFieldChange('dueDate', value)}
              style={{ width: '100%', padding: 0 }}
            />
          </div>
        </div>

        <Form.Item label={<span className="mono-label">TAGS</span>}>
          <Select
            mode="tags"
            variant="borderless"
            value={task.tags}
            onChange={(value) => handleFieldChange('tags', value)}
            placeholder="Add tags..."
            tokenSeparators={[',']}
            style={{ width: '100%', padding: 0 }}
          />
        </Form.Item>
      </Form>

      <div style={{ marginTop: '48px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Text className="mono-label" style={{ opacity: 1, fontWeight: 700 }}>
            SUBTASKS <span style={{ opacity: 0.5, fontWeight: 400 }}>({task.subtasks.filter((s) => s.done).length}/{task.subtasks.length})</span>
          </Text>
        </header>

        <div style={{ marginBottom: '24px' }}>
          {task.subtasks.map((subtask) => (
            <div key={subtask.id} style={{ 
              marginBottom: '12px', 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px',
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${token.colorBorderSecondary}`,
              background: subtask.done ? token.colorBorderSecondary : 'transparent'
            }}>
              <Checkbox
                checked={subtask.done}
                onChange={() =>
                  dispatch({
                    type: 'TOGGLE_SUBTASK',
                    payload: { taskId: task.id, subtaskId: subtask.id },
                  })
                }
              />
              <span style={{ 
                textDecoration: subtask.done ? 'line-through' : 'none',
                color: subtask.done ? token.colorTextDescription : token.colorText,
                fontSize: '14px',
                flex: 1
              }}>
                {subtask.title}
              </span>
            </div>
          ))}
        </div>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Add a subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onPressEnter={handleAddSubtask}
            variant="filled"
            style={{ border: 'none', borderRadius: '2px 0 0 2px' }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddSubtask}
            style={{ borderRadius: '0 2px 2px 0' }}
          />
        </Space.Compact>
      </div>
    </Drawer>
  )
}
