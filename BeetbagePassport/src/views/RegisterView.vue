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
          <label class="block text-xs text-slate-500 mb-1">Username</label>
          <input v-model="form.username" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs text-slate-500 mb-1">First Name</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Surname</label>
            <input v-model="form.surname" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Phone Number</label>
          <input v-model="form.phonenumber" type="text" class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>

        <div>
          <label class="block text-xs text-slate-500 mb-1">Password</label>
          <input v-model="form.password" type="password" required class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>

        <div v-if="errorMsg" class="text-xs text-red-600 font-medium pt-1">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow-md transition text-sm mt-4 disabled:opacity-50"
        >
          {{ isLoading ? 'Creating Account...' : 'Register' }}
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