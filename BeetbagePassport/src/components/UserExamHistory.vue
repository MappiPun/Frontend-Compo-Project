<script setup lang="ts">
import type { ExamHistory } from '@/types'

defineProps<{
  history: ExamHistory[]
}>()
</script>

<template>
  <div class="bg-white p-6 rounded-lg border border-gray-100">
    <div v-if="history.length === 0" class="text-gray-400 text-sm text-center py-6">
      No exam history recorded yet.
    </div>
    <div v-else class="space-y-3">
      <div 
        v-for="item in history" 
        :key="item.id"
        class="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 text-xs"
      >
        <div>
          <span class="font-bold text-gray-700">Exam Level {{ item.level }}</span>
          <p class="text-gray-400">{{ new Date(item.attemptedAt).toLocaleString() }}</p>
        </div>
        <div class="text-right">
          <span 
            class="font-bold px-2 py-0.5 rounded"
            :class="item.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          >
            {{ item.passed ? 'PASSED' : 'FAILED' }} ({{ item.score }}/{{ item.totalQuestions }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>