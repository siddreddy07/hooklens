const AUTH_KEY = 'hooklens_authenticated'
const DEMO_EMAIL = 'demo@hooklens.dev'
const DEMO_PASSWORD = 'demo1234'

export function login(email: string, password: string): boolean {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'true')
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export const demoCredentials = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
}
