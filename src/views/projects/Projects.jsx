import { useState, useEffect } from 'react'
import { Button, Row, Col, Typography, theme, Modal, message } from 'antd'
import { FolderOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects.jsx'
import { getIconComponent } from '../../utils/icons'
import { crearProyecto, actualizarProyecto, eliminarProyecto } from '../../services/projects'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import ProjectForm from '../components/projects/ProjectForm'
import { obtenerConteoTareas } from '../../services/tasks'

const { Title, Text } = Typography

export default function Projects() {
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { projects, loading, recargar } = useProjects()
  const [formVisible, setFormVisible] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectStats, setProjectStats] = useState({})

  useEffect(() => {
    const loadStats = async () => {
      const stats = {}
      for (const p of projects) {
        stats[p.id] = await obtenerConteoTareas(p.id)
      }
      setProjectStats(stats)
    }
    if (projects.length > 0) loadStats()
  }, [projects])

  const handleNuevo = () => {
    setEditingProject(null)
    setFormVisible(true)
  }

  const handleEdit = (e, proyecto) => {
    e.stopPropagation()
    setEditingProject(proyecto)
    setFormVisible(true)
  }

  async function handleDelete(e, proyecto) {
    e.stopPropagation()
    
    Modal.confirm({
      title: 'Eliminar',
      content: `¿Eliminar ${proyecto.name}?`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      onOk: async () => {
        await eliminarProyecto(proyecto.id)
        await recargar()
        message.success('Proyecto eliminado')
      },
    })
  }

  const handleClick = (proyecto) => {
    navigate(`/${proyecto.id}`)
  }

  const handleCrear = async (values) => {
    const newProject = {
      id: uuidv4(),
      name: values.name,
      description: values.description,
      color: values.color,
      icon: values.icon,
      createdAt: dayjs().toISOString(),
    }
    await crearProyecto(newProject)
    await recargar()
    message.success('Proyecto creado')
  }

  const handleActualizar = async (values) => {
    await actualizarProyecto(editingProject.id, {
      ...editingProject,
      name: values.name,
      description: values.description,
      color: values.color,
      icon: values.icon,
    })
    await recargar()
    message.success('Proyecto actualizado')
  }

  const handleFormSubmit = async (values) => {
    if (editingProject) {
      await handleActualizar(values)
    } else {
      await handleCrear(values)
    }
    setFormVisible(false)
    setEditingProject(null)
  }

  return (
    <div style={{ padding: 24 }}>
      <header style={{ 
        marginBottom: 32, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        paddingBottom: 16
      }}>
        <div>
          <Title level={1} style={{ margin: 0 }}>Proyectos</Title>
          <Text>{projects.length} proyectos</Text>
        </div>
        <Button type="primary" onClick={handleNuevo}>
          Nuevo Proyecto
        </Button>
      </header>

      {projects.length === 0 ? (
        <div style={{ 
          padding: 120, 
          textAlign: 'center',
          background: token.colorBgContainer,
          border: `1px dashed ${token.colorBorder}`,
          borderRadius: 4
        }}>
          <FolderOutlined style={{ fontSize: 48, color: token.colorTextDescription, marginBottom: 24 }} />
          <Title level={3} style={{ fontWeight: 400, color: token.colorTextDescription }}>No hay proyectos</Title>
          <Button type="primary" onClick={handleNuevo} style={{ marginTop: 16 }}>
            Crear primer proyecto
          </Button>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {projects.map((proyecto) => {
            const IconComponent = getIconComponent(proyecto.icon)
            return (
              <Col key={proyecto.id} xs={24} sm={12} lg={8}>
               <div 
                 onClick={() => handleClick(proyecto)}
                 style={{ 
                   padding: 24, 
                   background: token.colorBgContainer,
                   border: `1px solid ${token.colorBorderSecondary}`,
                   borderRadius: 4,
                   cursor: 'pointer',
                   transition: 'all 0.3s ease',
                   position: 'relative'
                 }}
onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = proyecto.color
                    e.currentTarget.style.boxShadow = `0 2px 8px ${proyecto.color}20`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = token.colorBorderSecondary
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => handleEdit(e, proyecto)}
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
                    onClick={(e) => handleDelete(e, proyecto)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  />
                  <div style={{
                   width: 48, 
                   height: 48, 
                   background: proyecto.color, 
                   borderRadius: 4, 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   marginBottom: 12,
                   fontSize: 24
                 }}>
                   <IconComponent style={{ color: 'white' }} />
                 </div>
<Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>{proyecto.name}</Title>
                  {proyecto.description && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>{proyecto.description}</Text>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
                      <span style={{ fontWeight: 600 }}>{projectStats[proyecto.id]?.todo || 0}</span> por hacer
                    </Text>
                    <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
                      <span style={{ fontWeight: 600, color: token.colorInfo }}>{projectStats[proyecto.id]?.in_progress || 0}</span> en curso
                    </Text>
                    <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
                      <span style={{ fontWeight: 600, color: token.colorWarning }}>{projectStats[proyecto.id]?.in_review || 0}</span> en revisión
                    </Text>
                    <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
                      <span style={{ fontWeight: 600, color: token.colorSuccess }}>{projectStats[proyecto.id]?.done || 0}</span> completado
                    </Text>
                    <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
                      <span style={{ fontWeight: 600, color: (projectStats[proyecto.id]?.vencidas || 0) > 0 ? token.colorError : 'inherit' }}>{projectStats[proyecto.id]?.vencidas || 0}</span> vencidas
                    </Text>
                  </div>
                </div>
             </Col>
           )
         })}
        </Row>
      )}

      <ProjectForm visible={formVisible} project={editingProject} onClose={() => { setFormVisible(false); setEditingProject(null); }} onSubmit={handleFormSubmit} />
    </div>
  )
}
