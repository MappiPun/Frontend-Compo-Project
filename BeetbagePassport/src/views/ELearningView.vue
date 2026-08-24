<script setup lang="ts">
import { computed, onMounted } from 'vue'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useELearningStore } from '@/stores/elearning'

const authStore = useAuthStore()
const userStore = useUserStore()
const elearningStore = useELearningStore()

onMounted(() => {
  elearningStore.fetchContents()
})

const currentLevel = computed(() => {
  const username = authStore.currentUser?.username
  const user = userStore.users.find((u) => u.username === username) || authStore.currentUser
  return Math.min(Math.max(user?.level ?? user?.currentLevel ?? 1, 1), 4)
})

// กรองบทเรียนให้แสดงวิดีโอที่มี Level ไม่เกิน Level ปัจจุบันของผู้ใช้
const availableContents = computed(() => {
  return elearningStore.contents.filter((item) => Number(item.level) <= currentLevel.value)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-6 space-y-6 mt-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">eLearning Content</h1>
        <p class="text-sm text-slate-500 mt-1">Video content available for your level (Level {{ currentLevel }}).</p>
      </div>

      <div v-if="availableContents.length === 0" class="text-center py-12 text-slate-400">
        No video content available for your level yet.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="item in availableContents" 
          :key="item.id" 
          class="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs space-y-3"
        >
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe 
              :src="item.videoUrl" 
              class="w-full h-full" 
              frameborder="0" 
              allowfullscreen
            ></iframe>
          </div>
          <div>
            <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md inline-block mb-1">
              Level {{ item.level }}
            </span>
            <h2 class="text-base font-bold text-slate-900">{{ item.title }}</h2>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>