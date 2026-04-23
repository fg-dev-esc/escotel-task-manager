const LOGIN_URL = 'https://dev-sigsa.backend.escotel.mx/api/auth/login'

export async function login(email, password) {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const token = await response.text()

  if (!response.ok) {
    throw new Error(token || 'No fue posible iniciar sesión')
  }

  return { token: token.trim() }
}
