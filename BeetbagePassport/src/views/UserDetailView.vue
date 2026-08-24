<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
import { apiClient } from '@/services/api'
import type { User } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const user = ref<User | null>(null)

onMounted(async () => {
  const username = typeof route.query.username === 'string' ? route.query.username : authStore.currentUser?.username
  if (!username) return

  try {
    const res = await apiClient.get<User[]>(`/users?username=${encodeURIComponent(username)}`)
    user.value = res.data[0] ?? authStore.currentUser
  } catch (error) {
    console.error('Fetch user detail error:', error)
    user.value = authStore.currentUser
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm min-h-125">
      <div class="border border-slate-300 rounded-full px-6 py-1.5 mb-8 inline-flex items-center space-x-3 text-sm font-semibold">
        <RouterLink :to="'/users/profile'" :class="route.name === 'user-detail' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[Details]</RouterLink>
        <span class="text-slate-300">|</span>
        <RouterLink :to="'/users/profile/history'" :class="route.name === 'user-detail-history' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[Exam History]</RouterLink>
        <span class="text-slate-300">|</span>
        <RouterLink :to="'/users/profile/badges'" :class="route.name === 'user-detail-badges' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[Badges]</RouterLink>
      </div>

      <RouterView :user="user" :history="user?.examHistory ?? []" />
    </main>
  </div>
</template>