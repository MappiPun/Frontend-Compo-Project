<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="max-w-5xl mx-auto flex justify-start mb-6">
    <nav class="flex items-center gap-3 text-sm font-semibold">
      <RouterLink to="/user" :class="route.path === '/user' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[Home]</RouterLink>
      <span class="text-slate-300">|</span>
      <RouterLink to="/user/elearning" :class="route.path === '/user/elearning' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[eLearning]</RouterLink>
      <span class="text-slate-300">|</span>
      <RouterLink to="/user/exam" :class="route.path === '/user/exam' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[Exam]</RouterLink>
      <span class="text-slate-300">|</span>
      <RouterLink to="/user/services" :class="route.path.startsWith('/user/services') ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[Service]</RouterLink>
      <span class="text-slate-300">|</span>
      <RouterLink to="/users/profile" :class="route.path.startsWith('/users/profile') ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'">[User Profile]</RouterLink>
    </nav>
  </div>
</template>
