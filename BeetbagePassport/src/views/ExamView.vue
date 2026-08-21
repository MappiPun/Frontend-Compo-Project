<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const userLevel = computed(() => authStore.currentUser?.level || 1)
const filteredQuestions = computed(() => userStore.questions.filter((q) => q.level === userLevel.value))

const answers = ref<Record<string, number>>({})
const submitted = ref(false)
const examResult = ref<{ score: number; total: number; passed: boolean } | null>(null)

function submitExam() {
  let score = 0
  filteredQuestions.value.forEach((q) => {
    if (answers.value[q.id] === q.correctAnswer) {
      score++
    }
  })

  const total = filteredQuestions.value.length
  const passScore = userStore.getLevelDetail(userLevel.value)?.passScore || 2
  const passed = score >= passScore

  if (authStore.currentUser) {
    userStore.recordExamResult(authStore.currentUser.id, score, total, passed)
  }

  examResult.value = { score, total, passed }
  submitted.value = true
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-slate-800">Level {{ userLevel }} Exam</h1>
      <UserProfileHeader />
    </header>

    <main class="max-w-2xl mx-auto p-6">
      <div v-if="!submitted" class="space-y-6">
        <div v-for="(q, index) in filteredQuestions" :key="q.id" class="bg-white p-6 rounded-xl border border-slate-100">
          <p class="font-bold text-sm text-slate-800 mb-4">{{ index + 1 }}. {{ q.questionText }}</p>
          <div class="space-y-2">
            <label 
              v-for="(opt, optIndex) in q.options" 
              :key="optIndex"
              class="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs"
            >
              <input type="radio" :name="q.id" :value="optIndex" v-model="answers[q.id]" />
              <span>{{ opt }}</span>
            </label>
          </div>
        </div>

        <button 
          @click="submitExam"
          class="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
        >
          Submit Exam
        </button>
      </div>

      <!-- Result Screen -->
      <div v-else class="bg-white p-8 rounded-2xl text-center space-y-4 border border-slate-100">
        <h2 class="text-2xl font-bold" :class="examResult?.passed ? 'text-green-600' : 'text-red-500'">
          {{ examResult?.passed ? 'Congratulations! You Passed!' : 'Exam Failed' }}
        </h2>
        <p class="text-sm text-slate-600">
          Score: {{ examResult?.score }} / {{ examResult?.total }}
        </p>
        <button 
          @click="router.push('/user')" 
          class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  </div>
</template>