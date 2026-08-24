<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <header class="max-w-5xl mx-auto flex justify-between items-center mb-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-3xl font-extrabold text-slate-900">CAMT</h1>
        <h1 class="text-3xl font-extrabold text-purple-600">Passport</h1>
      </div>

      <div v-if="authStore.currentUser" class="flex items-center gap-3 bg-white px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm">
        <img :src="authStore.currentUser.profileImage" :alt="authStore.currentUser.name || authStore.currentUser.username" class="w-8 h-8 rounded-full border border-slate-200 object-cover" />
        <div class="text-xs">
          <p class="font-bold text-slate-800">{{ authStore.currentUser.name || authStore.currentUser.username }}</p>
          <RouterLink to="/users/profile" class="text-slate-400 text-[10px] hover:text-purple-600 hover:underline">View profile</RouterLink>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto flex justify-start mb-6">
      <nav class="flex items-center gap-3 text-sm font-semibold">
        <RouterLink to="/user" class="text-slate-400 hover:text-purple-600">[Home]</RouterLink><span class="text-slate-300">|</span>
        <RouterLink to="/user/elearning" class="text-purple-600">[eLearning]</RouterLink><span class="text-slate-300">|</span>
        <RouterLink to="/user/exam" class="text-slate-400 hover:text-purple-600">[Exam]</RouterLink><span class="text-slate-300">|</span>
        <RouterLink v-if="authStore.currentUser" to="/users/profile" class="text-slate-400 hover:text-purple-600">[User Profile]</RouterLink>
      </nav>
    </div>
    <div class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm">
    <h1 class="text-xl font-bold mb-4">eLearning Content</h1>
    <p class="text-xs text-slate-500">Video content available for your level.</p>
    </div>
  </div>
</template>