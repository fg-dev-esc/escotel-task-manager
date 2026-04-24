import { Modal, Form, Input, Select, DatePicker, theme, Typography } from 'antd'
import { useEffect } from 'react'
import dayjs from 'dayjs'

const { Text } = Typography

export default function TaskForm({ visible, tarea, onClose, onSubmit }) {
  const [form] = Form.useForm()
  const { token } = theme.useToken()

  useEffect(() => {
    if (!visible) return

    if (tarea) {
      form.setFieldsValue({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        prioridad: tarea.prioridad,
        dueDate: tarea.dueDate ? dayjs(tarea.dueDate) : null,
      })
    } else {
      form.resetFields()
    }
  }, [tarea, form, visible])

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      estado: 'todo',
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    }
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal
      title={
        <div>
          <div className="app-kicker">Task editor</div>
          <Text style={{ fontSize: 18, fontWeight: 650, color: token.colorText }}>
            {tarea ? 'Editar tarea' : 'Nueva tarea'}
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={560}
      okText={tarea ? 'Guardar' : 'Crear'}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}`, paddingBottom: 18 },
        body: { paddingTop: 24 },
        footer: { borderTop: `1px solid ${token.colorBorderSecondary}` },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item label={<span className="app-kicker">Título</span>} name="titulo" rules={[{ required: true }]}>
          <Input placeholder="Qué hay que hacer?" size="large" />
        </Form.Item>

        <Form.Item label={<span className="app-kicker">Descripción</span>} name="descripcion">
          <Input.TextArea rows={4} placeholder="Detalles..." />
        </Form.Item>

        <Form.Item label={<span className="app-kicker">Fecha límite</span>} name="dueDate">
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item label={<span className="app-kicker">Prioridad</span>} name="prioridad" initialValue="medium">
          <Select size="large">
            <Select.Option value="critical">Crítica</Select.Option>
            <Select.Option value="high">Alta</Select.Option>
            <Select.Option value="medium">Media</Select.Option>
            <Select.Option value="low">Baja</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
