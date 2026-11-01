<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDetailStore } from '@/stores/userDetail'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/services/api'
import type { UserUpdatePayload } from '@/types'
import UserEditForm from '@/components/UserEditForm.vue'

const store = useUserDetailStore()
const toast = useToastStore()
const router = useRouter()
const saving = ref(false)

async function save(payload: UserUpdatePayload) {
  saving.value = true
  try {
    await store.save(payload) // saved to the backend; the data is still there after the page is reloaded
    toast.success('The user has been updated.')
    router.push({ name: 'admin-user-info', params: { id: store.user?.id } })
  } catch (e) {
    toast.error(errorMessage(e, 'Cannot save the user'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UserEditForm
    v-if="store.user"
    :user="store.user"
    show-level
    :saving="saving"
    @save="save"
    @cancel="router.push({ name: 'admin-user-info', params: { id: store.user.id } })"
  />
</template>
