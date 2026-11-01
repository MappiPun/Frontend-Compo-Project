<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import AppAvatar from '@/components/AppAvatar.vue'

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)

const links = [
  { to: { name: 'admin-users' }, label: 'Users', icon: '👥', match: '/admin/users' },
  { to: { name: 'admin-levels' }, label: 'Levels & benefits', icon: '🏅', match: '/admin/levels' },
  { to: { name: 'admin-questions' }, label: 'Exam questions', icon: '📝', match: '/admin/questions' },
  { to: { name: 'admin-elearning' }, label: 'eLearning', icon: '🎬', match: '/admin/elearning' },
]

function logout() {
  auth.logout()
  useLevelStore().reset()
  router.push({ name: 'landing' })
}
</script>

<template>
  <div class="min-h-screen lg:flex">
    <!-- mobile top bar -->
    <header class="flex items-center justify-between bg-brand-900 px-4 py-3 text-white lg:hidden">
      <span class="text-lg font-black">CAMT <span class="text-brand-100">Passport</span> <small>Admin</small></span>
      <button class="btn bg-white/10 text-white" aria-label="Menu" @click="open = !open">☰</button>
    </header>

    <aside
      class="w-full shrink-0 flex-col bg-brand-900 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64"
      :class="open ? 'flex' : 'hidden'"
    >
      <div class="hidden px-6 py-6 lg:block">
        <p class="text-2xl font-black tracking-tight">CAMT <span class="text-brand-100">Passport</span></p>
        <p class="text-xs uppercase tracking-widest text-brand-100/70">Admin console</p>
      </div>
      <nav class="grow space-y-1 px-3 py-2">
        <RouterLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
          :class="{ 'bg-white/15 text-white': $route.path.startsWith(l.match) }"
          @click="open = false"
        >
          <span>{{ l.icon }}</span> {{ l.label }}
        </RouterLink>
      </nav>
      <div class="flex items-center gap-3 border-t border-white/10 px-4 py-4">
        <AppAvatar :src="auth.user?.profileImage" :name="auth.user?.name" :surname="auth.user?.surname" :size="40" />
        <div class="min-w-0 grow">
          <p class="truncate text-sm font-bold">{{ auth.user?.name }} {{ auth.user?.surname }}</p>
          <p class="text-xs text-white/60">Administrator</p>
        </div>
        <button class="btn bg-white/10 px-3 py-1.5 text-white hover:bg-white/20" @click="logout">Logout</button>
      </div>
    </aside>

    <main class="min-w-0 grow p-4 sm:p-8">
      <RouterView />
    </main>
  </div>
</template>
