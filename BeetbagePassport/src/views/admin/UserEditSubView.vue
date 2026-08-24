<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, computed, watchEffect } from 'vue'

const userStore = useUserStore()
const user = computed(() => userStore.selectedUser)

const form = ref({
  name: '',
  surname: '',
  email: '',
  province: ''
})

watchEffect(() => {
  if (user.value) {
    form.value = {
      name: user.value.name || '',
      surname: user.value.surname || '',
      email: user.value.email || '',
      province: user.value.province || ''
    }
  }
})

function handleSave() {
  alert('User information updated (UI only).')
}
</script>

<template>
  <form @submit.prevent="handleSave" class="space-y-4 text-xs max-w-md">
    <div>
      <label class="block font-semibold mb-1">First Name</label>
      <input v-model="form.name" type="text" class="w-full border rounded-lg px-3 py-2" />
    </div>
    <div>
      <label class="block font-semibold mb-1">Last Name</label>
      <input v-model="form.surname" type="text" class="w-full border rounded-lg px-3 py-2" />
    </div>
    <div>
      <label class="block font-semibold mb-1">Email</label>
      <input v-model="form.email" type="email" class="w-full border rounded-lg px-3 py-2" />
    </div>
    <div>
      <label class="block font-semibold mb-1">Province</label>
      <input v-model="form.province" type="text" class="w-full border rounded-lg px-3 py-2" />
    </div>
    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">Save Changes</button>
  </form>
</template>