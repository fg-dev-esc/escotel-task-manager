import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { theme, Typography } from 'antd'
import TaskCard from './TaskCard'

const { Text } = Typography

export default function TaskKanban({ 
  tareas, 
  columnas, 
  onMoverTarea, 
  onTaskClick
}) {
  const [tareasLocal, setTareasLocal] = useState(tareas)
  const { token } = theme.useToken()

  useEffect(() => {
    setTareasLocal(tareas)
  }, [tareas])

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    
    setTareasLocal(prev => prev.map(t => 
      t.id === draggableId ? { ...t, estado: destination.droppableId } : t
    ))
    
    onMoverTarea(draggableId, destination.droppableId)
  }

  const tareasAMostrar = tareasLocal.length > 0 ? tareasLocal : tareas

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className="app-soft-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))',
          gap: 18,
          width: '100%',
          minHeight: '70vh',
          padding: 18,
          overflowX: 'auto',
          boxShadow: 'var(--app-shadow-sm)',
        }}
      >
        {columnas.map((columna) => {
          const tareasColumna = tareasAMostrar.filter(t => t.estado === columna.id)
          return (
            <div key={columna.id} style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0 6px 14px',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Text style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{columna.label}</Text>
                   <span style={{ 
                     fontSize: 11,
                     background: 'rgba(47, 107, 255, 0.08)', 
                     color: token.colorPrimary,
                     padding: '4px 10px', 
                     borderRadius: 999,
                     fontWeight: 650,
                     fontFamily: 'var(--font-mono)'
                   }}>
                     {tareasColumna.length}
                   </span>
                 </div>
              </div>

              <Droppable droppableId={columna.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      padding: 6,
                      background: snapshot.isDraggingOver ? 'rgba(47, 107, 255, 0.05)' : 'transparent',
                      borderRadius: 14,
                      overflow: 'auto',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {tareasColumna.map((tarea, index) => (
                      <Draggable key={tarea.id} draggableId={tarea.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: 12,
                              alignSelf: 'flex-start',
                            }}
                          >
                            <TaskCard tarea={tarea} onClick={() => onTaskClick(tarea)} dragging={snapshot.isDragging} />
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
