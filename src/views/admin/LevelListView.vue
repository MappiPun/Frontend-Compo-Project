<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLevelStore } from '@/stores/level'
import { errorMessage } from '@/services/api'
import LevelBadge from '@/components/LevelBadge.vue'

const store = useLevelStore()
const error = ref('')
onMounted(async () => {
  try {
    await store.fetchLevels(true)
  } catch (e) {
    error.value = errorMessage(e)
  }
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-5">
    <div>
      <h1 class="page-title">Levels & benefits</h1>
      <p class="text-sm text-slate-500">The benefits, services and pass criteria of every level.</p>
    </div>
    <p v-if="error" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ error }}</p>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article v-for="l in store.levels" :key="l.level" class="card flex flex-col">
        <div class="flex items-center gap-4">
          <LevelBadge :level="l.level" :size="64" />
          <div>
            <p class="text-xs font-bold uppercase text-brand-600">Level {{ l.level }}</p>
            <h2 class="text-lg font-extrabold">{{ l.title }}</h2>
          </div>
        </div>
        <ul class="mt-4 grow space-y-1 text-sm text-slate-600">
          <li>{{ l.benefits.length }} benefits · {{ l.services.length }} services</li>
          <li>Pass criteria: <strong>{{ l.passScore }}</strong> correct answers ({{ l.questionCount }} questions)</li>
        </ul>
        <div class="mt-4 flex gap-2">
          <RouterLink :to="{ name: 'admin-level-detail', params: { level: l.level } }" class="btn-secondary grow">Details</RouterLink>
          <RouterLink :to="{ name: 'admin-level-edit', params: { level: l.level } }" class="btn-primary grow">Edit</RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>
