<script setup lang="ts">
import type { ExamHistory } from '@/types'
import { useRouter } from 'vue-router'

withDefaults(defineProps<{
  history?: ExamHistory[]
  title?: string
  showViewAll?: boolean
}>(), {
  history: () => [],
  title: 'Exam History',
  showViewAll: false
})

const router = useRouter()
</script>

<template>
  <section class="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900">{{ title }}</h2>
        <p class="text-xs text-slate-400 mt-1">A record of your completed level exams.</p>
      </div>
      <button
        v-if="showViewAll"
        type="button"
        class="shrink-0 text-xs font-semibold text-purple-600 hover:text-purple-700"
        @click="router.push('/users/profile/history')"
      >
        View Full Exam History
      </button>
    </div>

    <div v-if="history.length === 0" class="border border-slate-200 rounded-xl py-10 text-center">
      <p class="text-sm font-semibold text-slate-500">No exam history recorded yet.</p>
      <p class="text-xs text-slate-400 mt-1">Your completed exams will appear here.</p>
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-slate-200">
      <div class="grid grid-cols-[1fr_1.5fr_1fr_1fr] bg-slate-50 border-b border-slate-200 px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        <span>Level</span>
        <span>Date &amp; Time</span>
        <span>Score</span>
        <span class="text-right">Result</span>
      </div>

      <div
        v-for="item in history"
        :key="item.id"
        class="grid grid-cols-[1fr_1.5fr_1fr_1fr] items-center px-5 py-4 text-xs border-b border-slate-100 last:border-b-0"
      >
        <span class="font-bold text-slate-700">Level {{ item.level }}</span>
        <span class="text-slate-500">{{ new Date(item.attemptedAt).toLocaleString() }}</span>
        <span class="font-semibold text-slate-700">{{ item.score }}/{{ item.totalQuestions }}</span>
        <span class="text-right">
          <span
            class="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold"
            :class="item.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          >
            {{ item.passed ? 'PASSED' : 'FAILED' }}
          </span>
        </span>
      </div>
    </div>
  </section>
</template>