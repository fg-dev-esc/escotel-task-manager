import { Tag, theme } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const statusConfig = {
  todo: { color: 'default', label: 'POR HACER', icon: <FileTextOutlined style={{ fontSize: '12px' }} /> },
  in_progress: {
    color: 'processing',
    label: 'EN CURSO',
    icon: <ClockCircleOutlined style={{ fontSize: '12px' }} />,
  },
  in_review: {
    color: 'warning',
    label: 'REVISIÓN',
    icon: <SyncOutlined style={{ fontSize: '12px' }} />,
  },
  done: { color: 'success', label: 'COMPLETADO', icon: <CheckCircleOutlined style={{ fontSize: '12px' }} /> },
}

export default function StatusBadge({ status }) {
  const { token } = theme.useToken()
  const config = statusConfig[status] || statusConfig.todo

  return (
    <Tag
      icon={config.icon}
      bordered={false}
      style={{
        background: token.colorBorderSecondary,
        color: token.colorTextSecondary,
        borderRadius: '2px',
        fontSize: '10px',
        fontWeight: 600,
        padding: '0 8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: "'JetBrains Mono', monospace"
      }}
    >
      {config.label}
    </Tag>
  )
}
