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
  const user = userStore.users.find((u) => u.username === authStore.currentUser?.username)
  const lvl = user?.level ?? 1
  return userStore.getLevelDetail(lvl)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <header class="max-w-5xl mx-auto flex justify-between items-center mb-6">
      <div class="flex items-baseline gap-2">
        <h1 class="text-3xl font-extrabold text-slate-900">CAMT</h1>
        <h1 class="text-3xl font-extrabold text-purple-600">Passport</h1>
      </div>

      <div v-if="authStore.currentUser" class="flex items-center gap-3 bg-white px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm">
        <img
          :src="authStore.currentUser.profileImage"
          :alt="authStore.currentUser.name || authStore.currentUser.username"
          class="w-8 h-8 rounded-full border border-slate-200 object-cover"
        />
        <div class="text-xs">
          <p class="font-bold text-slate-800">{{ authStore.currentUser.name || authStore.currentUser.username }}</p>
          <RouterLink
            :to="'/users/profile'"
            class="text-slate-400 text-[10px] hover:text-purple-600 hover:underline"
          >
            View profile
          </RouterLink>
        </div>
        <button
          @click="authStore.logout(); router.push('/login')"
          class="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </header>

    <div class="max-w-5xl mx-auto mb-4 flex justify-start">
      <nav class="flex items-center gap-3 text-sm font-semibold">
        <RouterLink to="/user" class="text-purple-600">[Home]</RouterLink><span class="text-slate-300">|</span>
        <RouterLink to="/user/elearning" class="text-slate-400 hover:text-purple-600">[eLearning]</RouterLink><span class="text-slate-300">|</span>
        <RouterLink to="/user/exam" class="text-slate-400 hover:text-purple-600">[Exam]</RouterLink><span class="text-slate-300">|</span>
        <RouterLink v-if="authStore.currentUser" :to="'/users/profile'" class="text-slate-400 hover:text-purple-600">[User Profile]</RouterLink>
      </nav>
    </div>

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm min-h-125">
      <div class="mb-8">
        <h2 class="text-2xl font-extrabold text-slate-900">Dashboard</h2>
        <p class="text-sm text-slate-400 mt-1">Your CAMT Passport progress and available services.</p>
      </div>

      <div class="border border-slate-300 rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Passport Badge</span>
          <h2 class="text-2xl font-extrabold text-purple-600 mt-1">{{ currentLevelData?.title }}</h2>
          <p class="text-xs text-slate-500 mt-1">{{ currentLevelData?.description }}</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="router.push('/user/elearning')"
            class="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-50"
          >
            eLearning
          </button>
          <button
            @click="router.push('/user/exam')"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"
          >
            Take Level Up Exam
          </button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="border border-slate-300 rounded-2xl p-6">
          <h3 class="font-bold text-slate-800 text-sm mb-4">Unlocked Benefits</h3>
          <ul class="space-y-3">
            <li v-for="b in currentLevelData?.benefits" :key="b.id" class="text-xs text-slate-600 flex items-center gap-2">
              <span class="text-purple-600 font-bold">✓</span>
              <span>{{ b.description }}</span>
            </li>
          </ul>
        </div>

        <div class="border border-slate-300 rounded-2xl p-6">
          <h3 class="font-bold text-slate-800 text-sm mb-4">Available Services</h3>
          <div v-for="s in currentLevelData?.services" :key="s.id" class="p-3 bg-slate-50 rounded-lg text-xs mb-2 last:mb-0">
            <p class="font-bold text-slate-700">{{ s.name }}</p>
            <p class="text-slate-500 mt-0.5">{{ s.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>