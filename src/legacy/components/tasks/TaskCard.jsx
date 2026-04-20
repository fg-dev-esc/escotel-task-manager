import { Card, Row, Col, Progress, Tag, theme } from 'antd'
import PriorityTag from '../ui/PriorityTag'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.locale('es')

export default function TaskCard({ task, onTaskClick }) {
  const { token } = theme.useToken()
  const subtaskProgress =
    task.subtasks.length > 0
      ? (task.subtasks.filter((s) => s.done).length / task.subtasks.length) * 100
      : 0

  const isOverdue =
    task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day')

  return (
    <Card
      size="small"
      onClick={() => onTaskClick(task.id)}
      style={{ 
        cursor: 'pointer', 
        marginBottom: '12px',
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        borderRadius: token.borderRadius,
      }}
      hoverable
    >
      <div>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px',
          fontWeight: 600,
          color: token.colorText,
          letterSpacing: '-0.01em'
        }}>
          {task.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <PriorityTag priority={task.priority} />
          {task.dueDate && (
            <span className="mono-label" style={{ 
              color: isOverdue ? token.colorError : token.colorTextDescription,
              opacity: 1
            }}>
              {dayjs(task.dueDate).fromNow()}
            </span>
          )}
        </div>

        {task.subtasks.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="mono-label">Subtareas</span>
              <span className="mono-label" style={{ opacity: 1 }}>
                {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
              </span>
            </div>
            <Progress
              percent={subtaskProgress}
              size={[null, 4]}
              showInfo={false}
              strokeColor={token.colorPrimary}
              trailColor={token.colorBorderSecondary}
            />
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {task.tags.map((tag) => (
              <Tag 
                key={tag} 
                bordered={false}
                style={{ 
                  fontSize: '10px', 
                  margin: 0,
                  background: token.colorBorderSecondary,
                  color: token.colorTextSecondary,
                  padding: '0 6px',
                  borderRadius: '2px'
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
