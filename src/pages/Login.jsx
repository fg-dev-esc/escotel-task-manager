import { useState } from 'react'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import logoEscotel from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleFinish = async (values) => {
    try {
      setLoading(true)
      await login(values.email, values.password)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      message.error(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'linear-gradient(135deg, #f7f7fb 0%, #eef2f7 100%)',
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: 420, borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <img src={logoEscotel} alt="Escotel" style={{ height: 54, width: 'auto' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Task Manager
          </Title>
          <Text type="secondary">Ingresa con tu cuenta SIGSA</Text>
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
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
