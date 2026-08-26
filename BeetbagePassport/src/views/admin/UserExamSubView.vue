<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const user = computed(() => userStore.selectedUser)
</script>

<template>
  <div v-if="user" class="space-y-3">
    <h3 class="text-xs font-bold text-slate-700">Exam History</h3>
    <div v-if="user.examHistory && user.examHistory.length > 0" class="space-y-2">
      <div 
        v-for="exam in user.examHistory" 
        :key="exam.id"
        class="p-3 border rounded-lg bg-slate-50 flex justify-between items-center text-xs"
      >
        <div>
          <p class="font-bold">Level {{ exam.level }} Exam</p>
          <p class="text-[10px] text-slate-400">{{ new Date(exam.attemptedAt).toLocaleString() }}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold" :class="exam.passed ? 'text-green-600' : 'text-red-500'">
            {{ exam.score }} / {{ exam.totalQuestions }} ({{ exam.passed ? 'PASSED' : 'FAILED' }})
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-xs text-slate-400 py-4">No exam history recorded.</div>
  </div>
</template>