import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LevelDetail, Question, ExamHistory } from '@/types'
import { mockUsers, mockLevels, mockQuestions } from '@/mock/data'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([...mockUsers])
  const levels = ref<LevelDetail[]>([...mockLevels])
  const questions = ref<Question[]>([...mockQuestions])

  function getUserById(id: string) {
    return users.value.find((u) => u.id === id)
  }

  function toggleUserStatus(userId: string) {
    const target = users.value.find((u) => u.id === userId)
    if (target) {
      target.isActive = !target.isActive
    }
  }

  function updateUserProfile(userId: string, updatedData: Partial<User>) {
    const target = users.value.find((u) => u.id === userId)
    if (target) {
      Object.assign(target, updatedData)
    }
  }

  function recordExamResult(userId: string, score: number, total: number, passed: boolean) {
    const target = users.value.find((u) => u.id === userId)
    if (!target) return

    const newHistory: ExamHistory = {
      id: `h-${Date.now()}`,
      level: target.level,
      score,
      totalQuestions: total,
      passed,
      attemptedAt: new Date().toISOString()
    }

    target.examHistory.unshift(newHistory)

    // Upgrade level immediately if passed and level < 4
    if (passed && target.level < 4) {
      target.level += 1
    }
  }

  function getLevelDetail(levelNumber: number) {
    return levels.value.find((l) => l.level === levelNumber)
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