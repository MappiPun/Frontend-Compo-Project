<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; total: number; size: number }>()
const emit = defineEmits<{ (e: 'change', page: number): void }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.size)))
const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= totalPages.value)
const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.size + 1))
const to = computed(() => Math.min(props.page * props.size, props.total))
</script>

<template>
  <nav class="flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Pagination">
    <p class="text-sm text-slate-500">
      Showing <span class="font-semibold text-slate-700">{{ from }}-{{ to }}</span> of
      <span class="font-semibold text-slate-700">{{ total }}</span> users
    </p>
    <div class="flex items-center gap-2">
      <!-- the Prev and Next buttons are not shown on the first and the last page -->
      <button v-if="!isFirst" class="btn-secondary" @click="emit('change', page - 1)">‹ Prev</button>
      <span class="px-2 text-sm font-semibold text-slate-600">Page {{ page }} / {{ totalPages }}</span>
      <button v-if="!isLast" class="btn-secondary" @click="emit('change', page + 1)">Next ›</button>
    </div>
  </nav>
</template>
