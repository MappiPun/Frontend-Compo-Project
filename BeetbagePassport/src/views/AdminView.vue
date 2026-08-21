<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserCard from '@/components/UserCard.vue'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const pageSize = 4
const currentPage = ref(Number(route.query.page) || 1)

// Sync page query param with URL
watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1
  }
)

const totalPages = computed(() => Math.ceil(userStore.users.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return userStore.users.slice(start, start + pageSize)
})

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { ...route.query, page } })
  }
}

function goToDetail(userId: string) {
  router.push(`/users/${userId}`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-slate-800">Admin Portal - User Management</h1>
      <UserProfileHeader />
    </header>

    <main class="max-w-6xl mx-auto p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserCard 
          v-for="user in paginatedUsers" 
          :key="user.id" 
          :user="user"
          @select="goToDetail"
          @toggle-status="userStore.toggleUserStatus"
        />
      </div>

      <!-- Pagination Component -->
      <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
        <span class="text-xs text-slate-500">Page {{ currentPage }} of {{ totalPages }}</span>
        <div class="flex space-x-2">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 disabled:opacity-40"
          >
            Previous
          </button>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  </div>
</template>