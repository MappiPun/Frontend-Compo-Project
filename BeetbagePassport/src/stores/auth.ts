import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
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

      if (user && user.isActive) {
        setUser(user) 
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  async function register(username: string) {
    const trimmed = username.trim()
    const newUser: Partial<User> = {
      username: trimmed,
      name: '',
      surname: '',
      email: `${trimmed}@example.com`,
      province: '',
      role: 'user',
      level: 1,
      isActive: true,
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${trimmed}`,
      examHistory: []
    }

    try {
      const response = await apiClient.post<User>('/users', newUser)
      return response.data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  async function updateProfile(userId: string, updatedData: Partial<User>) {
    try {
      const response = await apiClient.patch<User>(`/users/${userId}`, updatedData)
      if (currentUser.value && currentUser.value.id === userId) {
        const mergedUser = { ...currentUser.value, ...response.data }
        setUser(mergedUser)
      }
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
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
    logout
  }
})