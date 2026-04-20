import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { theme, Typography } from 'antd'
import TaskCard from './TaskCard'

const { Text } = Typography

export default function TaskKanban({ 
  tareas, 
  columnas, 
  onMoverTarea, 
  onTaskClick,
  recargar 
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 24,
          width: '100%',
          height: 'calc(100vh - 280px)',
          minHeight: 0,
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
                padding: '0 8px 16px 8px',
                borderBottom: `2px solid ${token.colorBorderSecondary}`,
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Text style={{ fontWeight: 700 }}>{columna.label}</Text>
                   <span style={{ 
                     fontSize: 11, 
                     background: token.colorBorderSecondary, 
                     padding: '2px 8px', 
                     borderRadius: 10,
                     fontWeight: 600
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
                      padding: 4,
                      background: snapshot.isDraggingOver ? token.colorBgContainer : 'transparent',
                      borderRadius: 4
                      , overflow: 'auto'
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
                            }}
                          >
                            <TaskCard tarea={tarea} onClick={() => onTaskClick(tarea)} />
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
