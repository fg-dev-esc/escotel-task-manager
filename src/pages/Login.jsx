import { useState, useRef, useEffect } from 'react'
import { Button, Card, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../services/auth'
import { setToken } from '../utils/auth'
import logoEscotel from '../assets/logo.png'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    const particles = []

    const resizeCanvas = () => {
      const hero = canvas.parentElement
      canvas.width = hero.offsetWidth
      canvas.height = hero.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(202, 34, 40, ${Math.random() * 0.3 + 0.1})`
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const handleFinish = async (values) => {
    try {
      setLoading(true)
      const response = await loginRequest(values.email, values.password)
      if (response?.token) {
        setToken(response.token)
        const redirectTo = location.state?.from?.pathname || '/'
        navigate(redirectTo, { replace: true })
      } else {
        throw new Error('Token no recibido')
      }
    } catch (error) {
      message.error(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-auth-screen">
      <div className="app-auth-grid">
        <section className="app-auth-hero">
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
          <div className="app-auth-hero-content" style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="app-auth-title" style={{ marginTop: 0 }}>Task Manager</h1>
          </div>
        </section>

        <Card className="app-auth-card" styles={{ body: { padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%' } }}>
          <div className="app-auth-card-inner" style={{ width: '100%', maxWidth: 360, padding: '40px 32px' }}>
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <img src={logoEscotel} alt="Escotel" style={{ height: 40, marginBottom: 32, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
              <div className="app-kicker">Secure access</div>
              <div className="app-auth-form-title">Ingresa a tu cuenta</div>
              <div className="app-auth-form-subtitle">Accede con tus credenciales SIGSA.</div>
            </div>

            <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
              <Form.Item
                name="email"
                label="Correo"
                rules={[{ required: true, message: 'Ingresa tu correo' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="correo@empresa.com" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Contraseña"
                rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" icon={<ArrowRightOutlined />} style={{ background: '#CA2228', borderColor: '#CA2228' }}>
                  Entrar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  )
}
