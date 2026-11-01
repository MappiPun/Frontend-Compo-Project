<script setup lang="ts">
import type { User } from '@/types'
import AppAvatar from '@/components/AppAvatar.vue'
import StatusPill from '@/components/StatusPill.vue'
import LevelBadge from '@/components/LevelBadge.vue'

/** one user in the admin user list */
defineProps<{ user: User }>()
defineEmits<{ (e: 'open', user: User): void }>()
</script>

<template>
  <button
    class="card flex w-full cursor-pointer items-center gap-4 text-left transition hover:border-brand-300 hover:shadow-md"
    :class="{ 'opacity-70': !user.active }"
    @click="$emit('open', user)"
  >
    <AppAvatar :src="user.profileImage" :name="user.name" :surname="user.surname" :size="48" />
    <div class="min-w-0 grow">
      <p class="truncate font-bold text-slate-900">{{ user.name }} {{ user.surname }}</p>
      <p class="truncate text-xs text-slate-500">@{{ user.username }} · {{ user.province || 'No province' }}</p>
    </div>
    <div class="hidden items-center gap-1 text-sm font-semibold text-brand-700 sm:flex">
      <LevelBadge :level="user.level" :size="28" /> L{{ user.level }}
    </div>
    <StatusPill :active="user.active" />
  </button>
</template>
