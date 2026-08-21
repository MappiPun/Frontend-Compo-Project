import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { mockUsers } from '@/mock/data'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  function login(username: string) {
    const trimmed = username.trim().toLowerCase()
    if (trimmed === 'admin') {
      currentUser.value = mockUsers.find((u) => u.username === 'admin') || null
      return 'admin'
    } else if (trimmed === 'user2') {
      currentUser.value = mockUsers.find((u) => u.username === 'user2') || null
      return 'user'
    } else {

      currentUser.value = mockUsers.find((u) => u.username === 'user1') || null
      return 'user'
    }
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    login,
    logout
  }
})