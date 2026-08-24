import { defineStore } from 'pinia'
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

  async function toggleUserStatus(userId: string) {
    const target = users.value.find((u: User) => u.id === userId)
    if (target) {
      const response = await apiClient.patch<User>(`/users/${userId}`, {
        isActive: !target.isActive
      })
      Object.assign(target, response.data)
    }
  }

  async function updateUserProfile(userId: string, updatedData: Partial<User>) {
    const target = users.value.find((u: User) => u.id === userId)
    if (target) {
      const response = await apiClient.patch<User>(`/users/${userId}`, updatedData)
      Object.assign(target, response.data)
    }
  }

  async function recordExamResult(userId: string, score: number, total: number, passed: boolean) {
    const target = users.value.find((u: User) => u.id === userId)
    if (!target) return

    const currentLvl = target.level ?? target.currentLevel ?? 1

    const newHistory: ExamHistory = {
      id: `h-${Date.now()}`,
      level: currentLvl,
      score,
      totalQuestions: total,
      passed,
      attemptedAt: new Date().toISOString()
    }

    if (!target.examHistory) {
      target.examHistory = []
    }
    target.examHistory.unshift(newHistory)

    if (passed && currentLvl < 4) {
      const nextLevel = currentLvl + 1
      target.level = nextLevel
      target.currentLevel = nextLevel
    }

    await apiClient.patch<User>(`/users/${userId}`, {
      examHistory: target.examHistory,
      level: target.level,
      currentLevel: target.currentLevel
    })
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