<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import AdminNavigation from '@/components/AdminNavigation.vue'
import { apiClient } from '@/services/api'

interface Question {
  id: string
  level: number
  questionText: string
  options: string[]
  correctAnswer: number
}

const route = useRoute()
const router = useRouter()
const levelId = computed(() => Number(route.params.id))

const passScore = ref<number>(2)
const questions = ref<Question[]>([])
const isLoading = ref<boolean>(false)


const newQuestionText = ref('')
const newOptions = ref(['', '', '', ''])
const newCorrectAnswer = ref(0)

const fetchLevelData = async () => {
  isLoading.value = true
  try {

    const levelRes = await apiClient.get(`/levels/${levelId.value}`)
    if (levelRes.data && levelRes.data.passScore !== undefined) {
      passScore.value = levelRes.data.passScore
    }

    const questionsRes = await apiClient.get(`/questions?level=${levelId.value}`)
    questions.value = questionsRes.data
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
  router.push('/admin?tab=levels')
}

async function addQuestion() {
  if (!newQuestionText.value.trim()) {
    alert('กรุณากรอกคำถาม')
    return
  }

  const newQ = {
    id: 'q_' + Date.now(),
    level: levelId.value,
    questionText: newQuestionText.value,
    options: [...newOptions.value],
    correctAnswer: Number(newCorrectAnswer.value)
  }

  try {
    await apiClient.post('/questions', newQ)
    questions.value.push(newQ)
    newQuestionText.value = ''
    newOptions.value = ['', '', '', '']
    newCorrectAnswer.value = 0
    alert('เพิ่มคำถามสำเร็จ')
  } catch (err) {
    console.error('Failed to add question:', err)
    alert('ไม่สามารถเพิ่มคำถามได้')
  }
}

async function deleteQuestion(questionId: string) {
  if (!confirm('คุณต้องการลบคำถามนี้ใช่หรือไม่?')) return

  try {
    await apiClient.delete(`/questions/${questionId}`)
    questions.value = questions.value.filter(q => q.id !== questionId)
    alert('ลบคำถามสำเร็จ')
  } catch (err) {
    console.error('Failed to delete question:', err)
    alert('ไม่สามารถลบคำถามได้')
  }
}

async function saveChanges() {
  if (passScore.value > questions.value.length) {
    passScore.value = questions.value.length
  }

  try {
    await apiClient.patch(`/levels/${levelId.value}`, {
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
    <div class="max-w-5xl mx-auto mt-6">
      <AdminNavigation />
    </div>

    <main class="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
      <div class="flex justify-between items-center border-b pb-4">
        <div>
          <button @click="goBack" class="text-xs text-purple-600 hover:underline mb-1">&larr; Go back</button>
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

      <div v-else class="space-y-6">
        <div>
          <label class="block text-xs font-semibold text-slate-500 mb-1">Passing Criteria Score</label>
          <input
            v-model.number="passScore"
            type="number"
            min="0"
            :max="questions.length"
            class="w-full md:w-1/3 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500"
          />
          <p class="text-[11px] text-slate-400 mt-1">Maximum passing score: {{ questions.length }}</p>
        </div>

        <hr />

        <div>
          <h3 class="text-sm font-semibold text-slate-700 mb-2">Exam Questions Management</h3>
          <p class="text-xs text-slate-400 mb-4">Add or remove exam questions specific to Level {{ levelId }}.</p>

          <div class="space-y-3 mb-6">
            <div v-for="(q, index) in questions" :key="q.id" class="p-3 border border-slate-200 rounded-lg bg-slate-50 flex justify-between items-start">
              <div>
                <p class="text-xs font-bold text-slate-700">Q{{ index + 1 }}: {{ q.questionText }}</p>
                <ul class="text-xs text-slate-500 mt-1 list-disc list-inside">
                  <li v-for="(opt, optIdx) in q.options" :key="optIdx" :class="{ 'text-green-600 font-semibold': optIdx === q.correctAnswer }">
                    {{ opt }} <span v-if="optIdx === q.correctAnswer">(Correct)</span>
                  </li>
                </ul>
              </div>
              <button @click="deleteQuestion(q.id)" class="text-xs text-red-500 hover:underline font-semibold">Delete</button>
            </div>
            <div v-if="questions.length === 0" class="text-xs text-slate-400">No questions available for this level.</div>
          </div>

          <div class="p-4 border border-dashed border-slate-300 rounded-lg space-y-3 bg-white">
            <h4 class="text-xs font-bold text-slate-700">Add New Question</h4>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Question Text</label>
              <input v-model="newQuestionText" type="text" placeholder="Enter question..." class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="i in 4" :key="i">
                <label class="block text-xs text-slate-500 mb-1">Option {{ i }} <span v-if="i-1 === newCorrectAnswer" class="text-green-600 font-bold">(Correct)</span></label>
                <div class="flex items-center space-x-2">
                  <input v-model="newOptions[i-1]" type="text" :placeholder="'Option ' + i" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                  <input type="radio" :value="i-1" v-model="newCorrectAnswer" title="Set as correct" />
                </div>
              </div>
            </div>
            <button @click="addQuestion" class="mt-2 px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition">
              + Add Question
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>