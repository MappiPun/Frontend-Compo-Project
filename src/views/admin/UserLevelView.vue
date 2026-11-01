<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserDetailStore } from '@/stores/userDetail'
import { useLevelStore } from '@/stores/level'
import LevelBadge from '@/components/LevelBadge.vue'
import ExamHistoryTable from '@/components/ExamHistoryTable.vue'

const store = useUserDetailStore()
const levels = useLevelStore()
onMounted(() => levels.fetchLevels())

const levelInfo = computed(() => (store.user ? levels.getLevel(store.user.level) : undefined))
const passedCount = computed(() => store.history.filter((h) => h.passed).length)
</script>

<template>
  <div v-if="store.user" class="space-y-5">
    <section class="card flex items-center gap-5">
      <LevelBadge :level="store.user.level" :size="80" />
      <div class="grow">
        <p class="text-xs font-bold uppercase tracking-wide text-brand-600">Current level</p>
        <h2 class="text-2xl font-extrabold">Level {{ store.user.level }}</h2>
        <p class="text-sm text-slate-500">{{ levelInfo?.title }}</p>
      </div>
      <div class="hidden text-right text-sm text-slate-500 sm:block">
        <p><strong class="text-slate-800">{{ store.history.length }}</strong> attempts</p>
        <p><strong class="text-emerald-600">{{ passedCount }}</strong> passed</p>
      </div>
    </section>
    <h3 class="text-sm font-bold uppercase tracking-wide text-slate-500">Exam history</h3>
    <ExamHistoryTable :history="store.history" />
  </div>
</template>
