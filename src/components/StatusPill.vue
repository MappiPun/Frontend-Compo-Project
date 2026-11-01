<script setup lang="ts">
defineProps<{ active: boolean }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
    :class="active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="active ? 'bg-emerald-500' : 'bg-rose-500'" />
    {{ active ? 'Active' : 'Deactivated' }}
  </span>
</template>
