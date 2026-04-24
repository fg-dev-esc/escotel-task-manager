import { useMemo, useState } from 'react'
import {
  Button,
  Input,
  Upload,
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
import { DeleteOutlined, EditOutlined, PictureOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.locale('es')

const { Text } = Typography

/**
 * Sección de comentarios con historial
 */
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
  const totalAdjuntos = useMemo(() => comentarios.reduce((acc, comentario) => acc + (comentario.fotos?.length || 0), 0), [comentarios])

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
                  onGuardar={(texto, fotosNuevas, fotosAEliminar) => {
                    onActualizar(comentario.id, texto, fotosNuevas, fotosAEliminar)
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
        <FormAgregarComentario tareaId={tareaId} onAgregar={onAgregar} loading={loading} autor={autor} />
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
        background: 'rgba(255,255,255,0.82)',
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

      {comentario.fotos && comentario.fotos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {comentario.fotos.map(foto => (
            <div
              key={foto.id}
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--app-border)',
                width: 84,
                height: 84,
                background: '#fff'
              }}
              title={foto.nombre}
              onClick={() => window.open(foto.url, '_blank')}
            >
              <img
                src={foto.url}
                alt={foto.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
  Formulario para agregar comentario
 */
function FormAgregarComentario({ tareaId, onAgregar, loading, autor }) {
  const [texto, setTexto] = useState('')
  const [fotos, setFotos] = useState([])

  const handleSubmit = async () => {
    if (!texto.trim()) {
      message.warning('Escribe un comentario')
      return
    }

    const fotosFiles = fotos.map(f => f.originFileObj)
    const éxito = await onAgregar(texto, fotosFiles, autor)

    if (éxito) {
      setTexto('')
      setFotos([])
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

      {/* Preview de fotos seleccionadas */}
      {fotos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {fotos.map(file => (
            <div
              key={file.uid}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--app-border)'
              }}
            >
              <img
                src={URL.createObjectURL(file.originFileObj)}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Sub-componente: Formulario para editar comentario
 */
function FormEditarComentario({ comentario, loading, onGuardar, onCancelar }) {
  const [texto, setTexto] = useState(comentario.texto)
  const [fotosNuevas, setFotosNuevas] = useState([])
  const [fotosAEliminar, setFotosAEliminar] = useState([])
  const [fotosRestantes, setFotosRestantes] = useState(comentario.fotos || [])

  const handleEliminarFoto = fotoId => {
    setFotosRestantes(prev => prev.filter(f => f.id !== fotoId))
    setFotosAEliminar(prev => [...prev, fotoId])
  }

  const handleGuardar = async () => {
    if (!texto.trim()) {
      message.warning('El comentario no puede estar vacío')
      return
    }

    const fotosFiles = fotosNuevas.map(f => f.originFileObj)
    const éxito = await onGuardar(texto, fotosFiles, fotosAEliminar)

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
        background: 'rgba(248,250,252,0.8)'
      }}
    >
      <Input.TextArea
        rows={2}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        disabled={loading}
        style={{ marginBottom: 10 }}
      />

      {/* Fotos existentes */}
      {fotosRestantes.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>Fotos actuales</Text>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {fotosRestantes.map(foto => (
              <div
                key={foto.id}
                style={{
                  position: 'relative',
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--app-border)'
                }}
              >
                <img
                  src={foto.url}
                  alt="actual"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleEliminarFoto(foto.id)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.55)',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '0'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agregar nuevas fotos */}
      <div style={{ marginBottom: 10 }}>
        <Upload
          multiple
          maxCount={5 - fotosRestantes.length}
          beforeUpload={() => false}
          onChange={info => setFotosNuevas(info.fileList)}
          accept="image/*"
        >
          <Button icon={<PlusOutlined />} disabled={loading}>
            Agregar fotos ({fotosNuevas.length}/{5 - fotosRestantes.length})
          </Button>
        </Upload>
      </div>

      {/* Preview nuevas fotos */}
      {fotosNuevas.length > 0 && (
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, justifyContent: 'flex-end' }}>
          {fotosNuevas.map(file => (
            <div
              key={file.uid}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--app-border)'
              }}
            >
              <img
                src={URL.createObjectURL(file.originFileObj)}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Botones */}
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
