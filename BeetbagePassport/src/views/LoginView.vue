<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isSignUp = ref(false)

const username = ref('')
const password = ref('')

const errorMessage = ref('')
const usernameError = ref('')

async function handleLogin() {
  errorMessage.value = ''
  if (!username.value) {
    errorMessage.value = "Error: this account doesn't exist"
    return
  }

  const success = await authStore.login(username.value)
  if (success && authStore.currentUser) {
    if (!authStore.currentUser.name || !authStore.currentUser.surname) {
      router.push(`/users/${authStore.currentUser.id}/edit`)
    } else if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push(`/users/${authStore.currentUser.id}`)
    }
  } else {
    errorMessage.value = "Error: this account doesn't exist or is inactive"
  }
}

async function handleSignUp() {
  usernameError.value = ''

  if (!username.value.trim()) {
    usernameError.value = 'Please enter a username'
    return
  }

  try {
    // เช็คว่า Username ซ้ำใน db.json หรือไม่
    const existingUsers = await authStore.fetchUsers()
    const isTaken = existingUsers.some(
      (u) => u.username.toLowerCase() === username.value.trim().toLowerCase()
    )

    if (isTaken) {
      usernameError.value = 'Error: this username has already been taken'
      return
    }

    await authStore.register(username.value)
    alert('Sign up successful! Please sign in to complete your profile.')
    isSignUp.value = false
    password.value = ''
  } catch {
    usernameError.value = 'Sign up failed. Please try again.'
  }
}

function toggleMode() {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  usernameError.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#f0f0f4] flex items-center justify-center p-4">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-300 p-10">
      
      <form v-if="!isSignUp" @submit.prevent="handleLogin" class="space-y-4">
        <h1 class="text-4xl font-bold text-slate-900 mb-6">Welcome</h1>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter your username (Hint: admin, user1, user2)</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter your password</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
              </svg>
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="text-xs font-semibold text-red-500 pt-1">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full py-3 bg-[#8257e5] hover:bg-[#7143df] text-white font-semibold rounded-md shadow transition-colors mt-2 cursor-pointer"
        >
          Sign In
        </button>

        <p class="text-xs text-slate-500 pt-2">
          Don't have an account?
          <button type="button" @click="toggleMode" class="text-indigo-600 hover:underline font-medium cursor-pointer">
            Sign up!
          </button>
        </p>
      </form>

      <form v-else @submit.prevent="handleSignUp" class="space-y-4">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">Sign Up</h1>

        <!-- Username -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-slate-500">Enter your username</label>
            <span v-if="usernameError" class="text-xs text-red-500 font-semibold">{{ usernameError }}</span>
          </div>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              required
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter your password</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
              </svg>
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              required
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-[#8257e5] hover:bg-[#7143df] text-white font-semibold rounded-md shadow transition-colors mt-4 cursor-pointer"
        >
          Sign Up
        </button>

        <p class="text-xs text-slate-500 pt-1 text-center">
          Already have an account?
          <button type="button" @click="toggleMode" class="text-indigo-600 hover:underline font-medium cursor-pointer">
            Sign in
          </button>
        </p>
      </form>

    </div>
  </div>
</template>