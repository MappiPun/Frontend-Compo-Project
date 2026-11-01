<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import { errorMessage } from '@/services/api'
import LevelInfoCard from '@/components/LevelInfoCard.vue'
import LevelBadge from '@/components/LevelBadge.vue'

const auth = useAuthStore()
const levels = useLevelStore()
const error = ref('')

// the level and the benefits are reloaded every time this page opens, so an upgrade is shown without logging in again
onMounted(async () => {
  try {
    await Promise.all([auth.refresh(), levels.fetchLevels(true)])
  } catch (e) {
    error.value = errorMessage(e)
  }
})

const current = computed(() => levels.getLevel(auth.level))
const next = computed(() => levels.getLevel(auth.level + 1))
</script>

<template>
  <div class="space-y-6">
    <section class="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-700 to-brand-500 p-6 text-white shadow-lg sm:p-8">
      <div class="flex flex-col items-center gap-5 sm:flex-row">
        <LevelBadge :level="auth.level" :size="96" />
        <div class="text-center sm:text-left">
          <p class="text-sm font-semibold text-white/70">Welcome back, {{ auth.user?.name }}</p>
          <h1 class="text-3xl font-extrabold">You are at Level {{ auth.level }}</h1>
          <p class="mt-1 text-white/80">{{ current?.title }}</p>
        </div>
        <div class="flex gap-2 sm:ml-auto">
          <RouterLink :to="{ name: 'user-elearning' }" class="btn bg-white/15 text-white hover:bg-white/25">Study</RouterLink>
          <RouterLink :to="{ name: 'user-exam' }" class="btn bg-white text-brand-700 hover:bg-brand-50">Take exam</RouterLink>
        </div>
      </div>
    </section>

    <p v-if="error" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ error }}</p>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <LevelInfoCard v-if="current" :level="current" />
        <div v-else class="card py-12 text-center text-slate-400">Loading...</div>
      </div>
      <aside class="card h-fit">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Next level</h2>
        <template v-if="next">
          <div class="mt-3 flex items-center gap-3">
            <LevelBadge :level="next.level" :size="48" locked />
            <div>
              <p class="font-bold">Level {{ next.level }}</p>
              <p class="text-xs text-slate-500">{{ next.title }}</p>
            </div>
          </div>
          <ul class="mt-4 space-y-1 text-sm text-slate-500">
            <li v-for="(b, i) in next.benefits" :key="i">🔒 {{ b.description }}</li>
          </ul>
          <RouterLink :to="{ name: 'user-exam' }" class="btn-primary mt-5 w-full">Take the exam to upgrade</RouterLink>
        </template>
        <p v-else class="mt-3 text-sm text-slate-500">🎉 You have reached the highest level!</p>
      </aside>
    </div>
  </div>
</template>
