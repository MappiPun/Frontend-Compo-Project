<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ELearningService from '@/services/ELearningService'
import { errorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { ELearning } from '@/types'
import LevelBadge from '@/components/LevelBadge.vue'

const auth = useAuthStore()
const items = ref<ELearning[]>([])
const selectedId = ref<number | null>(null)
const loading = ref(true)
const error = ref('')

// only the content of the current level is returned by the backend
onMounted(async () => {
  try {
    await auth.refresh()
    items.value = (await ELearningService.mine()).data
    selectedId.value = items.value[0]?.id ?? null
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
})
const selected = computed(() => items.value.find((i) => i.id === selectedId.value))
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <LevelBadge :level="auth.level" :size="44" />
      <div>
        <h1 class="page-title">eLearning · Level {{ auth.level }}</h1>
        <p class="text-sm text-slate-500">Watch the videos, then take the exam to upgrade.</p>
      </div>
    </div>

    <p v-if="error" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ error }}</p>
    <div v-else-if="loading" class="card py-12 text-center text-slate-400">Loading...</div>
    <div v-else-if="items.length === 0" class="card py-12 text-center text-slate-400">No content for your level yet.</div>

    <div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <section class="space-y-3 lg:col-span-2">
        <div class="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
          <iframe
            v-if="selected"
            :key="selected.id"
            :src="selected.videoUrl"
            :title="selected.title"
            class="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
        <div v-if="selected" class="card">
          <h2 class="text-lg font-extrabold">{{ selected.title }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ selected.description }}</p>
        </div>
      </section>

      <aside class="space-y-2">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Playlist</h2>
        <button
          v-for="(v, i) in items"
          :key="v.id"
          class="card flex w-full cursor-pointer items-center gap-3 p-3 text-left transition hover:border-brand-300"
          :class="v.id === selectedId ? 'border-brand-500 bg-brand-50' : ''"
          @click="selectedId = v.id"
        >
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{{ i + 1 }}</span>
          <span class="text-sm font-semibold">{{ v.title }}</span>
        </button>
        <RouterLink :to="{ name: 'user-exam' }" class="btn-primary mt-3 w-full">Ready? Take the exam</RouterLink>
      </aside>
    </div>
  </div>
</template>
