<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusPill from '@/components/StatusPill.vue'
import LevelBadge from '@/components/LevelBadge.vue'

const props = defineProps<{ user: User }>()

const rows = computed(() => [
  { label: 'Username', value: props.user.username },
  { label: 'Name', value: props.user.name },
  { label: 'Surname', value: props.user.surname },
  { label: 'Email', value: props.user.email },
  { label: 'Phone number', value: props.user.phone || '-' },
  { label: 'Province', value: props.user.province || '-' },
])
</script>

<template>
  <section class="card">
    <div class="flex flex-col items-center gap-4 sm:flex-row">
      <AppAvatar :src="user.profileImage" :name="user.name" :surname="user.surname" :size="88" />
      <div class="text-center sm:text-left">
        <h2 class="text-xl font-extrabold text-slate-900">{{ user.name }} {{ user.surname }}</h2>
        <p class="text-sm text-slate-500">@{{ user.username }}</p>
        <div class="mt-2 flex items-center justify-center gap-3 sm:justify-start">
          <StatusPill :active="user.active" />
          <span class="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            <LevelBadge :level="user.level" :size="24" /> Level {{ user.level }}
          </span>
        </div>
      </div>
    </div>
    <dl class="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      <div v-for="r in rows" :key="r.label" class="border-b border-slate-100 pb-2">
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ r.label }}</dt>
        <dd class="mt-0.5 break-words text-sm font-medium text-slate-800">{{ r.value }}</dd>
      </div>
    </dl>
  </section>
</template>
