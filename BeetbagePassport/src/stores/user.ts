import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/services/api'

export interface Benefit {
  id: string
  description: string
}

export interface Service {
  id: string
  name: string
  description: string
}

export interface Level {
  id: string
  level: number
  title: string
  passScore: number
  description?: string
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

export interface User {
  id?: string
  username: string
  name: string
  surname: string
  email?: string
  phonenumber?: string
  phone?: string
  province?: string
  level?: number
  currentLevel?: number
  role?: string
  isActive?: boolean
  profileImage?: string
  examHistory?: Array<{
    id: string
    level: number
    attemptedAt: string
    score: number
    totalQuestions: number
    passed: boolean
  }>
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const levels = ref<Level[]>([])
  const questions = ref<Question[]>([])
  const selectedUserId = ref<string | null>(null)

  const selectedUser = computed(() => {
    if (!selectedUserId.value) return null
    return users.value.find(
      (u) => u.id === selectedUserId.value || u.username === selectedUserId.value
    ) || null
  })

  async function fetchUsers() {
    try {
      const response = await apiClient.get('/users')
      users.value = response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  async function fetchLevels() {
    try {
      const response = await apiClient.get('/levels')
      levels.value = response.data
    } catch (error) {
      console.error('Failed to fetch levels:', error)
    }
  }

  async function fetchQuestions() {
    try {
      const response = await apiClient.get('/questions')
      questions.value = response.data
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    }
  }

  function getLevelDetail(levelNumber: number) {
    return levels.value.find((l) => l.level === levelNumber) || null
  }

  function setSelectedUser(id: string) {
    selectedUserId.value = id
  }

  function toggleUserStatus(userId: string | number) {
    const user = users.value.find((u) => u.id === userId || u.username === userId)
    if (user) {
      user.isActive = !user.isActive
    }
  }

  async function recordExamResult(
    username: string,
    level: number,
    score: number,
    totalQuestions: number,
    passed: boolean
  ) {
    const user = users.value.find((u) => u.username === username)
    if (user) {
      if (!user.examHistory) user.examHistory = []
      user.examHistory.push({
        id: Date.now().toString(),
        level,
        attemptedAt: new Date().toISOString(),
        score,
        totalQuestions,
        passed
      })
      if (passed && (user.level ?? 1) <= level) {
        user.level = level + 1
      }
    }
  }

  return {
    users,
    levels,
    questions,
    selectedUserId,
    selectedUser,
    fetchUsers,
    fetchLevels,
    fetchQuestions,
    getLevelDetail,
    setSelectedUser,
    toggleUserStatus,
    recordExamResult
  }
})