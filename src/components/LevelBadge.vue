<script setup lang="ts">
import level1 from '@/assets/badge/level1badge_icon.png'
import level2 from '@/assets/badge/level2badge_icon.png'
import level3 from '@/assets/badge/level3badge_icon.png'
import level4 from '@/assets/badge/level4badge_icon.png'

const badges: Record<number, string> = { 1: level1, 2: level2, 3: level3, 4: level4 }

withDefaults(defineProps<{ level: number; size?: number; locked?: boolean }>(), { size: 64, locked: false })
</script>

<template>
  <img
    :src="badges[level] ?? level1"
    :alt="`Level ${level} badge`"
    :style="{ width: `${size}px`, height: `${size}px` }"
    class="shrink-0 object-contain transition"
    :class="{ 'opacity-30 grayscale': locked }"
  />
</template>
