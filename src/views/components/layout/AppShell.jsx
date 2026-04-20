import { Layout, ConfigProvider } from 'antd'
import { Outlet } from 'react-router-dom'
import AppSider from './AppSider'

const { Content } = Layout

export default function AppShell() {
  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <AppSider />
        <Layout style={{ marginLeft: '250px', background: '#FFFFFF' }}>
          <Content style={{ padding: '32px', overflow: 'auto', background: '#FFFFFF' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
