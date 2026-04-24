import { useState } from 'react'
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
          <div className="app-auth-hero-content">
            <h1 className="app-auth-title" style={{ marginTop: 0 }}>Task Manager</h1>
            <div className="app-auth-accent" aria-hidden="true">
              <span className="app-auth-accent-line" />
              <span className="app-auth-accent-node" />
            </div>
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
