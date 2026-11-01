<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
    <div
      v-for="t in toast.toasts"
      :key="t.id"
      class="pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg"
      :class="
        t.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-rose-200 bg-rose-50 text-rose-800'
      "
      role="status"
    >
      <span class="grow">{{ t.text }}</span>
      <button class="cursor-pointer font-bold opacity-60 hover:opacity-100" @click="toast.dismiss(t.id)">×</button>
    </div>
  </div>
</template>
