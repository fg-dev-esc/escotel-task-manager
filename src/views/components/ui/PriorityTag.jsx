import { Tag } from 'antd'

const priorityConfig = {
  critical: { color: '#DC2626', tint: 'rgba(220, 38, 38, 0.10)', label: 'Crítica' },
  high: { color: '#D97706', tint: 'rgba(217, 119, 6, 0.10)', label: 'Alta' },
  medium: { color: '#2F6BFF', tint: 'rgba(47, 107, 255, 0.10)', label: 'Media' },
  low: { color: '#0891B2', tint: 'rgba(8, 145, 178, 0.10)', label: 'Baja' },
}

export default function PriorityTag({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium
  
  return (
    <Tag
      bordered={false}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 999,
        background: config.tint,
        color: config.color,
        fontSize: 11,
        fontWeight: 650,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        border: '1px solid transparent',
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: 999, background: config.color, boxShadow: `0 0 0 4px ${config.tint}` }} />
      <span>{config.label}</span>
    </Tag>
  )
}
