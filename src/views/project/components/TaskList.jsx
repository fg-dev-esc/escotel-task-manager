import { Table, Button, Space, Popconfirm, Typography } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import PriorityTag from '../../components/ui/PriorityTag'
import StatusBadge from '../../components/ui/StatusBadge'
import dayjs from 'dayjs'

const { Text } = Typography

export default function TaskList({ tareas, onEditTask, onDeleteTask }) {
  const columns = [
    {
      title: <span className="app-kicker">Título</span>,
      dataIndex: 'titulo',
      key: 'titulo',
      render: text => <Text style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{text}</Text>
    },
    {
      title: <span className="app-kicker">Prioridad</span>,
      dataIndex: 'prioridad',
      key: 'prioridad',
      render: priority => <PriorityTag priority={priority} />
    },
    {
      title: <span className="app-kicker">Estado</span>,
      dataIndex: 'estado',
      key: 'estado',
      render: estado => <StatusBadge status={estado} />
    },
    {
      title: <span className="app-kicker">Fecha límite</span>,
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: date => <Text type="secondary">{date ? dayjs(date).format('DD MMM') : '—'}</Text>
    },
    {
      title: <span className="app-kicker">Creado</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => <Text type="secondary">{dayjs(date).format('DD MMM')}</Text>
    },
    {
      title: <span className="app-kicker">Acciones</span>,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={e => {
              e.stopPropagation()
              onEditTask(record)
            }}
          />
          <Popconfirm
            title="Eliminar?"
            onConfirm={() => onDeleteTask(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} onClick={e => e.stopPropagation()} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="app-panel" style={{ overflow: 'hidden' }}>
      <Table
        dataSource={tareas.map(t => ({ ...t, key: t.id }))}
        columns={columns}
        onRow={record => ({
          onClick: () => onEditTask(record),
          style: { cursor: 'pointer' }
        })}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        rowClassName={() => 'app-table-row'}
        style={{ background: 'transparent' }}
        scroll={{ x: true }}
      />
    </div>
  )
}
