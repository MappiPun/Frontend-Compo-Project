export interface Benefit {
  id: string
  description: string
}

export interface Service {
  id: string
  name: string
  badge: string
  description: string
}

export interface Level {
  level: number
  title: string
  passCriteriaPercentage: number // เช่น 70 (%)
  benefits: Benefit[]
  services: Service[]
}

export interface Question {
  id: string
  level: number
  question: string
  options: string[]
  correctAnswerIndex: number
}

export interface ExamHistory {
  id: string
  userId: string
  level: number
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  attemptedAt: string // ISO Date String
}

export interface User {
  id: string
  username: string
  name: string
  surname: string
  profileImage: string
  currentLevel: number
  isActive: boolean
  province: string
  examHistory: ExamHistory[]
}