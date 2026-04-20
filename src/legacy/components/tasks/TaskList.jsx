import { Table, Button, Space, Popconfirm, message, theme, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons'
import PriorityTag from '../ui/PriorityTag'
import StatusBadge from '../ui/StatusBadge'
import { useTasks } from '../../hooks/useTasks'
import dayjs from 'dayjs'
import { useState } from 'react'

const { Text } = Typography

export default function TaskList({ tasks, onTaskClick, onEditTask }) {
  const { dispatch } = useTasks()
  const { token } = theme.useToken()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const handleDelete = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId })
    message.success('Tarea eliminada')
  }

  const handleBulkComplete = () => {
    selectedRowKeys.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        dispatch({
          type: 'UPDATE_TASK',
          payload: { ...task, status: 'done', updatedAt: dayjs().toISOString() },
        })
      }
    })
    setSelectedRowKeys([])
    message.success('Tareas marcadas como completadas')
  }

  const handleBulkDelete = () => {
    selectedRowKeys.forEach((taskId) => {
      dispatch({ type: 'DELETE_TASK', payload: taskId })
    })
    setSelectedRowKeys([])
    message.success('Tareas eliminadas')
  }

  const columns = [
    {
      title: <span className="mono-label">TÍTULO</span>,
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Text style={{ fontWeight: 500, fontSize: '14px', color: token.colorText }}>
          {text}
        </Text>
      ),
    },
    {
      title: <span className="mono-label">PRIORIDAD</span>,
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <PriorityTag priority={priority} />,
      width: 140,
    },
    {
      title: <span className="mono-label">ESTADO</span>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
      width: 140,
    },
    {
      title: <span className="mono-label">FECHA LÍMITE</span>,
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => (
        <Text className="mono-label" style={{ opacity: 0.8 }}>
          {dueDate ? dayjs(dueDate).format('DD MMM, YYYY') : '—'}
        </Text>
      ),
      width: 140,
    },
    {
      title: <span className="mono-label">ACCIONES</span>,
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ color: token.colorTextSecondary }} />}
            onClick={(e) => {
              e.stopPropagation()
              onEditTask(record.id)
            }}
          />
          <Popconfirm
            title="Delete task?"
            onConfirm={(e) => {
              e.stopPropagation()
              handleDelete(record.id)
            }}
            onCancel={(e) => e.stopPropagation()}
            okText="Delete"
            cancelText="No"
            okButtonProps={{ danger: true, size: 'small' }}
          >
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div className="reveal active delay-100">
      {selectedRowKeys.length > 0 && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '12px 16px', 
          background: token.colorBgContainer,
          border: `1px solid ${token.colorPrimary}`,
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space>
            <span className="mono-label" style={{ opacity: 1, color: token.colorPrimary }}>
              {selectedRowKeys.length} SELECTED
            </span>
          </Space>
          <Space>
            <Button 
              type="primary" 
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={handleBulkComplete}
              style={{ borderRadius: '2px' }}
            >
              Complete
            </Button>
            <Button 
              danger 
              size="small"
              onClick={handleBulkDelete}
              style={{ borderRadius: '2px' }}
            >
              Delete
            </Button>
          </Space>
        </div>
      )}

      <Table
        dataSource={tasks.map((task) => ({ ...task, key: task.id }))}
        columns={columns}
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => onTaskClick(record.id),
          style: { cursor: 'pointer' }
        })}
        pagination={{ 
          pageSize: 10,
          position: ['bottomRight'],
          size: 'small'
        }}
        style={{ 
          background: 'transparent',
        }}
        rowClassName="task-table-row"
      />

      <style>{`
        .ant-table {
          background: transparent !important;
        }
        .ant-table-thead > tr > th {
          background: transparent !important;
          border-bottom: 2px solid ${token.colorBorderSecondary} !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${token.colorBorderSecondary} !important;
          padding: 16px 8px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: ${token.colorBgContainer} !important;
        }
      `}</style>
    </div>
  )
}
