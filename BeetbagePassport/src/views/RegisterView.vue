<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  name: '',
  surname: '',
  email: '',
  phonenumber: '',
  province: 'Bangkok',
  password: ''
})

const isLoading = ref(false)
const errorMsg = ref('')

async function handleRegister() {
  if (!form.value.username.trim()) {
    errorMsg.value = 'Please enter username'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    await authStore.register({
      username: form.value.username,
      name: form.value.name,
      surname: form.value.surname,
      email: form.value.email,
      phonenumber: form.value.phonenumber,
      province: form.value.province,
      password: form.value.password
    })

    alert('Register successful!')
    router.push('/users/profile')
  } catch (error) {
    console.error(error)
    errorMsg.value = 'Failed to register. Username might already exist.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-300 p-8">
      <h2 class="text-2xl font-extrabold text-slate-900 mb-6 text-center">Create Account</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter Username</label>
          <div class="relative flex items-center">
            <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <input v-model="form.username" type="text" required placeholder="Enter Username" class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400" />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs text-slate-500 mb-1">Enter Your First Name</label>
            <div class="relative flex items-center">
              <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.121 2.121 0 10-3-3L5 17v3z" /></svg>
              <input v-model="form.name" type="text" required placeholder="Enter Your First Name" class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Enter Your Surname</label>
            <div class="relative flex items-center">
              <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.121 2.121 0 10-3-3L5 17v3z" /></svg>
              <input v-model="form.surname" type="text" required placeholder="Enter Your Surname" class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter Email</label>
          <div class="relative flex items-center">
            <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <input v-model="form.email" type="email" required placeholder="Enter Email" class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400" />
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter Phone Number</label>
          <div class="relative flex items-center">
            <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2" stroke-width="2" /><path stroke-linecap="round" stroke-width="2" d="M10 18h4" /></svg>
            <input v-model="form.phonenumber" type="text" placeholder="Enter Phone Number" class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400" />
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Enter Password</label>
          <div class="relative flex items-center">
            <svg class="w-5 h-5 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            <input v-model="form.password" type="password" required placeholder="Enter Password" class="w-full pl-10 pr-3 py-2 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-700 placeholder-slate-400" />
          </div>
        </div>

        <div v-if="errorMsg" class="text-xs text-red-600 font-medium pt-1">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow-md transition text-sm mt-4 disabled:opacity-50"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="mt-4 text-xs text-center text-slate-500">
        Already have an account? 
        <router-link to="/" class="text-purple-600 font-semibold hover:underline">
          Sign in!
        </router-link>
      </div>
    </div>
  </div>
</template>