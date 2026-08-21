<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const currentLevelData = computed(() => {
  const lvl = authStore.currentUser?.level || 1
  return userStore.getLevelDetail(lvl)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-slate-800">User Dashboard</h1>
      <UserProfileHeader />
    </header>

    <main class="max-w-4xl mx-auto p-6 space-y-6">
      <!-- Status Card -->
      <div class="bg-indigo-600 text-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-indigo-200">Current Passport Badge</span>
          <h2 class="text-3xl font-extrabold mt-1">{{ currentLevelData?.title }}</h2>
          <p class="text-xs text-indigo-100 mt-1">{{ currentLevelData?.description }}</p>
        </div>
        <div class="space-x-2">
          <button @click="router.push('/user/elearning')" class="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50">
            eLearning
          </button>
          <button @click="router.push('/user/exam')" class="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-400">
            Take Level Up Exam
          </button>
        </div>
      </div>

      <!-- Benefits & Services -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-xl border border-slate-100 space-y-3">
          <h3 class="font-bold text-slate-800 text-sm">Unlocked Benefits</h3>
          <ul class="space-y-2">
            <li v-for="b in currentLevelData?.benefits" :key="b.id" class="text-xs text-slate-600 flex items-center space-x-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>{{ b.description }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-white p-5 rounded-xl border border-slate-100 space-y-3">
          <h3 class="font-bold text-slate-800 text-sm">Available Services</h3>
          <div v-for="s in currentLevelData?.services" :key="s.id" class="p-3 bg-slate-50 rounded-lg text-xs">
            <p class="font-bold text-slate-700">{{ s.name }}</p>
            <p class="text-slate-500 mt-0.5">{{ s.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>