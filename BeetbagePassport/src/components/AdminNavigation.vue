<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeTab = computed(() => {
  if (route.path.startsWith('/admin/users')) return 'users'
  if (route.path.startsWith('/admin/levels')) return 'levels'
  return typeof route.query.tab === 'string' ? route.query.tab : 'users'
})

const navItems = [
  { key: 'users', label: 'User Management', to: { path: '/admin', query: { tab: 'users' } } },
  { key: 'levels', label: 'Levels & Exam Criteria', to: { path: '/admin', query: { tab: 'levels' } } },
  { key: 'elearning', label: 'eLearning Management', to: { path: '/admin', query: { tab: 'elearning' } } }
]
</script>

<template>
  <nav class="flex border-b border-slate-200 space-x-4">
    <RouterLink
      v-for="item in navItems"
      :key="item.key"
      :to="item.to"
      :class="[
        'pb-2 px-1 text-sm font-semibold transition-colors',
        activeTab === item.key
          ? 'border-b-2 border-purple-600 text-purple-600'
          : 'text-slate-500 hover:text-slate-700'
      ]"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
