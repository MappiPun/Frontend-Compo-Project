import apiClient from './api'
import type { Question, QuestionPayload } from '@/types'

export default {
  list(level?: number) {
    return apiClient.get<Question[]>('/admin/questions', { params: level ? { level } : {} })
  },
  get(id: number) {
    return apiClient.get<Question>(`/admin/questions/${id}`)
  },
  create(payload: QuestionPayload) {
    return apiClient.post<Question>('/admin/questions', payload)
  },
  update(id: number, payload: QuestionPayload) {
    return apiClient.put<Question>(`/admin/questions/${id}`, payload)
  },
  remove(id: number) {
    return apiClient.delete(`/admin/questions/${id}`)
  },
}
