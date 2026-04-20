import { Modal, Form, Input, Select, theme, Space } from 'antd'
import { iconOptions } from '../../../utils/icons'
import { useEffect, useRef, useState } from 'react'

const colors = [
  '#FFE4E1', '#FF8A95', '#FF4757',
  '#FFD89B', '#FFA940', '#FF7A45',
  '#C1E1A6', '#7CB342', '#558B2F',
  '#B2DFDB', '#4DD0E1', '#00BCD4',
  '#C5CAE9', '#7986CB', '#3F51B5',
  '#E1BEE7', '#BA68C8', '#9C27B0'
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
      title={<span className="mono-label" style={{ opacity: 1, fontWeight: 700 }}>{project ? 'EDITAR PROYECTO' : 'CREAR PROYECTO'}</span>}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={480}
      okText={project ? 'Actualizar' : 'Crear'}
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
          label={<span className="mono-label">NOMBRE DEL PROYECTO</span>}
          name="name"
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <Input 
            variant="filled" 
            placeholder="ej. Hoja de Ruta Q2" 
            style={{ borderRadius: '2px', border: 'none' }}
          />
        </Form.Item>

        <Form.Item label={<span className="mono-label">DESCRIPCIÓN</span>} name="description" rules={[{ required: true, message: 'La descripción es requerida' }]}>
          <Input.TextArea 
            variant="filled" 
            rows={3} 
            placeholder="Contexto del proyecto..." 
            style={{ borderRadius: '2px', border: 'none' }}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
           <Form.Item label={<span className="mono-label">COLOR DE MARCA</span>} name="color" initialValue={colors[0]}>
            <Select
              variant="filled"
              style={{ borderRadius: '2px' }}
              optionLabelRender={(option) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', background: option.value, borderRadius: '2px', border: `2px solid ${token.colorBorder}` }} />
                  <span>{option.value}</span>
                </div>
              )}
            >
              {colors.map((color) => (
                <Select.Option key={color} value={color}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: color, borderRadius: '2px', border: `2px solid ${token.colorBorder}` }} />
                    <span>{color}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

           <Form.Item label={<span className="mono-label">ÍCONO</span>} name="icon" initialValue={iconOptions[0].value}>
            <Select 
              variant="filled" 
              style={{ borderRadius: '2px' }}
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
