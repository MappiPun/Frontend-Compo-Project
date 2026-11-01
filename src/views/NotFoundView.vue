<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
    <p class="text-7xl font-black text-brand-600">404</p>
    <h1 class="text-2xl font-extrabold text-slate-900">Page not found</h1>
    <p class="text-slate-500">The page you are looking for does not exist.</p>
    <RouterLink to="/" class="btn-primary">Back to home</RouterLink>
  </div>
</template>
