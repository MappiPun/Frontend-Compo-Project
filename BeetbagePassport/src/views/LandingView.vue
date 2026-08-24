<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!username.value.trim()) {
    errorMsg.value = "Error: this account [has been deactivated/doesn't exist]"
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const trimmedUser = username.value.trim()
    
    if (trimmedUser.toLowerCase() === 'admin') {
      await authStore.login('admin')
      router.push('/admin')
    } else {
      const success = await authStore.login(trimmedUser)
      if (success) {
        router.push('/users/profile')
      } else {
        errorMsg.value = "Error: this account [has been deactivated/doesn't exist]"
      }
    }
  } catch {
    errorMsg.value = "Error: this account [has been deactivated/doesn't exist]"
  } finally {
    isLoading.value = false
  }
}

function quickLogin(user: string) {
  username.value = user
  handleLogin()
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between">
    <!-- Header Navigation -->
    <header class="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2">
        <span class="text-2xl font-black text-slate-900 tracking-tight">CAMT <span class="text-purple-600">Passport</span></span>
      </div>
      <a href="#login-card" class="text-sm font-semibold text-purple-600 hover:text-purple-800 transition">
        Sign In →
      </a>
    </header>

    <!-- Main Content Grid -->
    <main class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center grow">
      <!-- Left Column: Service Details & Features -->
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Digital Learning & Assessment Platform
        </div>
        
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Upgrade your skill levels & unlock exclusive services.
        </h1>
        
        <p class="text-slate-600 text-base md:text-lg leading-relaxed">
          ระบบ CAMT Passport ให้คุณเข้าถึงการเรียนรู้ผ่าน eLearning ทำแบบทดสอบเพื่ออัปเกรดระดับบริการตั้งแต่ Level 1 ถึง Level 4 พร้อมรับตราสัญลักษณ์และสิทธิประโยชน์มากมาย
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div class="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <span class="block text-xs font-bold text-slate-400">LEVEL 1</span>
            <span class="text-sm font-bold text-slate-700">Basic Access</span>
          </div>
          <div class="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <span class="block text-xs font-bold text-slate-400">LEVEL 2</span>
            <span class="text-sm font-bold text-slate-700">Intermediate</span>
          </div>
          <div class="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <span class="block text-xs font-bold text-slate-400">LEVEL 3</span>
            <span class="text-sm font-bold text-slate-700">Advanced</span>
          </div>
          <div class="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <span class="block text-xs font-bold text-purple-600">LEVEL 4</span>
            <span class="text-sm font-bold text-purple-600">Expert VIP</span>
          </div>
        </div>
      </div>

      <div id="login-card" class="lg:col-span-5 flex justify-center">
        <div class="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-300 p-8">
          <h2 class="text-3xl font-extrabold text-slate-900 mb-6">Welcome</h2>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs text-slate-500 mb-1">
                Enter your username (Hint: admin, user1, user2)
              </label>
              <div class="relative flex items-center">
                <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  v-model="username"
                  type="text"
                  placeholder="Username"
                  class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-xs text-slate-500 mb-1">
                Enter your password
              </label>
              <div class="relative flex items-center">
                <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Password"
                  class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            <div v-if="errorMsg" class="text-xs text-red-600 font-medium pt-1">
              {{ errorMsg }}
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow-md transition duration-150 text-base disabled:opacity-50 mt-2"
            >
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-slate-100">
            <p class="text-[11px] text-slate-400 mb-2 font-medium">Quick Login:</p>
            <div class="flex gap-2">
              <button
                @click="quickLogin('user1')"
                class="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition"
              >
                user1
              </button>
              <button
                @click="quickLogin('user2')"
                class="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition"
              >
                user2
              </button>
              <button
                @click="quickLogin('admin')"
                class="flex-1 py-1 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium rounded transition"
              >
                admin
              </button>
            </div>
          </div>

          <div class="mt-4 text-xs text-slate-500">
            Don't have an account? 
            <router-link to="/register" class="text-purple-600 font-semibold hover:underline">
              Sign up!
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
      © 2026 CAMT Passport - SE331 Term Project
    </footer>
  </div>
</template>