import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, ExamHistory } from '@/types'
import { apiClient } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const savedUser = localStorage.getItem('currentUser')
  const currentUser = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)

  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function setUser(user: User | null) {
    currentUser.value = user
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }

  async function fetchUsers() {
    try {
      const response = await apiClient.get<User[]>('/users')
      return response.data
    } catch (error) {
      console.error('Fetch users error:', error)
      return []
    }
  }

  async function login(username: string) {
    const trimmed = username.trim().toLowerCase()
    try {
      const response = await apiClient.get<User[]>(`/users?username=${trimmed}`)
      const user = response.data[0]

      if (!user) {
        return { success: false, reason: 'not-found' as const }
      }

      if (!user.isActive) {
        return { success: false, reason: 'deactivated' as const }
      }

      setUser(user)
      return { success: true, reason: null }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, reason: 'not-found' as const }
    }
  }

  async function register(userData: {
    username: string
    name: string
    surname: string
    email: string
    phonenumber?: string
    province?: string
    password?: string
  }) {
    const trimmedUser = userData.username.trim()
    const newUser: Partial<User> = {
      username: trimmedUser,
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      phonenumber: userData.phonenumber || '',
      province: userData.province || 'Bangkok',
      role: 'user',
      level: 1,
      isActive: true,
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${trimmedUser}`,
      examHistory: []
    }

    try {
      const response = await apiClient.post<User>('/users', newUser)
      if (response.data) {
        setUser(response.data)
      }
      return response.data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  async function updateProfile(username: string, updatedData: Partial<User>) {
    try {
      const lookup = await apiClient.get<User[]>(`/users?username=${encodeURIComponent(username)}`)
      const user = lookup.data[0]
      if (!user) throw new Error('User not found')

      const response = await apiClient.patch<User>(`/users/${user.id}`, updatedData)
      if (currentUser.value?.username === username) {
        const mergedUser = { ...currentUser.value, ...response.data }
        setUser(mergedUser)
      }
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // ปรับประเภทข้อมูลใน addExamHistory ให้ยืดหยุ่นรองรับทุก Field จาก UI Component
  async function addExamHistory(examResult: {
    id?: string
    level?: number
    title?: string
    examTitle?: string
    score: number
    totalQuestions?: number
    passed: boolean
    attemptedAt?: string
    date?: string
  }) {
    if (!currentUser.value) return

    const currentHistory = currentUser.value.examHistory || []
    const updatedHistory = [...currentHistory, examResult]

    try {
      const response = await apiClient.patch<User>(`/users/${currentUser.value.id}`, {
        examHistory: updatedHistory
      })
      if (response.data) {
        setUser(response.data)
      }
      return response.data
    } catch (error) {
      console.error('Add exam history error:', error)
      throw error
    }
  }

  function logout() {
    setUser(null) 
  }

  return {
    currentUser,
    isAdmin,
    setUser,
    fetchUsers,
    login,
    register,
    updateProfile,
    addExamHistory,
    logout
  }
})