import { Layout, theme } from 'antd'

const { Header } = Layout

export default function AppHeader() {
  const { token } = theme.useToken()

  return (
    <Header
      style={{
        background: token.colorBgBase === '#000000' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        height: '0px',
        lineHeight: '0px',
      }}
    />
  )
}

