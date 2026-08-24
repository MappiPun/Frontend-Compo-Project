<script setup lang="ts">
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserCard from '@/components/UserCard.vue'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const activeTab = ref<'users' | 'levels'>('users')
const pageSize = 4
const currentPage = ref(Number(route.query.page) || 1)

const searchQuery = ref('')
const selectedProvince = ref('')
const selectedLevel = ref<number | string>('')

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1
  }
)

const availableUsers = computed(() =>
  userStore.users.filter((user) => user.role !== 'admin' && user.username !== 'admin')
)

const provinces = computed(() => {
  const allProvinces = availableUsers.value
    .map((user) => user.province)
    .filter((province): province is string => Boolean(province))
  return Array.from(new Set(allProvinces))
})

const filteredUsers = computed(() => {
  return availableUsers.value.filter((user) => {
    const fullName = `${user.name || ''} ${user.surname || ''}`.toLowerCase()
    const matchName = fullName.includes(searchQuery.value.toLowerCase()) || 
                      user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchProvince = !selectedProvince.value || user.province === selectedProvince.value
    const matchLevel = !selectedLevel.value || user.level === Number(selectedLevel.value)
    
    return matchName && matchProvince && matchLevel
  })
})

watch([searchQuery, selectedProvince, selectedLevel], () => {
  changePage(1)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize) || 1)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { ...route.query, page: page.toString() } })
  }
}

function goToUserDetail(userId: string | number) {
  router.push(`/admin/users/${userId}/info`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <AdminProfileHeader />

    <main class="max-w-6xl mx-auto p-6 space-y-6">
      
      <!-- Admin Navigation Tabs -->
      <div class="flex border-b border-slate-200 space-x-4">
        <button
          @click="activeTab = 'users'"
          :class="[
            'pb-2 px-1 text-sm font-semibold transition-colors',
            activeTab === 'users' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          User Management
        </button>
        <button
          @click="activeTab = 'levels'"
          :class="[
            'pb-2 px-1 text-sm font-semibold transition-colors',
            activeTab === 'levels' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          Levels & Exam Criteria
        </button>
      </div>

      <!-- Tab 1: User Management -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Search User</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, surname..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Filter Province</label>
            <select
              v-model="selectedProvince"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Provinces</option>
              <option v-for="prov in provinces" :key="prov" :value="prov">
                {{ prov }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Filter Level</label>
            <select
              v-model="selectedLevel"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>
        </div>

        <div v-if="paginatedUsers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserCard 
            v-for="user in paginatedUsers" 
            :key="user.id || user.username" 
            :user="user"
            @select="goToUserDetail(user.id || user.username)"
            @toggle-status="userStore.toggleUserStatus"
          />
        </div>
        
        <div v-else class="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-sm">
          No users found matching the filter criteria.
        </div>

        <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span class="text-xs text-slate-500">Page {{ currentPage }} of {{ totalPages }}</span>
          
          <div class="flex space-x-2">
            <button 
              v-if="currentPage > 1"
              @click="changePage(currentPage - 1)" 
              class="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 hover:bg-slate-50 transition"
            >
              Previous
            </button>
            
            <button 
              v-if="currentPage < totalPages"
              @click="changePage(currentPage + 1)" 
              class="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Levels & Benefits Overview -->
      <div v-else class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 class="text-base font-bold text-slate-800">Level Criteria & Benefits Management</h2>
        <p class="text-xs text-slate-500">Configure level passing criteria, questions, and view benefits/services for each level.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div v-for="level in [1, 2, 3]" :key="level" class="p-4 border border-slate-200 rounded-lg space-y-2">
            <div class="font-bold text-sm text-purple-700">Level {{ level }}</div>
            <p class="text-xs text-slate-500">View services, benefits, and exam configuration.</p>
            <router-link 
              :to="`/admin/levels/${level}`" 
              class="inline-block text-xs font-semibold text-purple-600 hover:underline pt-2"
            >
              Manage Level {{ level }} &rarr;
            </router-link>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>