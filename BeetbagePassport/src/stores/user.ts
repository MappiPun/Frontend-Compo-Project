import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LevelDetail, Question, ExamHistory } from '@/types'
import { mockUsers, mockLevels, mockQuestions } from '@/mock/data'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([...mockUsers])
  const levels = ref<LevelDetail[]>([...mockLevels])
  const questions = ref<Question[]>([...mockQuestions])

  function getUserById(id: string) {
    return users.value.find((u: User) => u.id === id)
  }

  function toggleUserStatus(userId: string) {
    const target = users.value.find((u: User) => u.id === userId)
    if (target) {
      target.isActive = !target.isActive
    }
  }

  function updateUserProfile(userId: string, updatedData: Partial<User>) {
    const target = users.value.find((u: User) => u.id === userId)
    if (target) {
      Object.assign(target, updatedData)
    }
  }

  function recordExamResult(userId: string, score: number, total: number, passed: boolean) {
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
  }

  function getLevelDetail(levelNumber: number) {
    return levels.value.find((l: LevelDetail) => l.level === levelNumber)
  }

  return {
    users,
    levels,
    questions,
    getUserById,
    toggleUserStatus,
    updateUserProfile,
    recordExamResult,
    getLevelDetail
  }
})