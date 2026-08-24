<script setup lang="ts">
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <UserProfileHeader />
    <UserNavigation />
    <div class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm">
    <h1 class="text-xl font-bold mb-4">eLearning Content</h1>
    <p class="text-xs text-slate-500">Video content available for your level.</p>
    </div>
  </div>
</template>