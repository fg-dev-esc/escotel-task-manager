import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }) {
  const { isLogged } = useAuth()
  const location = useLocation()

  if (!isLogged) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
