<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'

const route = useRoute()
const router = useRouter()
const levelId = computed(() => Number(route.params.id))

// Mockup Data หรือดึงผ่าน Store/API ตามระบบเดิม
const levelTitle = ref('')
const passScore = ref(2)

onMounted(() => {
  levelTitle.value = `Level ${levelId.value} Configuration`
})

function goBack() {
  router.push('/admin')
}

function saveChanges() {
  alert(`Saved changes for Level ${levelId.value}`)
  goBack()
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

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 mb-1">Passing Criteria Score</label>
          <input 
            v-model="passScore" 
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