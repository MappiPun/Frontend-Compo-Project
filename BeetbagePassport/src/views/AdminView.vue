<script setup lang="ts">
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
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

const availableUsers = computed(() =>
  userStore.users.filter((user) => user.role !== 'admin' && user.username !== 'admin')
)

const totalPages = computed(() => Math.ceil(availableUsers.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return availableUsers.value.slice(start, start + pageSize)
})

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { ...route.query, page } })
  }
}

function goToDetail(username: string) {
  router.push({ path: '/users/profile', query: { username } })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <AdminProfileHeader />

    <main class="max-w-6xl mx-auto p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserCard 
          v-for="user in paginatedUsers" 
          :key="user.username" 
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