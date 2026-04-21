import { Modal, Form, Input, Select, DatePicker, theme } from 'antd'
import { useEffect } from 'react'
import dayjs from 'dayjs'

export default function TaskForm({ visible, tarea, onClose, onSubmit }) {
  const [form] = Form.useForm()

  useEffect(() => {
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
  }, [tarea, form])

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
      title={tarea ? 'EDITAR TAREA' : 'NUEVA TAREA'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={500}
      okText={tarea ? 'Guardar' : 'Crear'}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="TITULO" name="titulo" rules={[{ required: true }]}>
          <Input placeholder="Que hay que hacer?" />
        </Form.Item>

        <Form.Item label="DESCRIPCION" name="descripcion">
          <Input.TextArea rows={3} placeholder="Detalles..." />
        </Form.Item>

        <Form.Item label="FECHA LIMITE" name="dueDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="PRIORIDAD" name="prioridad" initialValue="medium">
          <Select>
            <Select.Option value="critical">CRITICA</Select.Option>
            <Select.Option value="high">ALTA</Select.Option>
            <Select.Option value="medium">MEDIA</Select.Option>
            <Select.Option value="low">BAJA</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}