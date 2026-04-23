import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/auth'
import parseJwt from '../utils/parseJwt'

const AuthContext = createContext(null)

const STORAGE_TOKEN = 'escotel_token'
const STORAGE_USER = 'escotel_user'

function getInitialAuth() {
  const token = localStorage.getItem(STORAGE_TOKEN)
  const userRaw = localStorage.getItem(STORAGE_USER)

  if (!token) {
    return { token: null, user: null, isLogged: false }
  }

  let user = null
  if (userRaw) {
    try {
      user = JSON.parse(userRaw)
    } catch {
      user = null
    }
  }

  if (!user) {
    user = parseJwt(token)
  }

  return { token, user, isLogged: Boolean(token) }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth)

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(STORAGE_TOKEN, auth.token)
    } else {
      localStorage.removeItem(STORAGE_TOKEN)
    }

    if (auth.user) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(auth.user))
    } else {
      localStorage.removeItem(STORAGE_USER)
    }
  }, [auth])

  const login = async (email, password) => {
    const response = await loginRequest(email, password)
    const token = response?.token

    if (!token) {
      throw new Error('La respuesta no incluyó token')
    }

    const decoded = parseJwt(token) || {}
    const user = response?.user || {
      ...decoded,
      nombre: decoded.nombre || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || response?.nombre || email,
    }

    setAuth({ token, user, isLogged: true })
    return { token, user }
  }

  const logout = () => {
    setAuth({ token: null, user: null, isLogged: false })
  }

  const value = useMemo(() => ({
    ...auth,
    login,
    logout,
    nombre: auth.user?.nombre || auth.user?.name || auth.user?.email || '',
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
