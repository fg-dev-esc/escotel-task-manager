import { Navigate, useLocation } from 'react-router-dom'
import { isLogged } from '../utils/auth'

export default function RequireAuth({ children }) {
  const logged = isLogged()
  const location = useLocation()

  if (!logged) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}