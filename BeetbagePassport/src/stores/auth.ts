import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { mockUsers } from '@/mock/data'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(username: string) {
    const trimmed = username.trim().toLowerCase()
    const user = mockUsers.find((u) => u.username.toLowerCase() === trimmed)

    if (user && user.isActive) {
      currentUser.value = user
      return true
    }
    return false
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    isAdmin,
    login,
    logout
  }
})