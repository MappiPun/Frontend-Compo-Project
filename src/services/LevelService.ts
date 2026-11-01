import apiClient from './api'
import type { Level, LevelUpdatePayload } from '@/types'

export default {
  list() {
    return apiClient.get<Level[]>('/levels')
  },
  update(level: number, payload: LevelUpdatePayload) {
    return apiClient.put<Level>(`/admin/levels/${level}`, payload)
  },
}
