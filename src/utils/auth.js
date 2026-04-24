import parseJwt from './parseJwt'

const STORAGE_TOKEN = 'escotel_token'

export function getToken() {
  return localStorage.getItem(STORAGE_TOKEN)
}

export function isLogged() {
  return Boolean(getToken())
}

export function getNombre() {
  const token = getToken()
  if (!token) return ''
  const decoded = parseJwt(token)
  return decoded?.nombre || ''
}

export function setToken(token) {
  localStorage.setItem(STORAGE_TOKEN, token)
}

export function clearToken() {
  localStorage.removeItem(STORAGE_TOKEN)
}