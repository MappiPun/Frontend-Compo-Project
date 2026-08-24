<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isSignUp = ref(false)

// Form Fields
const username = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const province = ref('')
const email = ref('')
const phone = ref('')

// Error States
const errorMessage = ref('')
const usernameError = ref('')
const emailError = ref('')
const phoneError = ref('')

function handleLogin() {
  errorMessage.value = ''
  if (!username.value) {
    errorMessage.value = 'Error: this account [has been deactivated/doesn\'t exist]'
    return
  }
  
  const success = authStore.login(username.value)
  if (success) {
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push(`/users/${authStore.currentUser?.id}`)
    }
  } else {
    errorMessage.value = 'Error: this account [has been deactivated/doesn\'t exist]'
  }
}

function handleSignUp() {
  usernameError.value = ''
  emailError.value = ''
  phoneError.value = ''

  let hasError = false
  if (username.value === 'admin' || username.value === 'user1') {
    usernameError.value = 'Error: this username has already been taken'
    hasError = true
  }
  if (email.value) {
    emailError.value = 'Error: this email is already in use'
    hasError = true
  }
  if (phone.value) {
    phoneError.value = 'Error: this phone number is already in use'
    hasError = true
  }

  if (!hasError) {
    alert('Sign up successful!')
    isSignUp.value = false
  }
}

function toggleMode() {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  usernameError.value = ''
  emailError.value = ''
  phoneError.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#f0f0f4] flex items-center justify-center p-4">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-300 p-10">
      
      <!-- ================= SIGN IN FORM ================= -->
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
          class="w-full py-3 bg-[#8257e5] hover:bg-[#7143df] text-white font-semibold rounded-md shadow transition-colors mt-2"
        >
          Sign In
        </button>

        <p class="text-xs text-slate-500 pt-2">
          Don't have an account?
          <button type="button" @click="toggleMode" class="text-indigo-600 hover:underline font-medium">
            Sign up!
          </button>
        </p>
      </form>

      <!-- ================= SIGN UP FORM ================= -->
      <form v-else @submit.prevent="handleSignUp" class="space-y-3">
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
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <!-- First Name -->
        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter your first name</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
            <input
              v-model="firstName"
              type="text"
              placeholder="First name"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter your last name</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
            <input
              v-model="lastName"
              type="text"
              placeholder="Last Name"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <!-- Province -->
        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter your province</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <input
              v-model="province"
              type="text"
              placeholder="Province"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-slate-500">Enter your contact email (optional)</label>
            <span v-if="emailError" class="text-xs text-red-500 font-semibold">{{ emailError }}</span>
          </div>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <!-- Phone Number -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-xs text-slate-500">Enter your phone number (optional)</label>
            <span v-if="phoneError" class="text-xs text-red-500 font-semibold">{{ phoneError }}</span>
          </div>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="phone"
              type="text"
              placeholder="Phone Number"
              class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-[#8257e5] hover:bg-[#7143df] text-white font-semibold rounded-md shadow transition-colors mt-4"
        >
          Sign Up
        </button>

        <p class="text-xs text-slate-500 pt-1 text-center">
          Already have an account?
          <button type="button" @click="toggleMode" class="text-indigo-600 hover:underline font-medium">
            Sign in
          </button>
        </p>
      </form>

    </div>
  </div>
</template>