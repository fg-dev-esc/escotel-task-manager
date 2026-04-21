import { Table, Button, Space, Popconfirm, theme, Typography } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import PriorityTag from '../../components/ui/PriorityTag'
import StatusBadge from '../../components/ui/StatusBadge'
import dayjs from 'dayjs'

const { Text } = Typography

export default function TaskList({ tareas, onEditTask, onDeleteTask }) {
  const { token } = theme.useToken()

  const columns = [
    {
      title: <span className="mono-label">TITULO</span>,
      dataIndex: 'titulo',
      key: 'titulo',
      render: text => <Text style={{ fontWeight: 500 }}>{text}</Text>
    },
    {
      title: <span className="mono-label">PRIORIDAD</span>,
      dataIndex: 'prioridad',
      key: 'prioridad',
      render: priority => <PriorityTag priority={priority} />
    },
    {
      title: <span className="mono-label">ESTADO</span>,
      dataIndex: 'estado',
      key: 'estado',
      render: estado => <StatusBadge status={estado} />
    },
    {
      title: <span className="mono-label">FECHA LIMITE</span>,
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: date => (date ? dayjs(date).format('DD MMM') : '—')
    },
    {
      title: <span className="mono-label">CREADO</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => dayjs(date).format('DD MMM')
    },
    {
      title: <span className="mono-label">ACCIONES</span>,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEditTask(record)}
          />
          <Popconfirm
            title="Eliminar?"
            onConfirm={() => onDeleteTask(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Table
      dataSource={tareas.map(t => ({ ...t, key: t.id }))}
      columns={columns}
      onRow={record => ({
        onClick: () => onEditTask(record),
        style: { cursor: 'pointer' }
      })}
      pagination={{ pageSize: 10 }}
    />
  )
}
