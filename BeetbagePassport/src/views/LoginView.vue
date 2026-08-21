<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const errorMsg = ref('')
const authStore = useAuthStore()
const router = useRouter()

function handleLogin() {
  if (!username.value.trim()) {
    errorMsg.value = 'Please enter a username'
    return
  }

  const role = authStore.login(username.value)
  if (role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/user')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">CAMT Passport</h1>
        <p class="text-xs text-slate-500 mt-1">Sign in to access your dashboard and eLearning</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Username</label>
          <input 
            v-model="username"
            type="text" 
            placeholder="e.g. admin, user1, user2"
            class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <p v-if="errorMsg" class="text-xs text-red-500 font-medium">{{ errorMsg }}</p>

        <button 
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          Sign In
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        <p class="font-medium text-slate-500 mb-1">Quick Test Logins:</p>
        <div class="flex justify-center space-x-2">
          <button @click="username = 'admin'" class="underline hover:text-indigo-600">admin</button>
          <span>•</span>
          <button @click="username = 'user1'" class="underline hover:text-indigo-600">user1</button>
          <span>•</span>
          <button @click="username = 'user2'" class="underline hover:text-indigo-600">user2</button>
        </div>
      </div>
    </div>
  </div>
</template>