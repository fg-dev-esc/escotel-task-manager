import { Drawer, Form, Input, Select, DatePicker, Button, Space, Typography, Divider, theme } from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ComentariosSection from './ComentariosSection'
import { useComentarios } from '../../../hooks/useComentarios'
import { getNombre } from '../../../utils/auth'

const { Text } = Typography

export default function TaskFormDrawer({ open, tarea, onClose, onSubmit }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const { token } = theme.useToken()
  const nombre = getNombre()

  const {
    comentarios,
    loading: loadingComentarios,
    cargarComentarios,
    agregarComentario,
    actualizarComentario,
    eliminarComentario
  } = useComentarios(tarea?.id)

  useEffect(() => {
    if (!open) return

    if (tarea) {
      form.setFieldsValue({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        prioridad: tarea.prioridad,
        estado: tarea.estado,
        dueDate: tarea.dueDate ? dayjs(tarea.dueDate) : null,
      })
    } else {
      form.resetFields()
    }
  }, [tarea, form, open])

  useEffect(() => {
    if (open && tarea?.id) {
      cargarComentarios()
    }
  }, [open, tarea?.id, cargarComentarios])

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      const data = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      }
      await onSubmit(data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      title={
        <div>
          <div className="app-kicker">Task editor</div>
          <Text style={{ fontSize: 18, fontWeight: 650, color: token.colorText }}>Editar tarea</Text>
        </div>
      }
      open={open}
      onClose={onClose}
      placement="right"
      width={640}
      destroyOnClose
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose} size="large" disabled={saving}>Cancelar</Button>
          <Button type="primary" onClick={() => form.submit()} size="large" loading={saving}>
            Guardar
          </Button>
        </Space>
      }
      styles={{
        header: { borderBottom: `1px solid var(--app-border)` },
        body: { paddingTop: 24 },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item label={<span className="app-kicker">Título</span>} name="titulo" rules={[{ required: true }]}>
          <Input placeholder="Qué hay que hacer?" size="large" />
        </Form.Item>

        <Form.Item label={<span className="app-kicker">Estado</span>} name="estado">
          <Select size="large">
            <Select.Option value="todo">Por hacer</Select.Option>
            <Select.Option value="in_progress">En curso</Select.Option>
            <Select.Option value="in_review">En revisión</Select.Option>
            <Select.Option value="done">Completado</Select.Option>
          </Select>
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

        <Divider style={{ margin: '28px 0' }} />

        <ComentariosSection
          tareaId={tarea?.id}
          comentarios={comentarios}
          onAgregar={agregarComentario}
          onActualizar={actualizarComentario}
          onEliminar={eliminarComentario}
          loading={loadingComentarios}
          autor={nombre}
        />
      </Form>
    </Drawer>
  )
}
