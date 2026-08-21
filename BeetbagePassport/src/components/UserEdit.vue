<script setup lang="ts">
import { reactive } from 'vue'
import type { User } from '@/types'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  user: User
}>()

const userStore = useUserStore()

const form = reactive({
  name: props.user.name,
  surname: props.user.surname,
  province: props.user.province
})

function saveChanges() {
  userStore.updateUserProfile(props.user.id, form)
  alert('Profile updated successfully!')
}
</script>

<template>
  <form @submit.prevent="saveChanges" class="bg-white p-6 rounded-lg border border-gray-100 space-y-4">
    <div>
      <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">First Name</label>
      <input v-model="form.name" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" required />
    </div>
    <div>
      <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
      <input v-model="form.surname" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" required />
    </div>
    <div>
      <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Province</label>
      <input v-model="form.province" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" required />
    </div>
    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
      Save Changes
    </button>
  </form>
</template>