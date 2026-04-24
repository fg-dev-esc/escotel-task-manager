import { Card, theme, Typography } from 'antd'
import PriorityTag from '../../components/ui/PriorityTag'
import dayjs from 'dayjs'

const { Text } = Typography

export default function TaskCard({ tarea, onClick, dragging = false }) {
  const { token } = theme.useToken()

  return (
    <Card
      size="small"
      onClick={onClick}
      className="app-soft-panel"
      style={{ 
        width: '100%',
        maxWidth: '100%',
        cursor: 'pointer',
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s ease',
        transform: 'none',
        boxShadow: dragging ? '0 18px 40px rgba(15, 23, 42, 0.16)' : undefined,
        willChange: dragging ? 'box-shadow' : 'auto',
        cursor: dragging ? 'grabbing' : 'pointer',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontWeight: 650, fontSize: 14, lineHeight: 1.45, display: 'block', letterSpacing: '-0.02em' }}>
            {tarea.titulo}
          </Text>

          {tarea.descripcion && (
            <Text style={{ fontSize: 12, color: token.colorTextSecondary, display: 'block', marginTop: 6, lineHeight: 1.6 }}>
              {tarea.descripcion.substring(0, 84)}
              {tarea.descripcion.length > 84 && '...'}
            </Text>
          )}
        </div>

        <div style={{ width: 10, height: 10, borderRadius: 999, background: tarea.prioridad === 'critical' ? 'var(--app-danger)' : tarea.prioridad === 'high' ? 'var(--app-warning)' : tarea.prioridad === 'medium' ? '#EAB308' : '#3B82F6', marginTop: 4, flexShrink: 0 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <PriorityTag priority={tarea.prioridad} />
        <Text style={{ fontSize: 11, color: token.colorTextDescription, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          {dayjs(tarea.createdAt).format('DD MMM')}
        </Text>
      </div>
    </Card>
  )
}
