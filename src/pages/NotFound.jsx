import { Result, Button, Card } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="app-auth-screen">
      <Card className="app-auth-card" styles={{ body: { padding: 0, minWidth: 0 } }}>
        <div className="app-auth-card-inner" style={{ textAlign: 'center' }}>
          <Result
            status="404"
            title="404"
            subTitle="Página no encontrada"
            extra={<Button type="primary" onClick={() => navigate('/')}>Volver al inicio</Button>}
          />
        </div>
      </Card>
    </div>
  )
}
