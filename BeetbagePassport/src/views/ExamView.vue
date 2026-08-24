<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const userLevel = computed(() => {
  const username = authStore.currentUser?.username
  const storedUser = userStore.users.find((u) => u.username === username)
  const level = storedUser?.level ?? authStore.currentUser?.level ?? 1
  return Math.min(Math.max(level, 1), 4)
})
const filteredQuestions = computed(() => userStore.questions.filter((q) => q.level === userLevel.value))

const answers = ref<Record<string, number>>({})
const examResultStorageKey = `examResult:${authStore.currentUser?.username ?? 'unknown'}`
const savedExamResult = sessionStorage.getItem(examResultStorageKey)
const examResult = ref<{ score: number; total: number; passed: boolean } | null>(
  savedExamResult ? JSON.parse(savedExamResult) : null
)
const submitted = ref(examResult.value !== null)

function startNewExam() {
  sessionStorage.removeItem(examResultStorageKey)
  examResult.value = null
  submitted.value = false
  answers.value = {}
}

function clearExamResult() {
  sessionStorage.removeItem(examResultStorageKey)
  examResult.value = null
  submitted.value = false
  answers.value = {}
}

function returnToDashboard() {
  clearExamResult()
  router.replace({ name: 'user-dashboard' })
}

onUnmounted(() => {
  clearExamResult()
})

async function submitExam() {
  if (submitted.value) return

  let score = 0
  filteredQuestions.value.forEach((q) => {
    if (answers.value[q.id] === q.correctAnswer) {
      score++
    }
  })

  const total = filteredQuestions.value.length
  const passScore = userStore.getLevelDetail(userLevel.value)?.passScore || 2
  const passed = score >= passScore

  examResult.value = { score, total, passed }
  sessionStorage.setItem(examResultStorageKey, JSON.stringify(examResult.value))
  submitted.value = true

  if (authStore.currentUser) {
    try {
      await userStore.recordExamResult(authStore.currentUser.username, score, total, passed)
      const updatedUser = userStore.users.find((u) => u.username === authStore.currentUser?.username)
      if (updatedUser) {
        authStore.setUser({ ...authStore.currentUser, ...updatedUser, level: Math.min(updatedUser.level ?? 1, 4) })
      }
    } catch (error) {
      console.error('Failed to save exam result:', error)
    }
  }
}

</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto p-6 pt-0">
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

        <div class="flex flex-col items-center gap-3">
          <button
            @click="startNewExam"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700"
          >
            {{ examResult?.passed ? 'Next Exam' : 'Try Again' }}
          </button>

          <button
            @click="router.replace({ name: 'user-dashboard' })"
            class="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg text-xs font-medium hover:bg-indigo-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  </div>
</template>