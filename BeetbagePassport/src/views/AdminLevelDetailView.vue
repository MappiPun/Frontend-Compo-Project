<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const levelId = computed(() => Number(route.params.id))

const passScore = ref<number>(2)
const isLoading = ref<boolean>(false)

const fetchLevelData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`http://localhost:3000/levels/${levelId.value}`)
    if (res.data && res.data.passScore !== undefined) {
      passScore.value = res.data.passScore
    }
  } catch (err) {
    console.error('Failed to fetch level data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLevelData()
})

function goBack() {
  router.push('/admin')
}

async function saveChanges() {
  try {
    await axios.patch(`http://localhost:3000/levels/${levelId.value}`, {
      passScore: Number(passScore.value)
    })
    alert(`Saved changes for Level ${levelId.value}`)
    goBack()
  } catch (err) {
    console.error('Failed to update level:', err)
    alert('Failed to save changes.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <AdminProfileHeader />

    <main class="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
      <div class="flex justify-between items-center border-b pb-4">
        <div>
          <button @click="goBack" class="text-xs text-purple-600 hover:underline mb-1">&larr; Back to Admin</button>
          <h1 class="text-lg font-bold text-slate-800">Manage Level {{ levelId }}</h1>
        </div>
        <button 
          @click="saveChanges" 
          class="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          Save Changes
        </button>
      </div>

      <div v-if="isLoading" class="text-xs text-slate-400 py-4">
        Loading...
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 mb-1">Passing Criteria Score</label>
          <input 
            v-model.number="passScore" 
            type="number" 
            class="w-full md:w-1/3 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500" 
          />
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-700 mb-2">Benefits & Exam Questions</h3>
          <p class="text-xs text-slate-400">Configure exams and benefits specific to Level {{ levelId }}.</p>
        </div>
      </div>
    </main>
  </div>
</template>