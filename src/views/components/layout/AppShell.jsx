import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import AppSider from './AppSider'

const { Content } = Layout

export default function AppShell() {
  const { token } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <AppSider collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Content
          style={{
            padding: 'clamp(16px, 2.5vw, 32px)',
            minHeight: '100vh',
            background: 'transparent',
          }}
        >
          <div className="app-page-shell">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
