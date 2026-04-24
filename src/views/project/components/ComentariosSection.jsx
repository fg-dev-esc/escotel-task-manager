import { useState } from 'react'
import {
  Button,
  Input,
  Badge,
  Space,
  Modal,
  message,
  Spin,
  Empty,
  Card,
  Typography,
  Divider
} from 'antd'
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.locale('es')

const { Text } = Typography

export default function ComentariosSection({
  tareaId,
  comentarios,
  onAgregar,
  onActualizar,
  onEliminar,
  loading,
  autor
}) {
  const [editandoId, setEditandoId] = useState(null)

  return (
    <Card className="app-panel" style={{ marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        <div>
          <div className="app-kicker">Discussion</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: 650, letterSpacing: '-0.03em' }}>Comentarios</Text>
            <Badge count={comentarios.length} showZero style={{ backgroundColor: 'var(--app-primary)' }} />
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: 6 }}>
            Historial colaborativo
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '0 0 16px' }} />

      <Spin spinning={loading}>
        <div
          style={{
            maxHeight: '360px',
            overflowY: 'auto',
            marginBottom: 16,
            paddingRight: 6,
          }}
        >
          {comentarios.length === 0 ? (
            <Empty
              description={
                <div>
                  <div style={{ fontWeight: 650, marginBottom: 4 }}>Sin comentarios</div>
                  <Text type="secondary">Todo el contexto de la tarea vive aquí.</Text>
                </div>
              }
            />
          ) : (
            comentarios.map(comentario =>
              editandoId === comentario.id ? (
                <FormEditarComentario
                  key={comentario.id}
                  comentario={comentario}
                  loading={loading}
                  onGuardar={(texto) => {
                    onActualizar(comentario.id, texto)
                    setEditandoId(null)
                  }}
                  onCancelar={() => setEditandoId(null)}
                />
              ) : (
                <ComentarioItem
                  key={comentario.id}
                  comentario={comentario}
                  onEditar={() => setEditandoId(comentario.id)}
                  onEliminar={() => {
                    Modal.confirm({
                      title: 'Eliminar comentario',
                      content: '¿Eliminar este comentario?',
                      okText: 'Eliminar',
                      cancelText: 'Cancelar',
                      okButtonProps: { danger: true },
                      onOk: () => onEliminar(comentario.id)
                    })
                  }}
                />
              )
            )
          )}
        </div>
      </Spin>

      <Divider style={{ margin: '0 0 16px' }} />

      {editandoId === null && (
        <FormAgregarComentario onAgregar={onAgregar} loading={loading} autor={autor} />
      )}
    </Card>
  )
}

function ComentarioItem({ comentario, onEditar, onEliminar }) {
  return (
    <div
      style={{
        padding: 14,
        border: '1px solid var(--app-border)',
        borderRadius: 16,
        background: '#ffffff',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {dayjs(comentario.createdAt).fromNow()}
            {comentario.updatedAt !== comentario.createdAt && <span style={{ marginLeft: 8 }}>(editado)</span>}
          </Text>
          {comentario.autor && (
            <Text style={{ fontSize: 12, fontWeight: 600, display: 'block', marginTop: 2 }}>
              {comentario.autor}
            </Text>
          )}
        </div>
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={onEditar} title="Editar" />
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={onEliminar} title="Eliminar" />
        </Space>
      </div>

      <Text style={{ display: 'block', margin: '8px 0 12px', wordBreak: 'break-word', lineHeight: 1.65 }}>
        {comentario.texto}
      </Text>
    </div>
  )
}

function FormAgregarComentario({ onAgregar, loading, autor }) {
  const [texto, setTexto] = useState('')

  const handleSubmit = async () => {
    if (!texto.trim()) {
      message.warning('Escribe un comentario')
      return
    }

    const éxito = await onAgregar(texto, autor)

    if (éxito) {
      setTexto('')
      message.success('Comentario agregado')
    } else {
      message.error('Error al agregar comentario')
    }
  }

  return (
    <div>
      <Input.TextArea
        rows={2}
        placeholder="Escribe un comentario..."
        value={texto}
        onChange={e => setTexto(e.target.value)}
        disabled={loading}
        style={{ marginBottom: 10 }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!texto.trim()}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormEditarComentario({ comentario, loading, onGuardar, onCancelar }) {
  const [texto, setTexto] = useState(comentario.texto)

  const handleGuardar = async () => {
    if (!texto.trim()) {
      message.warning('El comentario no puede estar vacío')
      return
    }

    const éxito = await onGuardar(texto)

    if (éxito) {
      message.success('Comentario actualizado')
    }
  }

  return (
    <div
      style={{
        border: '1px solid var(--app-border)',
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
        background: '#ffffff'
      }}
    >
      <Input.TextArea
        rows={2}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        disabled={loading}
        style={{ marginBottom: 10 }}
      />

      <Space>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleGuardar}
          loading={loading}
          disabled={!texto.trim()}
        >
          Guardar
        </Button>
        <Button
          icon={<CloseOutlined />}
          onClick={onCancelar}
          disabled={loading}
        >
          Cancelar
        </Button>
      </Space>
    </div>
  )
}