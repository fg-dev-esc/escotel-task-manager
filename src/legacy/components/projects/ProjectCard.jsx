import { Card, Progress, Dropdown, message, Modal, theme } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { useTasks } from '../../hooks/useTasks'
import { useProjects } from '../../hooks/useProjects'

export default function ProjectCard({ project, onEditClick, onDeleteClick }) {
  const { filteredTasks } = useTasks()
  const { dispatch } = useProjects()
  const { token } = theme.useToken()

  const projectTasks = filteredTasks.filter((t) => t.projectId === project.id)
  const completedTasks = projectTasks.filter((t) => t.status === 'done').length
  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0

  const items = [
    {
      key: 'edit',
      label: 'Editar',
      onClick: () => onEditClick(project),
    },
    {
      key: 'delete',
      label: 'Eliminar',
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: 'Eliminar proyecto',
          content: 'Esta acción no se puede deshacer',
          okText: 'Eliminar',
          okButtonProps: { danger: true },
          onOk() {
            dispatch({ type: 'DELETE_PROJECT', payload: project.id })
            message.success('Proyecto eliminado')
          },
        })
      },
    },
  ]

  return (
    <Card
      hoverable
      style={{ 
        marginBottom: '24px',
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        borderRadius: token.borderRadius,
      }}
      extra={
        <Dropdown menu={{ items }} trigger={['click']}>
          <MoreOutlined style={{ color: token.colorTextDescription, cursor: 'pointer' }} />
        </Dropdown>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: project.color || token.colorBorderSecondary,
            borderRadius: '4px',
            marginRight: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            flexShrink: 0
          }}
        >
          {project.icon}
        </div>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 700, 
            color: token.colorText,
            letterSpacing: '-0.02em'
          }}>
            {project.name}
          </h3>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: token.colorTextSecondary, 
            fontSize: '13px' 
          }}>
            {project.description}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="mono-label">Progreso</span>
          <span className="mono-label" style={{ opacity: 1 }}>
            {completedTasks}/{projectTasks.length} Tareas
          </span>
        </div>
        <Progress 
          percent={progress} 
          size={[null, 6]} 
          showInfo={false}
          strokeColor={token.colorPrimary}
          trailColor={token.colorBorderSecondary}
        />
      </div>
    </Card>
  )
}
