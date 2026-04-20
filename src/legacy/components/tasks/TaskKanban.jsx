import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd'
import { theme, Typography } from 'antd'
import TaskCard from './TaskCard'
import { useTasks } from '../../hooks/useTasks'

const { Text } = Typography

const columns = [
  { id: 'todo', label: 'POR HACER' },
  { id: 'in_progress', label: 'EN CURSO' },
  { id: 'in_review', label: 'EN REVISIÓN' },
  { id: 'done', label: 'COMPLETADO' },
]

export default function TaskKanban({ tasks, onTaskClick }) {
  const { dispatch } = useTasks()
  const { token } = theme.useToken()

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    const updatedTask = {
      ...task,
      status: destination.droppableId,
      order: destination.index,
    }
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px', width: '100%', height: 'calc(100vh - 280px)', minHeight: 0 }}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id)
          return (
            <div key={column.id} style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0 8px 16px 8px',
                borderBottom: `2px solid ${token.colorBorderSecondary}`,
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono-label" style={{ opacity: 1, fontWeight: 700 }}>{column.label}</span>
                  <div style={{ 
                    fontSize: '11px', 
                    background: token.colorBorderSecondary, 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    color: token.colorTextSecondary,
                    fontWeight: 600
                  }}>
                    {columnTasks.length}
                  </div>
                </div>
              </div>

               <Droppable droppableId={column.id}>
                 {(provided, snapshot) => (
                   <div
                     ref={provided.innerRef}
                     {...provided.droppableProps}
                     style={{
                       flex: 1,
                       minHeight: 0,
                       padding: '4px',
                       background: snapshot.isDraggingOver ? token.colorBgContainer : 'transparent',
                       transition: 'background 0.2s ease',
                       borderRadius: '4px',
                       overflow: 'auto'
                     }}
                   >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '12px',
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transform: snapshot.isDragging ? provided.draggableProps.style?.transform + ' rotate(2deg)' : provided.draggableProps.style?.transform,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onTaskClick={onTaskClick}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
