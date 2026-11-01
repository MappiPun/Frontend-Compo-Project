<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppAvatar from '@/components/AppAvatar.vue'
import LevelBadge from '@/components/LevelBadge.vue'

const auth = useAuthStore()
const tabs = [
  { name: 'user-profile-details', label: 'Details' },
  { name: 'user-profile-history', label: 'Exam history' },
  { name: 'user-profile-badges', label: 'Badges' },
  { name: 'user-profile-services', label: 'Services' },
]
</script>

<template>
  <div v-if="auth.user" class="space-y-5">
    <section class="card flex flex-col items-center gap-5 sm:flex-row">
      <AppAvatar :src="auth.user.profileImage" :name="auth.user.name" :surname="auth.user.surname" :size="96" />
      <div class="text-center sm:text-left">
        <h1 class="text-2xl font-extrabold">{{ auth.user.name }} {{ auth.user.surname }}</h1>
        <p class="text-sm text-slate-500">@{{ auth.user.username }}</p>
        <p class="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
          <LevelBadge :level="auth.user.level" :size="22" /> Level {{ auth.user.level }}
        </p>
      </div>
    </section>

    <nav class="flex gap-1 overflow-x-auto border-b border-slate-200">
      <RouterLink
        v-for="t in tabs"
        :key="t.name"
        :to="{ name: t.name }"
        class="whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
        active-class="border-brand-600! text-brand-700!"
      >
        {{ t.label }}
      </RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
