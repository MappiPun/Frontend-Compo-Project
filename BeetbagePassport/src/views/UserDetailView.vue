<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/services/api'
import type { User } from '@/types'

const props = defineProps<{
  id: string
}>()

const authStore = useAuthStore()
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
  <div class="min-h-screen bg-slate-50 p-6">
    <header class="max-w-6xl mx-auto flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-900">User Details</h1>

      <div class="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
        <img
          :src="authStore.currentUser?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'"
          alt="Avatar"
          class="w-10 h-10 rounded-full bg-slate-100"
        />
        <div class="text-xs">
          <span class="font-semibold text-indigo-600">Level {{ authStore.currentUser?.level || 1 }}</span>
          <span class="text-slate-400"> • </span>
          <span class="uppercase text-slate-500 font-bold">{{ authStore.currentUser?.role }}</span>
        </div>
        <button
          @click="authStore.logout(); $router.push('/login')"
          class="text-xs text-red-500 font-medium hover:underline border border-red-200 bg-red-50 px-2.5 py-1 rounded-md cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>