<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'

const auth = useAuthStore()
const levels = useLevelStore()
onMounted(() => levels.fetchLevels())

// every service of the current level and of the levels below it
const available = computed(() => levels.levels.filter((l) => l.level <= auth.level))
const locked = computed(() => levels.levels.filter((l) => l.level > auth.level))
</script>

<template>
  <div class="space-y-6">
    <section v-for="l in available" :key="l.level">
      <h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Level {{ l.level }} services</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div v-for="s in l.services" :key="s.id" class="card">
          <div class="flex items-center justify-between gap-2">
            <p class="font-bold">{{ s.name }}</p>
            <span v-if="s.badge" class="rounded bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">{{ s.badge }}</span>
          </div>
          <p class="mt-1 text-sm text-slate-500">{{ s.description }}</p>
        </div>
      </div>
    </section>

    <section v-if="locked.length">
      <h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">Locked</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <template v-for="l in locked" :key="l.level">
          <div v-for="s in l.services" :key="s.id" class="card opacity-50">
            <p class="font-bold">🔒 {{ s.name }}</p>
            <p class="mt-1 text-xs text-slate-500">Reach Level {{ l.level }} to unlock</p>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
