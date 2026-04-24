import { Tag, theme } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const statusConfig = {
  todo: { color: '#64748B', bg: 'rgba(100, 116, 139, 0.10)', label: 'Por hacer', icon: <FileTextOutlined style={{ fontSize: '12px' }} /> },
  in_progress: {
    color: '#2F6BFF',
    bg: 'rgba(47, 107, 255, 0.10)',
    label: 'En curso',
    icon: <ClockCircleOutlined style={{ fontSize: '12px' }} />,
  },
  in_review: {
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.10)',
    label: 'En revisión',
    icon: <SyncOutlined style={{ fontSize: '12px' }} />,
  },
  done: { color: '#16A34A', bg: 'rgba(22, 163, 74, 0.10)', label: 'Completado', icon: <CheckCircleOutlined style={{ fontSize: '12px' }} /> },
}

export default function StatusBadge({ status }) {
  const { token } = theme.useToken()
  const config = statusConfig[status] || statusConfig.todo

  return (
    <Tag
      icon={config.icon}
      bordered={false}
      style={{
        background: config.bg,
        color: config.color,
        borderRadius: '999px',
        fontSize: '10px',
        fontWeight: 650,
        padding: '5px 10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        border: '1px solid transparent',
      }}
    >
      {config.label}
    </Tag>
  )
}
