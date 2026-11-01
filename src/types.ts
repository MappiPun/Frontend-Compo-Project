export type Role = 'admin' | 'user'

export interface User {
  id: number
  username: string
  name: string
  surname: string
  email: string
  phone: string | null
  province: string | null
  role: Role
  level: number
  active: boolean
  profileImage: string | null
}

export interface AuthResponse {
  jwtToken: string
  user: User
}

export interface RegisterPayload {
  username: string
  password: string
  name: string
  surname: string
  email: string
  phone: string
  province: string
  profileImage: string
}

export interface UserUpdatePayload {
  name: string
  surname: string
  email: string
  phone: string
  province: string
  profileImage: string
  level?: number
}

export interface UserFilters {
  q: string
  level: number | null
  province: string
  page: number
  size: number
}

export interface Benefit {
  id?: number
  description: string
}

export interface ServiceItem {
  id?: number
  name: string
  badge: string | null
  description: string | null
}

export interface Level {
  id: number
  level: number
  title: string
  description: string | null
  passScore: number
  questionCount: number
  benefits: Benefit[]
  services: ServiceItem[]
}

export interface LevelUpdatePayload {
  title: string
  description: string
  passScore: number
  benefits: { description: string }[]
  services: { name: string; badge: string; description: string }[]
}

export interface Question {
  id: number
  level: number
  questionText: string
  options: string[]
  correctAnswer: number
}

export interface QuestionPayload {
  level: number
  questionText: string
  options: string[]
  correctAnswer: number
}

export interface ExamQuestion {
  id: number
  questionText: string
  options: string[]
}

export interface ExamInfo {
  currentLevel: number
  maxLevel: number
  examLevel: number
  passScore: number
  questionCount: number
  canTakeExam: boolean
  message: string | null
}

export interface ExamHistory {
  id: number
  level: number
  score: number
  totalQuestions: number
  passed: boolean
  attemptedAt: string
  awardedLevel: number | null
}

export interface ExamResult {
  score: number
  totalQuestions: number
  passScore: number
  passed: boolean
  previousLevel: number
  newLevel: number
  attempt: ExamHistory
  user: User
}

export interface ELearning {
  id: number
  level: number
  title: string
  description: string | null
  videoUrl: string
}

export interface ELearningPayload {
  level: number
  title: string
  description: string
  videoUrl: string
}
