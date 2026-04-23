import { Layout, Menu, Button, theme, Typography } from 'antd'
import { DashboardOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAreas } from '../../../hooks/useAreas.jsx'
import { getIconComponent } from '../../../utils/icons'
import logoEscotel from '../../../assets/logo.png'
import { useAuth } from '../../../context/AuthContext'

const { Sider } = Layout
const { Text } = Typography

export default function AppSider() {
  const navigate = useNavigate()
  const location = useLocation()
  const { areas } = useAreas()
  const { token } = theme.useToken()
  const { nombre, logout } = useAuth()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      type: 'divider',
      style: { margin: '16px 0', opacity: 0.5 },
    },
    ...areas.map((area) => {
      const IconComponent = getIconComponent(area.icon)
      return {
        key: `/${area.id}`,
        icon: <IconComponent style={{ color: area.color }} />,
        label: area.nombre,
        onClick: () => navigate(`/${area.id}`),
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
          padding: '0 8px',
          marginBottom: '80px'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          padding: '16px',
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <UserOutlined style={{ color: token.colorTextSecondary }} />
          <Text
            ellipsis
            style={{ 
              fontSize: 13, 
              fontWeight: 500, 
              color: token.colorText,
              maxWidth: 180,
              textAlign: 'center'
            }}
          >
            {nombre || 'Usuario'}
          </Text>
        </div>
        <Button 
          block 
          size="small"
          icon={<LogoutOutlined />} 
          onClick={() => { logout(); navigate('/login', { replace: true }) }}
        >
          Cerrar sesión
        </Button>
      </div>
    </Sider>
  )
}
