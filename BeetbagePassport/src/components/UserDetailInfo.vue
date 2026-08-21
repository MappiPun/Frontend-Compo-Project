<script setup lang="ts">
import type { User } from '@/types'

defineProps<{
  user: User
}>()
</script>

<template>
  <div class="space-y-4 bg-white p-6 rounded-lg border border-gray-100">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-xs text-gray-400 font-semibold block uppercase">First Name</label>
        <p class="text-gray-800 font-medium">{{ user.name }}</p>
      </div>
      <div>
        <label class="text-xs text-gray-400 font-semibold block uppercase">Last Name</label>
        <p class="text-gray-800 font-medium">{{ user.surname }}</p>
      </div>
      <div>
        <label class="text-xs text-gray-400 font-semibold block uppercase">Email</label>
        <p class="text-gray-800 font-medium">{{ user.email }}</p>
      </div>
      <div>
        <label class="text-xs text-gray-400 font-semibold block uppercase">Province</label>
        <p class="text-gray-800 font-medium">{{ user.province }}</p>
      </div>
    </div>
  </div>
</template>