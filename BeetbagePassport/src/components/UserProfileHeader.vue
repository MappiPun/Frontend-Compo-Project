<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex items-center gap-3">


    <div v-if="authStore.currentUser" class="flex items-center gap-3 bg-white px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm">
      <img
        :src="authStore.currentUser.profileImage"
        :alt="authStore.currentUser.name || authStore.currentUser.username"
        class="w-8 h-8 rounded-full border border-slate-200 object-cover"
      />
      <div class="text-xs text-left">
        <p class="font-bold text-slate-800">{{ authStore.currentUser.name || authStore.currentUser.username }}</p>
        <RouterLink
          :to="'/users/profile'"
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
  </div>
</template>