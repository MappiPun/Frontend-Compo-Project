<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { initials } from '@/utils/format'

const props = withDefaults(
  defineProps<{ src?: string | null; name?: string; surname?: string; size?: number }>(),
  { src: null, name: '', surname: '', size: 40 },
)

const failed = ref(false)
watch(() => props.src, () => (failed.value = false))
const style = computed(() => ({ width: `${props.size}px`, height: `${props.size}px`, fontSize: `${props.size / 2.6}px` }))
</script>

<template>
  <img
    v-if="src && !failed"
    :src="src"
    :alt="`${name} ${surname}`"
    :style="style"
    class="shrink-0 rounded-full bg-slate-200 object-cover"
    @error="failed = true"
  />
  <div
    v-else
    :style="style"
    class="flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700"
  >
    {{ initials(name, surname) }}
  </div>
</template>
