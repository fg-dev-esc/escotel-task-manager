import { Modal, Form, Input, Select, theme, Space, Typography } from 'antd'
import { iconOptions } from '../../../utils/icons'
import { useEffect, useRef, useState } from 'react'

const { Text } = Typography

const colors = [
  '#2F6BFF', '#5B8CFF', '#7A5CFA',
  '#14B8A6', '#10B981', '#22C55E',
  '#F59E0B', '#D97706', '#F97316',
  '#EC4899', '#DB2777', '#64748B',
  '#94A3B8', '#1E293B', '#8B5CF6',
  '#0EA5E9', '#06B6D4', '#475569'
]

export default function ProjectForm({ visible, project, onClose, onSubmit }) {
  const [form] = Form.useForm()
  const formRef = useRef(form)
  const [loading, setLoading] = useState(false)
  const { token } = theme.useToken()

  useEffect(() => {
    if (visible && project) {
      formRef.current.setFieldsValue({
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
      })
    } else if (visible) {
      formRef.current.resetFields()
    }
  }, [project, visible])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const colorHex = typeof values.color === 'string' ? values.color : values.color?.toHexString()
      await onSubmit({ ...values, color: colorHex || values.color })
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <Modal
      title={
        <div>
          <div className="app-kicker">Workspace</div>
          <Text style={{ fontSize: 18, fontWeight: 650, color: token.colorText }}>
            {project ? 'Editar área' : 'Crear área'}
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={540}
      okText={project ? 'Actualizar' : 'Crear'}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}`, paddingBottom: 18 },
        body: { paddingTop: 24 },
        footer: { borderTop: `1px solid ${token.colorBorderSecondary}` },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label={<span className="app-kicker">Nombre del área</span>}
          name="name"
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <Input placeholder="ej. Hoja de Ruta Q2" size="large" />
        </Form.Item>

        <Form.Item label={<span className="app-kicker">Descripción</span>} name="description" rules={[{ required: true, message: 'La descripción es requerida' }]}> 
          <Input.TextArea rows={4} placeholder="Contexto del proyecto..." />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
           <Form.Item label={<span className="app-kicker">Color de marca</span>} name="color" initialValue={colors[0]}>
            <Select
              size="large"
              optionLabelRender={(option) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 16, height: 16, background: option.value, borderRadius: 6, border: `1px solid ${token.colorBorder}` }} />
                  <span>{option.value}</span>
                </div>
              )}
            >
              {colors.map((color) => (
                <Select.Option key={color} value={color}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 16, height: 16, background: color, borderRadius: 6, border: `1px solid ${token.colorBorder}` }} />
                    <span>{color}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

           <Form.Item label={<span className="app-kicker">Ícono</span>} name="icon" initialValue={iconOptions[0].value}>
            <Select 
              size="large"
              optionLabelRender={(option) => {
                const iconOpt = iconOptions.find(opt => opt.value === option.value)
                if (iconOpt) {
                  const IconComponent = iconOpt.icon
                  return (
                    <Space size={8}>
                      <IconComponent />
                      <span>{iconOpt.label}</span>
                    </Space>
                  )
                }
                return option.value
              }}
            >
              {iconOptions.map((opt) => {
                const IconComponent = opt.icon
                return (
                  <Select.Option key={opt.value} value={opt.value}>
                    <Space size={8}>
                      <IconComponent />
                      <span>{opt.label}</span>
                    </Space>
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
