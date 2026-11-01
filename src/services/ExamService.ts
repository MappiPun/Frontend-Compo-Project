import apiClient from './api'
import type { ExamInfo, ExamQuestion, ExamResult } from '@/types'

export default {
  info() {
    return apiClient.get<ExamInfo>('/exam/info')
  },
  questions() {
    return apiClient.get<ExamQuestion[]>('/exam/questions')
  },
  submit(answers: { questionId: number; selected: number }[]) {
    return apiClient.post<ExamResult>('/exam/submit', { answers })
  },
}
