import { Layout, Menu, Button, theme, Typography, Avatar, Tooltip } from 'antd'
import { DashboardOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAreas } from '../../../hooks/useAreas.jsx'
import { getIconComponent } from '../../../utils/icons'
import { getNombre, clearToken } from '../../../utils/auth'
import logoEscotel from '../../../assets/logo.png'

const { Sider } = Layout
const { Text } = Typography

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'U'
}

export default function AppSider({ collapsed, onCollapse }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { areas } = useAreas()
  const { token } = theme.useToken()
  const nombre = getNombre()

  const handleLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined style={{ color: token.colorPrimary }} />,
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
      width={280}
      collapsedWidth={88}
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      onCollapse={onCollapse}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
      }}
    >
      <div
        style={{
          padding: collapsed ? '12px 12px 14px' : '18px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'center',
          flexDirection: collapsed ? 'column' : 'row',
          gap: collapsed ? 8 : 0,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: collapsed ? 48 : 140,
            height: collapsed ? 48 : 40,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            marginRight: collapsed ? 0 : 28,
            marginBottom: collapsed ? 0 : 0,
          }}
        >
          <img
            src={collapsed ? '/favicon.png' : logoEscotel}
            alt="Escotel"
            style={{
              width: collapsed ? 32 : 'auto',
              height: collapsed ? 32 : 28,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        <Tooltip title={collapsed ? 'Expandir' : 'Colapsar'}>
          <Button
            type="text"
            size="small"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{
              flexShrink: 0,
              marginLeft: collapsed ? 0 : 8,
            }}
          />
        </Tooltip>
      </div>

      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={[currentPath]}
        inlineCollapsed={collapsed}
        theme="light"
        style={{ 
          background: 'transparent', 
          border: 'none',
          padding: '12px 12px 80px',
          flex: 1,
          overflowY: 'auto',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 16px 20px',
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
          <Avatar
            size={collapsed ? 42 : 44}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #CA2228, #E24A50)',
              color: '#FFFFFF',
              boxShadow: '0 10px 18px rgba(202, 34, 40, 0.18)',
            }}
          />

          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <Text ellipsis style={{ display: 'block', fontSize: 13, fontWeight: 650, color: token.colorText }}>
                {nombre || 'Usuario'}
              </Text>
              <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                Sesión activa
              </Text>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
            title="Cerrar sesión"
          >
            {!collapsed && 'Cerrar sesión'}
          </Button>
        </div>
      </div>
    </Sider>
  )
}
