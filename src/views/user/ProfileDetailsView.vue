<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserDetailsPanel from '@/components/UserDetailsPanel.vue'

const auth = useAuthStore()
</script>

<template>
  <div v-if="auth.user" class="space-y-4">
    <UserDetailsPanel :user="auth.user" />
    <div class="flex justify-end">
      <RouterLink :to="{ name: 'user-profile-edit' }" class="btn-primary">Edit my details</RouterLink>
    </div>
  </div>
</template>
