export interface ExamHistory {
  id: string
  userId?: string
  level: number
  score: number
  totalQuestions: number
  percentage?: number
  passed: boolean
  attemptedAt: string
}

export interface User {
  id: string
  username: string
  name: string
  surname: string
  email: string
  phone?: string
  province: string
  role: 'admin' | 'user'
  level: number         
  currentLevel?: number 
  isActive: boolean
  profileImage: string
  examHistory: ExamHistory[]
}

export interface Benefit {
  id: string
  description: string
}

export interface Service {
  id: string
  name: string
  badge?: string
  description: string
}

export interface LevelDetail {
  level: number
  title: string
  description?: string
  passScore: number
  benefits: Benefit[]
  services: Service[]
}

export type Level = LevelDetail

export interface Question {
  id: string
  level: number
  questionText: string
  options: string[]
  correctAnswer: number
}