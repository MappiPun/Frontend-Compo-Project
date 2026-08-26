<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="max-w-5xl mx-auto flex justify-between items-center mb-6">
    <div class="flex items-baseline gap-2">
      <h1 class="text-3xl font-extrabold text-slate-900">CAMT</h1>
      <h1 class="text-3xl font-extrabold text-purple-600">Passport Admin</h1>
    </div>

    <div v-if="authStore.currentUser" class="flex items-center gap-3 bg-white px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm">
      <img
        :src="authStore.currentUser.profileImage"
        :alt="authStore.currentUser.name || authStore.currentUser.username"
        class="w-8 h-8 rounded-full border border-slate-200 object-cover"
      />
      <div class="text-xs text-left">
        <p class="font-bold text-slate-800">{{ authStore.currentUser.name || authStore.currentUser.username }}</p>
        <RouterLink
          to="/users/profile"
          class="text-slate-400 text-[10px] hover:text-purple-600 hover:underline"
        >
          View profile
        </RouterLink>
      </div>
      <button
        @click="handleLogout"
        class="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg"
      >
        Sign Out
      </button>
    </div>
  </header>
</template>
