import { Modal, Form, Input, Select, DatePicker, Button, theme, Typography } from 'antd'
import { useTasks } from '../../hooks/useTasks'
import { useProjects } from '../../hooks/useProjects'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'

const { Text } = Typography

export default function TaskForm({ visible, task, onClose }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { tasks, dispatch } = useTasks()
  const { projects } = useProjects()
  const { token } = theme.useToken()

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        projectId: task.projectId,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        status: task.status,
        tags: task.tags,
      })
    } else {
      form.resetFields()
    }
  }, [task, form])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (task) {
        dispatch({
          type: 'UPDATE_TASK',
          payload: {
            ...task,
            title: values.title,
            description: values.description,
            priority: values.priority,
            projectId: values.projectId,
            dueDate: values.dueDate?.toISOString() || null,
            status: values.status,
            tags: values.tags || [],
            updatedAt: dayjs().toISOString(),
          },
        })
        message.success('Task updated')
      } else {
        const newTask = {
          id: uuidv4(),
          title: values.title,
          description: values.description,
          priority: values.priority,
          projectId: values.projectId,
          dueDate: values.dueDate?.toISOString() || null,
          status: values.status,
          tags: values.tags || [],
          subtasks: [],
          order: tasks.length,
          createdAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
        }
        dispatch({ type: 'ADD_TASK', payload: newTask })
        message.success('Task created')
      }
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={<span className="mono-label" style={{ opacity: 1, fontWeight: 700 }}>{task ? 'EDITAR TAREA' : 'NUEVA TAREA'}</span>}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
      okText={task ? 'Guardar Cambios' : 'Crear Tarea'}
      okButtonProps={{ style: { borderRadius: '2px' } }}
      cancelButtonProps={{ style: { borderRadius: '2px' } }}
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}`, paddingBottom: '16px' },
        body: { paddingTop: '24px' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label={<span className="mono-label">TÍTULO DE TAREA</span>}
          name="title"
          rules={[{ required: true, message: 'El título es requerido' }]}
        >
          <Input 
            variant="filled" 
            placeholder="¿Qué hay que hacer?" 
            style={{ borderRadius: '2px', border: 'none' }}
          />
        </Form.Item>

        <Form.Item label={<span className="mono-label">DESCRIPCIÓN</span>} name="description">
          <Input.TextArea 
            variant="filled" 
            rows={3} 
            placeholder="Detalles opcionales..." 
            style={{ borderRadius: '2px', border: 'none' }}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Form.Item label={<span className="mono-label">PRIORIDAD</span>} name="priority" initialValue="medium">
            <Select variant="filled" style={{ borderRadius: '2px' }}>
              <Select.Option value="critical">CRÍTICA</Select.Option>
              <Select.Option value="high">ALTA</Select.Option>
              <Select.Option value="medium">MEDIA</Select.Option>
              <Select.Option value="low">BAJA</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={<span className="mono-label">ESTADO</span>} name="status" initialValue="todo">
            <Select variant="filled" style={{ borderRadius: '2px' }}>
              <Select.Option value="todo">POR HACER</Select.Option>
              <Select.Option value="in_progress">EN CURSO</Select.Option>
              <Select.Option value="in_review">EN REVISIÓN</Select.Option>
              <Select.Option value="done">COMPLETADO</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Form.Item label={<span className="mono-label">PROYECTO</span>} name="projectId">
            <Select variant="filled" placeholder="Seleccionar proyecto" style={{ borderRadius: '2px' }}>
              {projects.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={<span className="mono-label">FECHA LÍMITE</span>} name="dueDate">
            <DatePicker variant="filled" style={{ width: '100%', borderRadius: '2px' }} placeholder="Seleccionar fecha" />
          </Form.Item>
        </div>

        <Form.Item label={<span className="mono-label">ETIQUETAS</span>} name="tags">
          <Select
            mode="tags"
            variant="filled"
            placeholder="Añadir etiquetas..."
            tokenSeparators={[',']}
            style={{ borderRadius: '2px' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
