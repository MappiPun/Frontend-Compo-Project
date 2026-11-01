<script setup lang="ts">
import type { Level } from '@/types'
import LevelBadge from '@/components/LevelBadge.vue'

defineProps<{ currentLevel: number; levels: Level[] }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div
      v-for="l in levels"
      :key="l.level"
      class="card flex flex-col items-center text-center"
      :class="l.level <= currentLevel ? 'border-brand-200' : ''"
    >
      <LevelBadge :level="l.level" :size="84" :locked="l.level > currentLevel" />
      <p class="mt-3 text-sm font-bold text-slate-800">Level {{ l.level }}</p>
      <p class="text-xs text-slate-500">{{ l.title }}</p>
      <span
        class="mt-2 rounded-full px-2 py-0.5 text-[11px] font-semibold"
        :class="l.level <= currentLevel ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-400'"
      >
        {{ l.level <= currentLevel ? 'Unlocked' : 'Locked' }}
      </span>
    </div>
  </div>
</template>
