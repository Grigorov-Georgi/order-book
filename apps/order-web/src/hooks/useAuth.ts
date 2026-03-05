export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  login: () => void
  logout: () => void
}

export const useAuth = (): AuthState => ({
  isAuthenticated: false,
  token: null,
  login: () => undefined,
  logout: () => undefined,
})
