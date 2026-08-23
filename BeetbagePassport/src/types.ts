export interface ExamHistory {
  id: string
  level: number
  score: number
  totalQuestions: number
  passed: boolean
  attemptedAt: string
}

export interface User {
  id: string
  username: string
  name: string
  surname: string
  email: string
  province: string
  role: 'admin' | 'user'
  level: number        // เพิ่มรองรับ .level
  currentLevel?: number // สำรองกรณีใช้ currentLevel
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
  description: string
}

export interface LevelDetail {
  level: number
  title: string
  description: string
  passScore: number
  benefits: Benefit[]
  services: Service[]
}

export interface Question {
  id: string
  level: number
  questionText: string
  options: string[]
  correctAnswer: number
}