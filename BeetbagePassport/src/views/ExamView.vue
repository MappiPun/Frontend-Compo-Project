<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import UserNavigation from '@/components/UserNavigation.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

const authStore = useAuthStore()
const userStore = useUserStore()

type ExamCourse = {
  id: string
  level: number
  title: string
  description: string
  questionsCount: number
  passingScore: number
  questions: {
    id: string
    text: string
    options: string[]
    correctAnswer: number
  }[]
}

onMounted(async () => {
  if (typeof userStore.fetchUsers === 'function') await userStore.fetchUsers()
  if (typeof userStore.fetchLevels === 'function') await userStore.fetchLevels()
  if (typeof userStore.fetchQuestions === 'function') await userStore.fetchQuestions()
})

const currentLevel = computed(() => {
  const username = authStore.currentUser?.username
  const user = userStore.users.find((u) => u.username === username) || authStore.currentUser
  return Math.min(Math.max(user?.level ?? user?.currentLevel ?? 1, 1), 4)
})

const courses = computed<ExamCourse[]>(() => {
  const levelsSource = userStore.levels && userStore.levels.length > 0
    ? userStore.levels
    : [
        { level: 1, title: 'Level 1 Core Foundations', passScore: 3 },
        { level: 2, title: 'Level 2 Intermediate Skills', passScore: 3 },
        { level: 3, title: 'Level 3 Advanced Engineering', passScore: 4 },
        { level: 4, title: 'Level 4 Expert Mastery', passScore: 5 }
      ]

  return levelsSource
    .filter((level) => level.level >= 1 && level.level <= 4)
    .map((level) => {
      const questions = (userStore.questions || [])
        .filter((question) => question.level === level.level)
        .map((question) => ({
          id: String(question.id),
          text: question.questionText || (question as { text?: string }).text || '',
          options: question.options || [],
          correctAnswer: question.correctAnswer
        }))

      return {
        id: `level-${level.level}`,
        level: level.level,
        title: level.title ? `${level.title} Exam` : `Level ${level.level} Exam`,
        description: `Complete all ${questions.length} questions to reach the next passport level.`,
        questionsCount: questions.length,
        passingScore: level.passScore || 3,
        questions
      }
    })
})

const selectedCourse = ref<ExamCourse | null>(null)
const userAnswers = ref<Record<string, number>>({})
const isSubmitted = ref(false)
const score = ref(0)

function selectCourse(course: ExamCourse) {
  selectedCourse.value = course
  userAnswers.value = {}
  isSubmitted.value = false
  score.value = 0
}

function backToCourseList() {
  selectedCourse.value = null
  userAnswers.value = {}
  isSubmitted.value = false
  score.value = 0
}

async function submitExam() {
  if (!selectedCourse.value) return

  let correctCount = 0

  selectedCourse.value.questions.forEach((question) => {
    if (userAnswers.value[question.id] === question.correctAnswer) {
      correctCount += 1
    }
  })

  score.value = correctCount
  isSubmitted.value = true

  const passed = correctCount >= selectedCourse.value.passingScore

  if (authStore.currentUser?.username && typeof userStore.recordExamResult === 'function') {
    await userStore.recordExamResult(
      authStore.currentUser.username,
      selectedCourse.value.level,
      correctCount,
      selectedCourse.value.questions.length,
      passed
    )

    // ดึงข้อมูลผู้ใช้ล่าสุดหลังบันทึกผลสอบ
    if (typeof userStore.fetchUsers === 'function') {
      await userStore.fetchUsers()
    }

    const updatedUser = userStore.users.find((u) => u.username === authStore.currentUser?.username)
    if (updatedUser && authStore.currentUser) {
      // ซิงค์ข้อมูลเข้า Pinia AuthStore และ localStorage
      const mergedUser: User = {
        ...authStore.currentUser,
        ...updatedUser,
        email: updatedUser.email ?? authStore.currentUser.email,
        role: (updatedUser.role as 'admin' | 'user') ?? authStore.currentUser.role
      }
      authStore.setUser(mergedUser)
    }
  }
}

const isAllAnswered = computed(() => {
  if (!selectedCourse.value || selectedCourse.value.questions.length === 0) return false
  return selectedCourse.value.questions.every((q) => userAnswers.value[q.id] !== undefined)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
    <UserProfileHeader />
    <UserNavigation />

    <main class="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-300 p-6 space-y-6 mt-6 min-h-125">
      
      <div v-if="!selectedCourse" class="space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <h1 class="text-2xl font-bold text-slate-900">Select Exam / เลือกแบบทดสอบ</h1>
          <p class="text-sm text-slate-500 mt-1">เลือกวิชาจาก eLearning ที่ลงทะเบียนไว้เพื่อเริ่มทำแบบทดสอบอัปเกรด Level</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="course in courses" 
            :key="course.id"
            class="rounded-2xl p-6 shadow-xs border transition flex flex-col justify-between"
            :class="course.level <= currentLevel
              ? 'bg-white border-slate-200 hover:border-purple-500'
              : 'bg-slate-100 border-slate-200 opacity-60'"
          >
            <div>
              <div class="flex items-center justify-between gap-3 mb-3">
                <span
                  class="text-xs font-bold px-2.5 py-1 rounded-md inline-block"
                  :class="course.level <= currentLevel ? 'text-purple-600 bg-purple-50' : 'text-slate-500 bg-slate-200'"
                >
                  Level {{ course.level }} · {{ course.questionsCount }} Questions
                </span>
                <span
                  v-if="course.level > currentLevel"
                  class="text-xs font-bold text-slate-500"
                >
                  Unavailable
                </span>
              </div>
              <h2 class="text-lg font-bold mb-2" :class="course.level <= currentLevel ? 'text-slate-900' : 'text-slate-500'">{{ course.title }}</h2>
              <p class="text-sm leading-relaxed mb-4" :class="course.level <= currentLevel ? 'text-slate-600' : 'text-slate-400'">{{ course.description }}</p>
            </div>

            <button
              @click="selectCourse(course)"
              :disabled="course.level > currentLevel"
              class="w-full py-2.5 font-bold rounded-xl shadow-xs transition text-sm"
              :class="course.level <= currentLevel
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'"
            >
              {{ course.level <= currentLevel ? 'Start Exam →' : 'Locked' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span class="text-xs font-bold text-purple-600 uppercase tracking-wider">Exam Session</span>
            <h2 class="text-xl font-bold text-slate-900">{{ selectedCourse.title }}</h2>
          </div>
          <button 
            @click="backToCourseList" 
            class="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg transition"
          >
            ← Change Exam
          </button>
        </div>

        <div v-if="isSubmitted" class="bg-white p-6 rounded-2xl shadow-md border-2 text-center" :class="score >= selectedCourse.passingScore ? 'border-green-500 bg-green-50/20' : 'border-red-400 bg-red-50/20'">
          <h3 class="text-2xl font-extrabold" :class="score >= selectedCourse.passingScore ? 'text-green-600' : 'text-red-600'">
            {{ score >= selectedCourse.passingScore ? '🎉 Passed!' : '❌ Not Passed' }}
          </h3>
          <p class="text-slate-700 mt-2 font-medium">Your Score: <span class="font-bold text-lg">{{ score }} / {{ selectedCourse.questions.length }}</span></p>
          <button 
            @click="backToCourseList" 
            class="mt-4 px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition"
          >
            Back to Course List
          </button>
        </div>

        <div 
          v-for="q in selectedCourse.questions" 
          :key="q.id" 
          class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200"
        >
          <h3 class="font-bold text-slate-900 text-base mb-4">{{ q.text }}</h3>

          <div class="space-y-2.5">
            <label 
              v-for="(option, idx) in q.options" 
              :key="idx"
              class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition text-sm text-slate-700"
              :class="{ 'border-purple-500 bg-purple-50/40 font-medium': userAnswers[q.id] === idx }"
            >
              <input 
                type="radio" 
                :name="'question-' + q.id" 
                :value="idx" 
                v-model="userAnswers[q.id]"
                :disabled="isSubmitted"
                class="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <button
          v-if="!isSubmitted"
          @click="submitExam"
          :disabled="!isAllAnswered"
          class="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Exam
        </button>
      </div>

    </main>
  </div>
</template>