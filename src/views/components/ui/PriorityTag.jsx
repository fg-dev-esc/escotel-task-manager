import { Tag, theme } from 'antd'

const priorityConfig = {
  critical: { color: '#EF4444', label: 'CRÍTICA' },
  high: { color: '#F97316', label: 'ALTA' },
  medium: { color: '#EAB308', label: 'MEDIA' },
  low: { color: '#3B82F6', label: 'BAJA' },
}

export default function PriorityTag({ priority }) {
  const { token } = theme.useToken()
  const config = priorityConfig[priority] || priorityConfig.medium
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        backgroundColor: config.color 
      }} />
      <span className="mono-label" style={{ opacity: 1, fontSize: '10px', color: token.colorTextSecondary }}>
        {config.label}
      </span>
    </div>
  )
}
