import { useState } from 'react'
import {
  Button,
  Input,
  Upload,
  Badge,
  Space,
  Modal,
  message,
  Spin,
  Empty
} from 'antd'
import { DeleteOutlined, EditOutlined, PictureOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.locale('es')

/**
 * Sección de comentarios con historial
 */
export default function ComentariosSection({
  tareaId,
  comentarios,
  onAgregar,
  onActualizar,
  onEliminar,
  loading
}) {
  const [editandoId, setEditandoId] = useState(null)

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '16px'
      }}
    >
      {/* HEADER CON BADGE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0 }}>
          Comentarios
          <Badge count={comentarios.length} style={{ marginLeft: '8px', backgroundColor: '#1890ff' }} />
        </h4>
      </div>

      {/* LISTADO - SCROLLEABLE */}
      <Spin spinning={loading}>
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '12px',
            paddingRight: '8px'
          }}
        >
          {comentarios.length === 0 ? (
            <Empty description="Sin comentarios" style={{ marginTop: '12px' }} />
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

      {/* FORM - NUEVO COMENTARIO */}
      {editandoId === null && (
        <FormAgregarComentario tareaId={tareaId} onAgregar={onAgregar} loading={loading} />
      )}
    </div>
  )
}

function ComentarioItem({ comentario, onEditar, onEliminar }) {
  return (
    <div
      style={{
        borderBottom: '1px solid #e8e8e8',
        paddingBottom: '12px',
        marginBottom: '12px',
        padding: '8px',
        borderRadius: '4px'
      }}
    >
      {/* HEADER: Fecha y botones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <small style={{ color: '#666', fontSize: '12px' }}>
          {dayjs(comentario.createdAt).fromNow()}
          {comentario.updatedAt !== comentario.createdAt && (
            <span style={{ marginLeft: '8px', color: '#999' }}>(editado)</span>
          )}
        </small>
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={onEditar}
            title="Editar"
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={onEliminar}
            title="Eliminar"
          />
        </Space>
      </div>

      {/* TEXTO */}
      <p style={{ margin: '8px 0', wordBreak: 'break-word' }}>{comentario.texto}</p>

      {/* GALERÍA DE FOTOS */}
      {comentario.fotos && comentario.fotos.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {comentario.fotos.map(foto => (
            <div
              key={foto.id}
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
              title={foto.nombre}
            >
              <img
                src={foto.url}
                alt={foto.nombre}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                onClick={() => {
                  window.open(foto.url, '_blank')
                }}
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
function FormAgregarComentario({ tareaId, onAgregar, loading }) {
  const [texto, setTexto] = useState('')
  const [fotos, setFotos] = useState([])

  const handleSubmit = async () => {
    if (!texto.trim()) {
      message.warning('Escribe un comentario')
      return
    }

    const fotosFiles = fotos.map(f => f.originFileObj)
    const éxito = await onAgregar(texto, fotosFiles)

    if (éxito) {
      setTexto('')
      setFotos([])
      message.success('Comentario agregado')
    } else {
      message.error('Error al agregar comentario')
    }
  }

  return (
    <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '12px' }}>
      <Input.TextArea
        rows={2}
        placeholder="Escribe un comentario..."
        value={texto}
        onChange={e => setTexto(e.target.value)}
        disabled={loading}
        style={{ marginBottom: '8px' }}
      />

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <Upload
          multiple
          maxCount={5}
          beforeUpload={() => false}
          onChange={info => setFotos(info.fileList)}
          accept="image/*"
        >
          {/* <Button
            icon={<PictureOutlined />}
            disabled={loading}
          >
            Fotos ({fotos.length}/5)
          </Button> */}
        </Upload>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!texto.trim()}
        >
          Enviar
        </Button>
      </div>

      {/* Preview de fotos seleccionadas */}
      {fotos.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {fotos.map(file => (
            <div
              key={file.uid}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #ddd'
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
        border: '1px solid #d9d9d9',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '12px'
      }}
    >
      <Input.TextArea
        rows={2}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        disabled={loading}
        style={{ marginBottom: '8px' }}
      />

      {/* Fotos existentes */}
      {fotosRestantes.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <small style={{ display: 'block', marginBottom: '4px', color: '#666' }}>Fotos actuales:</small>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {fotosRestantes.map(foto => (
              <div
                key={foto.id}
                style={{
                  position: 'relative',
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #ddd'
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
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
      <div style={{ marginBottom: '8px' }}>
        <Upload
          multiple
          maxCount={5 - fotosRestantes.length}
          beforeUpload={() => false}
          onChange={info => setFotosNuevas(info.fileList)}
          accept="image/*"
        >
          <Button icon={<PictureOutlined />} disabled={loading}>
            Agregar fotos ({fotosNuevas.length}/{5 - fotosRestantes.length})
          </Button>
        </Upload>
      </div>

      {/* Preview nuevas fotos */}
      {fotosNuevas.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {fotosNuevas.map(file => (
            <div
              key={file.uid}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #ddd'
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
