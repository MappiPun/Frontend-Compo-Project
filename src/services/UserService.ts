import apiClient from './api'
import type { ExamHistory, User, UserFilters, UserUpdatePayload } from '@/types'

export default {
  // ----- admin
  /** the pagination and the filters are done in the backend; the total is in the x-total-count header */
  list(filters: UserFilters) {
    const params: Record<string, string | number> = { page: filters.page, size: filters.size }
    if (filters.q) params.q = filters.q
    if (filters.level) params.level = filters.level
    if (filters.province) params.province = filters.province
    return apiClient.get<User[]>('/admin/users', { params })
  },
  provinces() {
    return apiClient.get<string[]>('/admin/provinces')
  },
  get(id: number) {
    return apiClient.get<User>(`/admin/users/${id}`)
  },
  update(id: number, payload: UserUpdatePayload) {
    return apiClient.put<User>(`/admin/users/${id}`, payload)
  },
  setActive(id: number, active: boolean) {
    return apiClient.patch<User>(`/admin/users/${id}/status`, { active })
  },
  examHistory(id: number) {
    return apiClient.get<ExamHistory[]>(`/admin/users/${id}/exam-history`)
  },
  // ----- me
  updateMe(payload: UserUpdatePayload) {
    return apiClient.put<User>('/users/me', payload)
  },
  myExamHistory() {
    return apiClient.get<ExamHistory[]>('/users/me/exam-history')
  },
}
