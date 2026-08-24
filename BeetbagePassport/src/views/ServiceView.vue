<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
import level1Badge from '@/assets/badge/level1badge_icon.png'
import level2Badge from '@/assets/badge/level2badge_icon.png'
import level3Badge from '@/assets/badge/level3badge_icon.png'
import level4Badge from '@/assets/badge/level4badge_icon.png'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const currentLevelData = computed(() => {
  const user = userStore.users.find((u) => u.username === authStore.currentUser?.username)
  const level = Math.min(Math.max(user?.level ?? 1, 1), 4)
  return userStore.getLevelDetail(level)
})

const allServices = computed(() => {
  return [1, 2, 3, 4].flatMap((level) => {
    const levelData = userStore.getLevelDetail(level)
    return (levelData?.services ?? []).map((service) => ({
      ...service,
      level,
      available: level <= (currentLevelData.value?.level ?? 1)
    }))
  })
})

const currentPage = ref(1)
const servicesPerPage = 3
const totalPages = computed(() => Math.ceil(allServices.value.length / servicesPerPage))
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * servicesPerPage
  return allServices.value.slice(start, start + servicesPerPage)
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = Math.max(1, pages)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-8 shadow-sm min-h-125">
      <div class="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900">Services</h1>
          <p class="text-sm text-slate-400 mt-1">Services available with your current CAMT Passport level.</p>
        </div>
        <button
          type="button"
          class="text-xs font-semibold text-purple-600 hover:text-purple-700"
          @click="router.push('/user')"
        >
          Back to Home
        </button>
      </div>

      <div class="border border-slate-300 rounded-2xl p-6">
        <div class="flex items-center justify-between gap-4 mb-5">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Level</p>
            <h2 class="text-xl font-extrabold text-purple-600 mt-1">{{ currentLevelData?.title }}</h2>
          </div>
          <span class="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold">
            Level {{ currentLevelData?.level }}
          </span>
        </div>

        <div v-if="allServices.length" class="space-y-3">
          <div
            v-for="service in paginatedServices"
            :key="service.id"
            :class="[
              'w-full border rounded-xl p-5 flex items-center gap-5 transition-colors',
              service.available ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-slate-100'
            ]"
          >
            <div :class="['min-w-0 flex-1', !service.available && 'opacity-50']">
              <div class="flex items-center gap-3">
                <h3 class="font-bold text-slate-800 text-sm">{{ service.name }}</h3>
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 text-[10px] font-bold',
                    service.available ? 'text-emerald-600' : 'text-slate-400'
                  ]"
                >
                  <span
                    :class="[
                      'w-2 h-2 rounded-full',
                      service.available ? 'bg-emerald-500' : 'bg-slate-400'
                    ]"
                  ></span>
                  {{ service.available ? 'Available' : 'Unavailable' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">{{ service.description }}</p>
            </div>
            <div
              :class="[
                'w-20 h-20 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center',
                !service.available && 'grayscale opacity-50'
              ]"
            >
              <img
                :src="service.level === 1 ? level1Badge : service.level === 2 ? level2Badge : service.level === 3 ? level3Badge : level4Badge"
                :alt="`Level ${service.level} badge`"
                class="w-16 h-16 object-contain"
              />
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-slate-500">No services are currently available.</p>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            :disabled="currentPage === 1"
            @click="currentPage = 1"
            class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            First
          </button>
          <button
            type="button"
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Previous
          </button>
          <span class="px-3 text-xs font-semibold text-slate-500">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            type="button"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
          <button
            type="button"
            :disabled="currentPage === totalPages"
            @click="currentPage = totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Last
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
