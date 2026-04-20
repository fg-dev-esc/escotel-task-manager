import { Card, theme, Typography } from 'antd'
import PriorityTag from '../../components/ui/PriorityTag'
import dayjs from 'dayjs'

const { Text } = Typography

export default function TaskCard({ tarea, onClick }) {
  const { token } = theme.useToken()

  return (
    <Card
      size="small"
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        borderRadius: 4,
        border: `1px solid ${token.colorBorderSecondary}`
      }}
      bodyStyle={{ padding: 12 }}
    >
      <Text style={{ fontWeight: 500, fontSize: 14, display: 'block', marginBottom: 8 }}>
        {tarea.titulo}
      </Text>
      
      {tarea.descripcion && (
        <Text style={{ fontSize: 12, color: token.colorTextSecondary, display: 'block', marginBottom: 8 }}>
          {tarea.descripcion.substring(0, 60)}
          {tarea.descripcion.length > 60 && '...'}
        </Text>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PriorityTag priority={tarea.prioridad} />
        <Text style={{ fontSize: 11, color: token.colorTextDescription }}>
          {dayjs(tarea.createdAt).format('DD MMM')}
        </Text>
      </div>
    </Card>
  )
}