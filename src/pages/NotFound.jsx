import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="Página no encontrada"
      extra={<Button type="primary" onClick={() => navigate('/')}>Volver al inicio</Button>}
    />
  )
}
