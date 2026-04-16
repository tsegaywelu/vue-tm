export type LoginMode = 'carrier' | 'shipper'

export interface LoginCredentials {
  username?: string
  password?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  role: {
    type: string
    permissions: Array<{
      subject: string
      action: string[]
    }>
  }
}
