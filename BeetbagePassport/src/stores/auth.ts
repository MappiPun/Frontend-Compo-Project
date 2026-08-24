import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { mockUsers } from '@/mock/data'

export const useAuthStore = defineStore('auth', () => {
  const savedUsers = localStorage.getItem('app_users')
  const users = ref<User[]>(savedUsers ? JSON.parse(savedUsers) : [...mockUsers])

  const currentUser = ref<User | null>(null)

  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(username: string) {
    const trimmed = username.trim().toLowerCase()
    const user = users.value.find((u) => u.username.toLowerCase() === trimmed)

    if (user && user.isActive) {
      currentUser.value = user
      return true
    }
    return false
  }

  function register(newUser: Omit<User, 'id' | 'role' | 'level' | 'isActive' | 'examHistory'>) {
    const createdUser: User = {
      ...newUser,
      id: `u${users.value.length + 1}`,
      role: 'user',
      level: 1,
      isActive: true,
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${newUser.username}`,
      examHistory: []
    }

    users.value.push(createdUser)
    localStorage.setItem('app_users', JSON.stringify(users.value))
    return createdUser
  }

  function logout() {
    currentUser.value = null
  }

  return {
    users,
    currentUser,
    isAdmin,
    login,
    register,
    logout
  }
})