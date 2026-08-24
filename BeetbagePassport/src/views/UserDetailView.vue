<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
import { apiClient } from '@/services/api'
import type { User } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const user = ref<User | null>(null)

const isAdmin = computed(() => authStore.currentUser?.role === 'admin')
const targetId = computed(() => route.params.id as string)

onMounted(async () => {
  const usernameParam = typeof route.query.username === 'string' ? route.query.username : null
  
  try {
    if (targetId.value) {
      const res = await apiClient.get<User>(`/users/${targetId.value}`)
      user.value = res.data
    } else if (usernameParam) {
      const res = await apiClient.get<User[]>(`/users?username=${encodeURIComponent(usernameParam)}`)
      user.value = res.data[0] ?? authStore.currentUser
    } else {
      user.value = authStore.currentUser
    }
  } catch (error) {
    console.error('Fetch user detail error:', error)
    user.value = authStore.currentUser
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <!-- Header สลับตาม Role -->
    <AdminProfileHeader v-if="isAdmin" />
    <template v-else>
      <UserProfileHeader />
      <UserNavigation />
    </template>

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-125 mt-6">
      
      <!-- ปุ่ม Back กรณีเป็น Admin -->
      <div v-if="isAdmin" class="mb-4">
        <RouterLink to="/admin" class="text-xs font-semibold text-purple-600 hover:underline">
          &larr; Back to Admin Dashboard
        </RouterLink>
      </div>

      <!-- Tab Navigation Styling -->
      <div class="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-8">
        <RouterLink 
          :to="isAdmin && targetId ? `/admin/users/${targetId}/info` : '/users/profile'" 
          :class="[
            'px-4 py-2 text-xs font-semibold rounded-lg transition',
            route.name === 'user-detail' || route.name === 'admin-user-info'
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          ]"
        >
          Details
        </RouterLink>
        <RouterLink 
          :to="isAdmin && targetId ? `/admin/users/${targetId}/history` : '/users/profile/history'" 
          :class="[
            'px-4 py-2 text-xs font-semibold rounded-lg transition',
            route.name === 'user-detail-history' || route.name === 'admin-user-history'
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          ]"
        >
          Exam History
        </RouterLink>
        <RouterLink 
          :to="isAdmin && targetId ? `/admin/users/${targetId}/badges` : '/users/profile/badges'" 
          :class="[
            'px-4 py-2 text-xs font-semibold rounded-lg transition',
            route.name === 'user-detail-badges' || route.name === 'admin-user-badges'
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          ]"
        >
          Badges
        </RouterLink>
      </div>

      <RouterView :user="user" :history="user?.examHistory ?? []" />
    </main>
  </div>
</template>