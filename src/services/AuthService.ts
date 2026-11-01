import apiClient from './api'
import type { AuthResponse, RegisterPayload, User } from '@/types'

export default {
  login(username: string, password: string) {
    return apiClient.post<AuthResponse>('/auth/login', { username, password })
  },
  register(payload: RegisterPayload) {
    return apiClient.post<AuthResponse>('/auth/register', payload)
  },
  me() {
    return apiClient.get<User>('/auth/me')
  },
}
