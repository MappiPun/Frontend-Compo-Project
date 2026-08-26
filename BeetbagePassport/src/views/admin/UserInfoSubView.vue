<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const user = computed(() => userStore.selectedUser)
</script>

<template>
  <div v-if="user" class="space-y-3 text-xs text-slate-700">
    <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
      <div><strong>Full Name:</strong> {{ user.name }} {{ user.surname }}</div>
      <div><strong>Username:</strong> {{ user.username }}</div>
      <div><strong>Email:</strong> {{ user.email }}</div>
      <div><strong>Phone:</strong> {{ user.phonenumber || user.phone || 'N/A' }}</div>
      <div><strong>Province:</strong> {{ user.province || 'N/A' }}</div>
      <div><strong>Current Level:</strong> Level {{ user.level }}</div>
      <div><strong>Status:</strong> <span :class="user.isActive ? 'text-green-600' : 'text-red-500'">{{ user.isActive ? 'Active' : 'Inactive' }}</span></div>
    </div>
  </div>
</template>