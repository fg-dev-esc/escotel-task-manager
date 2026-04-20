import { Tabs, Switch, Button, Space, Select, Modal, message, Typography, theme } from 'antd'
import { DownloadOutlined, DeleteOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons'
import { useUI } from '../hooks/useUI'
import { useTasks } from '../hooks/useTasks'
import { useProjects } from '../hooks/useProjects'
import dayjs from 'dayjs'
import { useRef } from 'react'

const { Title, Text } = Typography

export default function Settings() {
  const { uiState, dispatch } = useUI()
  const { tasks, dispatch: taskDispatch } = useTasks()
  const { projects, dispatch: projectDispatch } = useProjects()
  const { token } = theme.useToken()
  const fileInputRef = useRef(null)

  const handleToggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' })
  }

  const handleExport = () => {
    const data = {
      tasks,
      projects,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `etm-backup-${dayjs().format('YYYY-MM-DD-HHmmss')}.json`
    a.click()
    URL.revokeObjectURL(url)
    message.success('Data exported successfully')
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result)
        if (data.tasks && data.projects) {
          taskDispatch({ type: 'SET_TASKS', payload: data.tasks })
          message.success('Data imported successfully')
        } else {
          message.error('Invalid file format')
        }
      } catch (error) {
        message.error('Error importing data')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    Modal.confirm({
      title: 'Reset everything?',
      content: 'This will delete all your local data. This action cannot be undone.',
      okText: 'Reset',
      okButtonProps: { danger: true },
      onOk() {
        localStorage.clear()
        message.success('Data cleared')
        window.location.reload()
      },
    })
  }

  const items = [
    {
      key: 'appearance',
      label: <span className="mono-label" style={{ opacity: 1 }}>APPEARANCE</span>,
      children: (
        <div style={{ padding: '32px 0' }} className="reveal active">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: `1px solid ${token.colorBorderSecondary}`
          }}>
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Dark Mode</Title>
              <Text style={{ color: token.colorTextSecondary }}>Switch between light and pitch-black themes.</Text>
            </div>
            <Switch
              checked={uiState.theme === 'dark'}
              onChange={handleToggleTheme}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Interface Theme</Title>
              <Text style={{ color: token.colorTextSecondary }}>Select your preferred visual style.</Text>
            </div>
            <Select
              style={{ width: '160px' }}
              value={uiState.theme}
              onChange={(value) => dispatch({ type: 'SET_THEME', payload: value })}
              popupClassName="glass-effect"
            >
              <Select.Option value="light">Light Minimal</Select.Option>
              <Select.Option value="dark">Pitch Black</Select.Option>
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'data',
      label: <span className="mono-label" style={{ opacity: 1 }}>DATA & PRIVACY</span>,
      children: (
        <div style={{ padding: '32px 0' }} className="reveal active">
          <div style={{ marginBottom: '48px' }}>
            <Title level={4} style={{ marginBottom: '24px', fontWeight: 600 }}>Data Summary</Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div style={{ padding: '24px', background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: '4px' }}>
                <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>TASKS</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 200 }}>{tasks.length}</Title>
              </div>
              <div style={{ padding: '24px', background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: '4px' }}>
                <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>PROJECTS</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 200 }}>{projects.length}</Title>
              </div>
              <div style={{ padding: '24px', background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: '4px' }}>
                <Text className="mono-label" style={{ display: 'block', marginBottom: '8px' }}>COMPLETED</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 200 }}>{tasks.filter((t) => t.status === 'done').length}</Title>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <Title level={4} style={{ marginBottom: '16px', fontWeight: 600 }}>Backup & Restore</Title>
            <Text style={{ display: 'block', marginBottom: '24px', color: token.colorTextSecondary }}>Export your data to a JSON file for backup or transfer.</Text>
            <Space size="middle">
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                style={{ borderRadius: '2px' }}
              >
                Export JSON
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                style={{ borderRadius: '2px' }}
              >
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </Space>
          </div>

          <div style={{ padding: '32px', border: `1px solid ${token.colorError}`, borderRadius: '4px', background: 'rgba(239, 68, 68, 0.05)' }}>
            <Title level={4} style={{ margin: 0, color: token.colorError, fontWeight: 600 }}>System Reset</Title>
            <Text style={{ display: 'block', margin: '8px 0 24px 0', color: token.colorError, opacity: 0.8 }}>
              Permanently delete all tasks, projects, and settings. This cannot be undone.
            </Text>
            <Button danger icon={<DeleteOutlined />} onClick={handleReset} style={{ borderRadius: '2px' }}>
              Factory Reset
            </Button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="reveal active">
      <header style={{ 
        marginBottom: '48px', 
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        paddingBottom: '24px'
      }}>
        <Title level={1} style={{ 
          margin: 0, 
          fontSize: '48px', 
          fontWeight: 300, 
          letterSpacing: '-0.04em',
          color: token.colorText
        }}>
          Configuración <span style={{ color: token.colorTextDescription }}>— Sistema</span>
        </Title>
      </header>

      <Tabs items={items} />
      
      <style>{`
        .ant-tabs-nav::before {
          border-bottom: 1px solid ${token.colorBorderSecondary} !important;
        }
        .ant-tabs-tab-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}
