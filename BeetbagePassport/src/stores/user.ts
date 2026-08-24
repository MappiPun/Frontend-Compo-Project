import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { ref } from 'vue'
import type { User, LevelDetail, Question, ExamHistory } from '@/types'
import { apiClient } from '@/services/api'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const levels = ref<LevelDetail[]>([])
  const questions = ref<Question[]>([])

  async function fetchData() {
    try {
      const [usersResponse, levelsResponse, questionsResponse] = await Promise.all([
        apiClient.get<User[]>('/users'),
        apiClient.get<LevelDetail[]>('/levels'),
        apiClient.get<Question[]>('/questions')
      ])
      users.value = usersResponse.data
      levels.value = levelsResponse.data
      questions.value = questionsResponse.data
    } catch (error) {
      console.error('Fetch user data error:', error)
    }
  }

  function getUserById(id: string) {
    return users.value.find((u: User) => u.id === id)
  }

  async function toggleUserStatus(username: string) {
    const target = users.value.find((u: User) => u.username === username)
    if (target) {
      const response = await apiClient.patch<User>(`/users/${target.id}`, {
        isActive: !target.isActive
      })
      Object.assign(target, response.data)
    }
  }

  async function updateUserProfile(username: string, updatedData: Partial<User>) {
    const target = users.value.find((u: User) => u.username === username)
    if (target?.id) {
      const response = await apiClient.patch<User>(`/users/${target.id}`, updatedData)
      Object.assign(target, response.data)
    }
  }

  async function recordExamResult(username: string, examLevel: number, score: number, total: number, passed: boolean) {
    const target = users.value.find((u: User) => u.username === username)
    if (!target?.id) return

    const currentLvl = target.level ?? target.currentLevel ?? 1
    const newHistory: ExamHistory = {
      id: `h-${Date.now()}`,
      level: examLevel,
      score,
      totalQuestions: total,
      passed,
      attemptedAt: new Date().toISOString()
    }

    const updatedHistory = [newHistory, ...(target.examHistory ?? [])]
    const updatedLevel = passed && examLevel === currentLvl && currentLvl < 4
      ? Math.min(currentLvl + 1, 4)
      : currentLvl

    try {
      const response = await apiClient.patch<User>(`/users/${target.id}`, {
        examHistory: updatedHistory,
        level: updatedLevel
      })

      Object.assign(target, response.data)

      // Keep the authenticated user's cached copy in sync immediately.
      const authStore = useAuthStore()
      if (authStore.currentUser?.id === response.data.id) {
        authStore.setUser(response.data)
      }
    } catch (error) {
      console.error('Record exam result error:', error)
      throw error
    }
  }

  function getLevelDetail(levelNumber: number) {
    return levels.value.find((l: LevelDetail) => l.level === levelNumber)
  }

  fetchData()

  return {
    users,
    levels,
    questions,
    fetchData,
    getUserById,
    toggleUserStatus,
    updateUserProfile,
    recordExamResult,
    getLevelDetail
  }
})