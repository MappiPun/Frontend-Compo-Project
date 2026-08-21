<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div v-if="authStore.currentUser" class="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
    <img 
      :src="authStore.currentUser.profileImage" 
      :alt="authStore.currentUser.name"
      class="w-10 h-10 rounded-full border border-gray-200"
    />
    <div class="text-left">
      <div class="text-sm font-semibold text-gray-800">
        {{ authStore.currentUser.name }} {{ authStore.currentUser.surname }}
      </div>
      <div class="text-xs text-indigo-600 font-medium">
        Level {{ authStore.currentUser.level }} • {{ authStore.currentUser.role.toUpperCase() }}
      </div>
    </div>
    <button 
      @click="handleLogout"
      class="ml-2 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
    >
      Logout
    </button>
  </div>
</template>