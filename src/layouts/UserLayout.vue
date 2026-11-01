<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import AppAvatar from '@/components/AppAvatar.vue'
import LevelBadge from '@/components/LevelBadge.vue'

const auth = useAuthStore()
const router = useRouter()
const menu = ref(false)

const links = [
  { to: { name: 'user-home' }, label: 'My level', match: 'exact' },
  { to: { name: 'user-elearning' }, label: 'eLearning', match: '/user/elearning' },
  { to: { name: 'user-exam' }, label: 'Exam', match: '/user/exam' },
]

function logout() {
  menu.value = false
  auth.logout()
  useLevelStore().reset()
  router.push({ name: 'landing' })
}
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <RouterLink :to="{ name: 'user-home' }" class="text-xl font-black tracking-tight text-slate-900">
          CAMT <span class="text-brand-600">Passport</span>
        </RouterLink>

        <nav class="ml-2 hidden items-center gap-1 sm:flex">
          <RouterLink
            v-for="l in links"
            :key="l.label"
            :to="l.to"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            :class="{
              'bg-brand-50 text-brand-700': l.match === 'exact' ? $route.name === 'user-home' : $route.path.startsWith(l.match),
            }"
          >
            {{ l.label }}
          </RouterLink>
        </nav>

        <!-- the profile (top right) -->
        <div class="relative ml-auto">
          <button class="flex cursor-pointer items-center gap-2 rounded-full p-1 hover:bg-slate-100" @click="menu = !menu">
            <span class="hidden items-center gap-1 pl-2 text-sm font-semibold text-slate-700 md:flex">
              {{ auth.user?.name }}
              <LevelBadge :level="auth.level" :size="22" />
            </span>
            <AppAvatar :src="auth.user?.profileImage" :name="auth.user?.name" :surname="auth.user?.surname" :size="40" />
          </button>
          <div
            v-if="menu"
            class="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
            @click="menu = false"
          >
            <div class="border-b border-slate-100 px-3 pb-2">
              <p class="truncate text-sm font-bold">{{ auth.user?.name }} {{ auth.user?.surname }}</p>
              <p class="text-xs text-slate-500">Level {{ auth.level }}</p>
            </div>
            <RouterLink :to="{ name: 'user-profile-details' }" class="mt-1 block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
              My profile
            </RouterLink>
            <button class="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- mobile menu -->
      <nav class="flex gap-1 border-t border-slate-100 px-3 py-2 sm:hidden">
        <RouterLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="grow rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-600"
          :class="{
            'bg-brand-50 text-brand-700': l.match === 'exact' ? $route.name === 'user-home' : $route.path.startsWith(l.match),
          }"
        >
          {{ l.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <RouterView />
    </main>
  </div>
</template>
