import { Layout, Menu, theme } from 'antd'
import { FolderOutlined, DashboardOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProjects } from '../../../hooks/useProjects.jsx'
import { getIconComponent } from '../../../utils/icons'
import logoEscotel from '../../../assets/logo.png'

const { Sider } = Layout

export default function AppSider() {
  const navigate = useNavigate()
  const location = useLocation()
  const { projects } = useProjects()
  const { token } = theme.useToken()

  const menuItems = [
    {
      key: 'projects',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      type: 'divider',
      style: { margin: '16px 0', opacity: 0.5 },
    },
    ...projects.map((project) => {
      const IconComponent = getIconComponent(project.icon)
      return {
        key: `/${project.id}`,
        icon: <IconComponent style={{ color: project.color }} />,
        label: project.name,
        onClick: () => navigate(`/${project.id}`),
      }
    }),
  ]

  const currentPath = location.pathname

  return (
    <Sider
      width={250}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'auto',
        height: '100vh',
        zIndex: 1001,
      }}
    >
      <div style={{ 
        padding: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '12px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        marginBottom: '16px'
      }}>
        <img src={logoEscotel} alt="Escotel" style={{ height: '32px', width: 'auto' }} />
      </div>

      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={[currentPath]}
        style={{ 
          background: 'transparent', 
          border: 'none',
          padding: '0 8px'
        }}
      />
    </Sider>
  )
}
