<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/services/api'
import type { User } from '@/types'

const route = useRoute()
const authStore = useAuthStore()

const props = defineProps<{ id: string }>()
const user = ref<User | null>(null)

onMounted(async () => {
  try {
    const res = await apiClient.get<User>(`/users/${props.id}`)
    user.value = res.data
  } catch (error) {
    console.error('Fetch user detail error:', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <header class="max-w-5xl mx-auto flex justify-between items-center mb-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-3xl font-extrabold text-slate-900">CAMT</h1>
        <h1 class="text-3xl font-extrabold text-purple-600">Passport</h1>
      </div>

      <div class="flex items-center gap-3 bg-white px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm">
        <div class="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold">
          Pic
        </div>
        <div class="text-xs">
          <p class="font-bold text-slate-800">{{ authStore.currentUser?.name || authStore.currentUser?.username }}</p>
          <a href="#" class="text-slate-400 text-[10px] hover:underline">View profile</a>
        </div>
        <button
          @click="authStore.logout(); $router.push('/login')"
          class="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm min-h-125">
      <div class="border border-slate-300 rounded-full px-6 py-1.5 mb-8 inline-flex items-center space-x-3 text-sm font-semibold">
        <RouterLink
          :to="`/users/${props.id}`"
          :class="route.name === 'user-detail' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'"
        >
          [Details]
        </RouterLink>
        <span class="text-slate-300">|</span>
        <RouterLink
          :to="`/users/${props.id}/history`"
          :class="route.name === 'user-detail-history' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'"
        >
          [Exam History]
        </RouterLink>
        <span class="text-slate-300">|</span>
        <span class="text-slate-400 cursor-not-allowed">[Badges]</span>
      </div>

      <RouterView :user="user" />
    </main>
  </div>
</template>