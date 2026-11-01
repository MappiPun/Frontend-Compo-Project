import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import AuthService from '@/services/AuthService'
import { TOKEN_KEY } from '@/services/api'
import type { RegisterPayload, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)
  /** true after the saved login has been checked with the backend (done once, when the app starts) */
  const ready = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const level = computed(() => user.value?.level ?? 1)

  function setSession(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    ready.value = true
  }

  async function login(username: string, password: string) {
    const response = await AuthService.login(username, password)
    setSession(response.data.jwtToken, response.data.user)
    return response.data.user
  }

  /** the new user is logged in right after registering (Level 1) */
  async function register(payload: RegisterPayload) {
    const response = await AuthService.register(payload)
    setSession(response.data.jwtToken, response.data.user)
    return response.data.user
  }

  /** keeps the login after the page is reloaded: the token is in localStorage, the user comes from the backend */
  async function restore() {
    if (ready.value) return
    if (token.value) {
      try {
        user.value = (await AuthService.me()).data
      } catch {
        logout()
      }
    }
    ready.value = true
  }

  /** reloads the logged in user (e.g. the level may have been changed) */
  async function refresh() {
    if (!token.value) return
    user.value = (await AuthService.me()).data
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    ready.value = true
  }

  return { token, user, ready, isAuthenticated, isAdmin, level, login, register, restore, refresh, setUser, logout }
})
