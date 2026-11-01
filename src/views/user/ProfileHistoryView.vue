<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserService from '@/services/UserService'
import { errorMessage } from '@/services/api'
import type { ExamHistory } from '@/types'
import ExamHistoryTable from '@/components/ExamHistoryTable.vue'

const history = ref<ExamHistory[]>([])
const error = ref('')
onMounted(async () => {
  try {
    history.value = (await UserService.myExamHistory()).data
  } catch (e) {
    error.value = errorMessage(e)
  }
})
</script>

<template>
  <p v-if="error" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ error }}</p>
  <ExamHistoryTable v-else :history="history" />
</template>
