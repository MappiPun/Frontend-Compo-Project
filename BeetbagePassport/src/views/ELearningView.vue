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

const levelsList = computed(() => {
  const result = []
  for (let lvl = 1; lvl <= currentLevel.value; lvl++) {
    const items = elearningStore.contents.filter((item) => Number(item.level) === lvl)
    result.push({
      level: lvl,
      items
    })
  }
  return result
})

const hasAnyContent = computed(() => {
  return levelsList.value.some((group) => group.items.length > 0)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-6 space-y-8 mt-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">eLearning Content</h1>
        <p class="text-sm text-slate-500 mt-1">Video content available for your level (Level {{ currentLevel }}).</p>
      </div>

      <div v-if="!hasAnyContent" class="text-center py-12 text-slate-400">
        No video content available for your level yet.
      </div>

      <div v-else class="space-y-10">
        <div 
          v-for="group in levelsList" 
          :key="group.level"
          class="space-y-4"
        >
          <div class="flex items-center space-x-3 border-b border-slate-200 pb-3">
            <span class="text-sm font-bold bg-purple-600 text-white px-3 py-1 rounded-lg">
              Level {{ group.level }}
            </span>
            <span class="text-xs text-slate-500 font-medium">
              ({{ group.items.length }} {{ group.items.length === 1 ? 'video' : 'videos' }})
            </span>
          </div>

          <div v-if="group.items.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="item in group.items" 
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

          <div v-else class="text-xs text-slate-400 italic py-2 pl-1">
            No video content available for Level {{ group.level }} yet.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>