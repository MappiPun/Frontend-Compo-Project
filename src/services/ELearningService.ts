import apiClient from './api'
import type { ELearning, ELearningPayload } from '@/types'

export default {
  /** user: only the content of the current level */
  mine() {
    return apiClient.get<ELearning[]>('/elearning')
  },
  // ----- admin
  list(level?: number) {
    return apiClient.get<ELearning[]>('/admin/elearning', { params: level ? { level } : {} })
  },
  create(payload: ELearningPayload) {
    return apiClient.post<ELearning>('/admin/elearning', payload)
  },
  update(id: number, payload: ELearningPayload) {
    return apiClient.put<ELearning>(`/admin/elearning/${id}`, payload)
  },
  remove(id: number) {
    return apiClient.delete(`/admin/elearning/${id}`)
  },
}
