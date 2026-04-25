import { useState } from 'react'
import { Button, Row, Col, Typography, Modal, message, Empty, Skeleton } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAreas } from '../../hooks/useAreas.jsx'
import { getIconComponent } from '../../utils/icons'
import ProjectForm from '../components/projects/ProjectForm'

const { Title, Text } = Typography

export default function Projects() {
  const navigate = useNavigate()
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
        } catch {
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
    } catch {
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
    } catch {
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
    <div className="app-page">
      <header className="app-page-header">
        <div>
          <div className="app-kicker">Workspace</div>
          <Title level={1} className="app-title" style={{ margin: 0 }}>
            Áreas
          </Title>
        </div>

        <Button type="primary" onClick={handleNuevo} size="large" icon={<PlusOutlined />}>
          Nueva área
        </Button>
      </header>

      {loading ? (
        <div className="app-panel" style={{ padding: 24 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : areas.length === 0 ? (
        <div className="app-empty-shell" style={{ padding: '72px 24px', textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <div style={{ fontWeight: 650, marginBottom: 4 }}>No hay áreas todavía</div>
                <Text type="secondary">Crea la primera para empezar a distribuir proyectos y tareas.</Text>
              </div>
            }
          >
            <Button type="primary" onClick={handleNuevo} icon={<PlusOutlined />}>
              Crear primera área
            </Button>
          </Empty>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {areas.map(area => {
            const IconComponent = getIconComponent(area.icon)
            return (
              <Col key={area.id} xs={24} sm={12} xl={8} xxl={6}>
                <article
                  onClick={() => handleClick(area)}
                  className="app-panel"
                  style={{
                    padding: 20,
                    cursor: 'pointer',
                    minHeight: 184,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 14px 32px rgba(15, 23, 42, 0.08)'
                    e.currentTarget.style.borderColor = area.color
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--app-shadow-sm)'
                    e.currentTarget.style.borderColor = 'var(--app-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 18,
                        background: `linear-gradient(135deg, ${area.color}26, ${area.color}10)`,
                        border: `1px solid ${area.color}26`,
                        display: 'grid',
                        placeItems: 'center',
                        color: area.color,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent style={{ fontSize: 22 }} />
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={e => handleEdit(e, area)}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={e => handleDelete(e, area)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Title level={4} style={{ margin: 0, fontWeight: 650, letterSpacing: '-0.03em' }}>
                      {area.nombre}
                    </Title>
                    <ArrowRightOutlined style={{ color: 'var(--app-text-tertiary)', fontSize: 12 }} />
                  </div>

                  {area.descripcion ? (
                    <Text type="secondary" style={{ display: 'block', lineHeight: 1.6 }}>
                      {area.descripcion}
                    </Text>
                  ) : (
                    <Text type="secondary" style={{ display: 'block', lineHeight: 1.6 }}>
                      Sin descripción.
                    </Text>
                  )}
                </article>
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
