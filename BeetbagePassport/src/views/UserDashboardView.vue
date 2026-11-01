<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore, type Service } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
import UserExamHistory from '@/components/UserExamHistory.vue'
import level1Badge from '@/assets/badge/level1badge_icon.png'
import level2Badge from '@/assets/badge/level2badge_icon.png'
import level3Badge from '@/assets/badge/level3badge_icon.png'
import level4Badge from '@/assets/badge/level4badge_icon.png'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchLevels()
  ])
})

const currentLevelData = computed(() => {
  const user = userStore.users.find((u) => u.username === authStore.currentUser?.username)
  const level = Math.min(Math.max(user?.level ?? 1, 1), 4)
  return userStore.getLevelDetail(level)
})

const dashboardServices = computed(() => {
  const currentLevel = currentLevelData.value?.level ?? 1
  const services = [1, 2, 3, 4].flatMap((levelNum: number) => {
    const levelData = userStore.getLevelDetail(levelNum)
    return (levelData?.services ?? []).map((service: Service) => ({ ...service, level: levelNum }))
  })

  return services
    .filter((service: Service & { level: number }) => service.level <= currentLevel)
    .sort((a: Service & { level: number }, b: Service & { level: number }) => a.level - b.level)
    .slice(-3)
})

const examHistory = computed(() => {
  const user = userStore.users.find((u) => u.username === authStore.currentUser?.username)
  return [...(user?.examHistory ?? [])].sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
  )
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm min-h-125">
      <div class="mb-8">
        <h2 class="text-2xl font-extrabold text-slate-900">Dashboard</h2>
        <p class="text-sm text-slate-400 mt-1">Your CAMT Passport progress and available services.</p>
      </div>

      <div class="border border-slate-300 rounded-2xl p-6 mb-6 flex items-center justify-between gap-6">
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Passport Badge</span>
          <h2 class="text-2xl font-extrabold text-purple-600 mt-1">{{ currentLevelData?.title }}</h2>
          <p class="text-xs text-slate-500 mt-1">{{ currentLevelData?.description }}</p>
          <div class="flex flex-col sm:flex-row gap-2 mt-5">
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
        <button
          type="button"
          aria-label="View badges"
          @click="router.push({ name: 'user-detail-badges' })"
          class="w-28 h-28 shrink-0 rounded-xl flex items-center justify-center hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          <img
            :src="currentLevelData?.level === 1 ? level1Badge : currentLevelData?.level === 2 ? level2Badge : currentLevelData?.level === 3 ? level3Badge : level4Badge"
            :alt="`${currentLevelData?.title} badge`"
            class="w-24 h-24 object-contain"
          />
        </button>
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
          <div class="flex items-center justify-between gap-3 mb-4">
            <h3 class="font-bold text-slate-800 text-sm">Available Services</h3>
            <button
              type="button"
              class="text-[11px] font-semibold text-purple-600 hover:text-purple-700"
              @click="router.push('/user/services')"
            >
              View Services
            </button>
          </div>
          <div v-for="s in dashboardServices" :key="s.id" class="p-3 bg-slate-50 rounded-lg text-xs mb-2 last:mb-0 flex items-center gap-3">
            <div class="min-w-0 flex-1">
              <p class="font-bold text-slate-700">{{ s.name }}</p>
              <p class="text-slate-500 mt-0.5">{{ s.description }}</p>
            </div>
            <span class="shrink-0 px-2 py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold">
              Level {{ s.level }}
            </span>
          </div>
        </div>
      </div>
      <UserExamHistory
        :history="examHistory.slice(0, 3)"
        title="Recent Exam History"
        :show-view-all="true"
        class="mt-6"
      />
    </main>
  </div>
</template>