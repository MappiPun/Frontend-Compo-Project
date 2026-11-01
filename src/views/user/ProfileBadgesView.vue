<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import BadgeGrid from '@/components/BadgeGrid.vue'

const auth = useAuthStore()
const levels = useLevelStore()
onMounted(() => levels.fetchLevels())
</script>

<template>
  <BadgeGrid :current-level="auth.level" :levels="levels.levels" />
</template>
