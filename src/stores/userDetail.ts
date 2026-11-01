import { defineStore } from 'pinia'
import { ref } from 'vue'
import UserService from '@/services/UserService'
import type { ExamHistory, User, UserUpdatePayload } from '@/types'

/**
 * The data of the user which the admin is looking at.
 * The layout of the user detail page loads it once, and the sub routes (info / level / edit) share it.
 */
export const useUserDetailStore = defineStore('userDetail', () => {
  const user = ref<User | null>(null)
  const history = ref<ExamHistory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(id: number) {
    loading.value = true
    error.value = null
    try {
      const [u, h] = await Promise.all([UserService.get(id), UserService.examHistory(id)])
      user.value = u.data
      history.value = h.data
    } catch {
      user.value = null
      history.value = []
      error.value = 'User not found'
    } finally {
      loading.value = false
    }
  }

  async function save(payload: UserUpdatePayload) {
    if (!user.value) return
    user.value = (await UserService.update(user.value.id, payload)).data
  }

  async function setActive(active: boolean) {
    if (!user.value) return
    user.value = (await UserService.setActive(user.value.id, active)).data
  }

  function clear() {
    user.value = null
    history.value = []
    error.value = null
  }

  return { user, history, loading, error, load, save, setActive, clear }
})
