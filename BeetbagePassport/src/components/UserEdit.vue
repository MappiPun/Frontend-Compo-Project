<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const surname = ref('')
const email = ref('')
const phone = ref('')
const province = ref('')

const isSaving = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (authStore.currentUser) {
    name.value = authStore.currentUser.name || ''
    surname.value = authStore.currentUser.surname || ''
    email.value = authStore.currentUser.email || ''
    phone.value = authStore.currentUser.phone || ''
    province.value = authStore.currentUser.province || ''
  }
})

async function handleSave() {
  if (!name.value.trim() || !surname.value.trim()) {
    errorMessage.value = 'Please fill in both First Name and Last Name.'
    return
  }

  if (!authStore.currentUser) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    await authStore.updateProfile(authStore.currentUser.id, {
      name: name.value.trim(),
      surname: surname.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      province: province.value.trim()
    })

    alert('Profile updated successfully!')
    
    // บันทึกเสร็จส่งไปหน้าโปรไฟล์ตาม Role
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push(`/users/${authStore.currentUser.id}`)
    }
  } catch {
    errorMessage.value = 'Failed to update profile. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 mt-6">
    <h2 class="text-2xl font-bold text-slate-800 mb-2">Complete Your Profile</h2>
    <p class="text-sm text-slate-500 mb-6">Please fill in your personal information to continue using the application.</p>

    <form @submit.prevent="handleSave" class="space-y-4">
      <!-- First Name & Last Name -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">First Name *</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="John"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Last Name *</label>
          <input
            v-model="surname"
            type="text"
            required
            placeholder="Doe"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <!-- Email & Phone Number -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder="john@example.com"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
          <input
            v-model="phone"
            type="tel"
            placeholder="0812345678"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <!-- Province -->
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Province</label>
        <input
          v-model="province"
          type="text"
          placeholder="Chiang Mai"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <p v-if="errorMessage" class="text-xs text-red-500 font-semibold pt-1">
        {{ errorMessage }}
      </p>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="submit"
          :disabled="isSaving"
          class="w-full md:w-auto px-6 py-2.5 bg-[#8257e5] hover:bg-[#7143df] text-white font-semibold rounded-lg shadow transition-colors cursor-pointer disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>