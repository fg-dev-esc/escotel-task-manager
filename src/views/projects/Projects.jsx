import { useState } from 'react'
import { Button, Row, Col, Typography, theme, Modal, message } from 'antd'
import { FolderOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAreas } from '../../hooks/useAreas.jsx'
import { getIconComponent } from '../../utils/icons'
import ProjectForm from '../components/projects/ProjectForm'

const { Title, Text } = Typography

export default function Projects() {
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { areas, loading, crear, actualizar, eliminar } = useAreas()
  const [formVisible, setFormVisible] = useState(false)
  const [editingArea, setEditingArea] = useState(null)

  const handleNuevo = () => {
    setEditingArea(null)
    setFormVisible(true)
  }

  const handleEdit = (e, area) => {
    e.stopPropagation()
    setEditingArea(area)
    setFormVisible(true)
  }

  async function handleDelete(e, area) {
    e.stopPropagation()

    Modal.confirm({
      title: 'Eliminar',
      content: `¿Eliminar el área "${area.nombre}"? Se eliminarán todas sus tareas.`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await eliminar(area.id)
          message.success('Área eliminada')
        } catch (error) {
          message.error('Error eliminando el área')
        }
      }
    })
  }

  const handleClick = area => {
    navigate(`/${area.id}`)
  }

  const handleCrear = async values => {
    try {
      await crear({
        nombre: values.name,
        descripcion: values.description,
        color: values.color,
        icon: values.icon
      })
      message.success('Área creada')
    } catch (error) {
      message.error('Error creando el área')
    }
  }

  const handleActualizar = async values => {
    try {
      await actualizar(editingArea.id, {
        nombre: values.name,
        descripcion: values.description,
        color: values.color,
        icon: values.icon
      })
      message.success('Área actualizada')
    } catch (error) {
      message.error('Error actualizando el área')
    }
  }

  const handleFormSubmit = async values => {
    if (editingArea) {
      await handleActualizar(values)
    } else {
      await handleCrear(values)
    }
    setFormVisible(false)
    setEditingArea(null)
  }

  const formAreaData = editingArea
    ? {
        name: editingArea.nombre,
        description: editingArea.descripcion,
        color: editingArea.color,
        icon: editingArea.icon
      }
    : null

  return (
    <div style={{ padding: 24 }}>
      <header
        style={{
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          paddingBottom: 16
        }}
      >
        <div>
          <Title level={1} style={{ margin: 0 }}>
            Áreas
          </Title>
          <Text>{areas.length} áreas</Text>
        </div>
        <Button type="primary" onClick={handleNuevo}>
          Nueva Área
        </Button>
      </header>

      {areas.length === 0 ? (
        <div
          style={{
            padding: 120,
            textAlign: 'center',
            background: token.colorBgContainer,
            border: `1px dashed ${token.colorBorder}`,
            borderRadius: 4
          }}
        >
          <FolderOutlined
            style={{
              fontSize: 48,
              color: token.colorTextDescription,
              marginBottom: 24
            }}
          />
          <Title
            level={3}
            style={{ fontWeight: 400, color: token.colorTextDescription }}
          >
            No hay áreas
          </Title>
          <Button type="primary" onClick={handleNuevo} style={{ marginTop: 16 }}>
            Crear primera área
          </Button>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {areas.map(area => {
            const IconComponent = getIconComponent(area.icon)
            return (
              <Col key={area.id} xs={24} sm={12} lg={8}>
                <div
                  onClick={() => handleClick(area)}
                  style={{
                    padding: 24,
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = area.color
                    e.currentTarget.style.boxShadow = `0 2px 8px ${area.color}20`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = token.colorBorderSecondary
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={e => handleEdit(e, area)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 40,
                      color: token.colorTextSecondary
                    }}
                  />
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={e => handleDelete(e, area)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8
                    }}
                  />
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: area.color,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      fontSize: 24
                    }}
                  >
                    <IconComponent style={{ color: 'white' }} />
                  </div>
                  <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
                    {area.nombre}
                  </Title>
                  {area.descripcion && (
                    <Text
                      type="secondary"
                      style={{ fontSize: '12px' }}
                    >
                      {area.descripcion}
                    </Text>
                  )}
                </div>
              </Col>
            )
          })}
        </Row>
      )}

      <ProjectForm
        visible={formVisible}
        project={formAreaData}
        onClose={() => {
          setFormVisible(false)
          setEditingArea(null)
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
