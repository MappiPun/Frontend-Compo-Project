<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserService from '@/services/UserService'
import { errorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { UserUpdatePayload } from '@/types'
import UserEditForm from '@/components/UserEditForm.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const saving = ref(false)

async function save(payload: UserUpdatePayload) {
  saving.value = true
  try {
    auth.setUser((await UserService.updateMe(payload)).data)
    toast.success('Your details have been saved.')
    router.push({ name: 'user-profile-details' })
  } catch (e) {
    toast.error(errorMessage(e, 'Cannot save your details'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <!-- the same component as the admin user edit tab (without the level field) -->
  <UserEditForm v-if="auth.user" :user="auth.user" :saving="saving" @save="save" @cancel="router.push({ name: 'user-profile-details' })" />
</template>
