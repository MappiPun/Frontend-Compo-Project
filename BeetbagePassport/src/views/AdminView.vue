<script setup lang="ts">
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useELearningStore } from '@/stores/elearning'
import UserCard from '@/components/UserCard.vue'
import { apiClient } from '@/services/api'
import axios from 'axios'

interface LevelData {
  id: string
  level: number
  title: string
  passScore: number
  benefits: { id: string; description: string }[]
  services: { id: string; name: string; description: string }[]
}

const userStore = useUserStore()
const elearningStore = useELearningStore()
const route = useRoute()
const router = useRouter()

const activeTab = ref<'users' | 'levels' | 'elearning'>('users')
const pageSize = 4
const currentPage = ref(Number(route.query.page) || 1)

const searchQuery = ref('')
const selectedProvince = ref('')
const selectedLevel = ref<number | string>('')

const newTitle = ref('')
const newDescription = ref('')
const newLevel = ref(1)
const newVideoUrl = ref('')

const levelsList = [1, 2, 3, 4]
const levelsData = ref<LevelData[]>([])

const fetchUsers = async () => {
  if (typeof userStore.fetchUsers === 'function') {
    await userStore.fetchUsers()
  }
}

const fetchLevels = async () => {
  try {
    const res = await axios.get('http://localhost:3000/levels')
    levelsData.value = res.data
  } catch (err) {
    console.error('Failed to fetch levels:', err)
  }
}

onMounted(() => {
  fetchUsers()
  fetchLevels()
})

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
    
    const userLevel = user.level ?? user.currentLevel
    const matchLevel = !selectedLevel.value || userLevel === Number(selectedLevel.value)
    
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

async function handleDeleteUser(userId: string | number) {
  try {
    await apiClient.delete(`/users/${userId}`)
    userStore.users = userStore.users.filter(u => u.id !== userId && u.username !== userId)
    alert('User deleted successfully.')
  } catch (error) {
    console.error('Delete user error:', error)
    alert('Failed to delete user.')
  }
}

function handleAddELearning() {
  if (!newTitle.value || !newVideoUrl.value) return

  let embedUrl = newVideoUrl.value
  const match = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (match && match[1]) {
    embedUrl = `https://www.youtube.com/embed/${match[1]}`
  }

  elearningStore.addContent({
    title: newTitle.value,
    description: newDescription.value,
    level: Number(newLevel.value),
    videoUrl: embedUrl
  })

  newTitle.value = ''
  newDescription.value = ''
  newLevel.value = 1
  newVideoUrl.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <AdminProfileHeader />

    <main class="max-w-6xl mx-auto p-6 space-y-6">
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
        <button
          @click="activeTab = 'elearning'"
          :class="[
            'pb-2 px-1 text-sm font-semibold transition-colors',
            activeTab === 'elearning' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          eLearning Management
        </button>
      </div>

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
              <option v-for="level in levelsList" :key="level" :value="level">
                Level {{ level }}
              </option>
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
            @delete-user="handleDeleteUser"
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

      <div v-else-if="activeTab === 'levels'" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 class="text-base font-bold text-slate-800">Level Criteria & Benefits Management</h2>
        <p class="text-xs text-slate-500">Configure level passing criteria, questions, and view benefits/services for each level.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div v-for="lvlData in levelsData" :key="lvlData.id" class="p-4 border border-slate-200 rounded-lg space-y-3 flex flex-col justify-between bg-slate-50">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="font-bold text-sm text-purple-700">Level {{ lvlData.level }}</span>
                <span class="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">Pass: {{ lvlData.passScore }} pts</span>
              </div>
              <h3 class="text-xs font-semibold text-slate-700 mb-2">{{ lvlData.title }}</h3>

              <div class="space-y-1 mb-3">
                <p class="text-[11px] font-bold text-slate-500">Benefits:</p>
                <ul class="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                  <li v-for="b in lvlData.benefits" :key="b.id" class="truncate">{{ b.description }}</li>
                </ul>
              </div>

              <div class="space-y-1">
                <p class="text-[11px] font-bold text-slate-500">Services:</p>
                <ul class="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                  <li v-for="s in lvlData.services" :key="s.id" class="truncate">{{ s.name }}</li>
                </ul>
              </div>
            </div>

            <router-link 
              :to="`/admin/levels/${lvlData.level}`" 
              class="inline-block text-xs font-semibold text-purple-600 hover:underline pt-2 border-t border-slate-200"
            >
              Manage Level {{ lvlData.level }} &rarr;
            </router-link>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'elearning'" class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 class="text-base font-bold text-slate-800">Add New eLearning Video</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Title</label>
              <input
                v-model="newTitle"
                type="text"
                placeholder="Video Title..."
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Target Level</label>
              <select
                v-model="newLevel"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option :value="1">Level 1</option>
                <option :value="2">Level 2</option>
                <option :value="3">Level 3</option>
                <option :value="4">Level 4</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">YouTube URL</label>
            <input
              v-model="newVideoUrl"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea
              v-model="newDescription"
              rows="3"
              placeholder="Description..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
          <button
            @click="handleAddELearning"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition"
          >
            + Add Content
          </button>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 class="text-base font-bold text-slate-800">Existing eLearning Contents</h2>
          <div v-if="elearningStore.contents.length > 0" class="space-y-3">
            <div
              v-for="item in elearningStore.contents"
              :key="item.id"
              class="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50"
            >
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Level {{ item.level }}</span>
                <h3 class="text-xs font-bold text-slate-800 mt-1">{{ item.title }}</h3>
                <p class="text-[11px] text-slate-500">{{ item.description }}</p>
              </div>
              <button
                @click="elearningStore.deleteContent(item.id)"
                class="text-xs text-red-600 font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
          <div v-else class="text-center py-6 text-slate-400 text-xs">
            No content added yet.
          </div>
        </div>
      </div>

    </main>
  </div>
</template>