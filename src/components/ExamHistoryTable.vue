<script setup lang="ts">
import type { ExamHistory } from '@/types'
import { formatDateTime } from '@/utils/format'
import LevelBadge from '@/components/LevelBadge.vue'

defineProps<{ history: ExamHistory[] }>()
</script>

<template>
  <div class="card overflow-hidden p-0">
    <div v-if="history.length === 0" class="p-8 text-center text-sm text-slate-400">No exam attempts yet.</div>
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[34rem] text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-4 py-3">Date & time</th>
            <th class="px-4 py-3">Exam</th>
            <th class="px-4 py-3">Score</th>
            <th class="px-4 py-3">Result</th>
            <th class="px-4 py-3">Badge received</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="h in history" :key="h.id">
            <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ formatDateTime(h.attemptedAt) }}</td>
            <td class="px-4 py-3 font-medium">Level {{ h.level }}</td>
            <td class="px-4 py-3">{{ h.score }} / {{ h.totalQuestions }}</td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-bold"
                :class="h.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
              >
                {{ h.passed ? 'Passed' : 'Failed' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span v-if="h.awardedLevel" class="inline-flex items-center gap-2 font-medium text-brand-700">
                <LevelBadge :level="h.awardedLevel" :size="28" /> Level {{ h.awardedLevel }}
              </span>
              <span v-else class="text-slate-300">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
