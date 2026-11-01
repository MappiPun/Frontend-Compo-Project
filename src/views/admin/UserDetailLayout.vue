<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserDetailStore } from '@/stores/userDetail'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/services/api'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusPill from '@/components/StatusPill.vue'

const props = defineProps<{ id: string }>()
const store = useUserDetailStore()
const toast = useToastStore()

// the data is loaded once here and shared with the sub routes by Pinia
watch(() => props.id, (id) => store.load(Number(id)), { immediate: true })
onBeforeUnmount(() => store.clear())

async function toggleActive() {
  if (!store.user) return
  const next = !store.user.active
  const text = next
    ? `Reactivate ${store.user.name}?`
    : `Deactivate ${store.user.name}? The user will not be able to log in or use the service.`
  if (!window.confirm(text)) return
  try {
    await store.setActive(next)
    toast.success(next ? 'The user has been reactivated.' : 'The user has been deactivated.')
  } catch (e) {
    toast.error(errorMessage(e))
  }
}

const tabs = [
  { name: 'admin-user-info', label: 'Information' },
  { name: 'admin-user-level', label: 'Level & exam history' },
  { name: 'admin-user-edit', label: 'Edit' },
]
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-5">
    <RouterLink :to="{ name: 'admin-users' }" class="text-sm font-semibold text-brand-600 hover:underline">← All users</RouterLink>

    <div v-if="store.loading && !store.user" class="card py-12 text-center text-slate-400">Loading...</div>
    <div v-else-if="store.error" class="card py-12 text-center text-rose-600">{{ store.error }}</div>

    <template v-else-if="store.user">
      <div class="card flex flex-col items-center gap-4 sm:flex-row">
        <AppAvatar :src="store.user.profileImage" :name="store.user.name" :surname="store.user.surname" :size="64" />
        <div class="grow text-center sm:text-left">
          <h1 class="text-xl font-extrabold">{{ store.user.name }} {{ store.user.surname }}</h1>
          <p class="text-sm text-slate-500">@{{ store.user.username }}</p>
        </div>
        <StatusPill :active="store.user.active" />
        <button :class="store.user.active ? 'btn-danger' : 'btn-success'" @click="toggleActive">
          {{ store.user.active ? 'Deactivate' : 'Reactivate' }}
        </button>
      </div>

      <nav class="flex gap-1 overflow-x-auto border-b border-slate-200">
        <RouterLink
          v-for="t in tabs"
          :key="t.name"
          :to="{ name: t.name, params: { id } }"
          class="whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
          active-class="border-brand-600! text-brand-700!"
        >
          {{ t.label }}
        </RouterLink>
      </nav>

      <RouterView />
    </template>
  </div>
</template>
