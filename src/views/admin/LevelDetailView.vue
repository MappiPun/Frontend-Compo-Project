<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLevelStore } from '@/stores/level'
import LevelInfoCard from '@/components/LevelInfoCard.vue'

const props = defineProps<{ level: string }>()
const store = useLevelStore()
onMounted(() => store.fetchLevels())
const info = computed(() => store.getLevel(Number(props.level)))
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <RouterLink :to="{ name: 'admin-levels' }" class="text-sm font-semibold text-brand-600 hover:underline">← All levels</RouterLink>
    <template v-if="info">
      <LevelInfoCard :level="info" show-pass />
      <div class="flex justify-end gap-2">
        <RouterLink :to="{ name: 'admin-questions', query: { level: info.level } }" class="btn-secondary">View questions</RouterLink>
        <RouterLink :to="{ name: 'admin-level-edit', params: { level: info.level } }" class="btn-primary">Edit this level</RouterLink>
      </div>
    </template>
    <div v-else-if="store.loaded" class="card py-12 text-center text-slate-400">Level not found.</div>
  </div>
</template>
