<script setup lang="ts">
import { ref, computed } from 'vue'

// ข้อมูลตัวอย่างคอร์ส eLearning และชุดข้อสอบ
const courses = ref([
  {
    id: 'c1',
    title: 'CAMT Passport Core Values & Basics',
    description: 'เรียนรู้ค่านิยมหลักและการใช้งานระบบ CAMT Passport เบื้องต้น',
    questionsCount: 2,
    passingScore: 50,
    questions: [
      {
        id: 1,
        text: '1. What is the primary core value of CAMT Passport?',
        options: ['Continuous Learning', 'Gaming Only', 'Social Networking', 'Food Service'],
        correctAnswer: 0
      },
      {
        id: 2,
        text: '2. How many main service levels exist in CAMT Passport?',
        options: ['2 Levels', '3 Levels', '4 Levels', '5 Levels'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'c2',
    title: 'Intermediate Web Security',
    description: 'ความรู้พื้นฐานเกี่ยวกับ Authentication และ Web Security สำหรับ Level 2',
    questionsCount: 2,
    passingScore: 50,
    questions: [
      {
        id: 1,
        text: '1. Which algorithm is commonly used for secure password hashing?',
        options: ['MD5', 'Bcrypt', 'Base64', 'Plain Text'],
        correctAnswer: 1
      },
      {
        id: 2,
        text: '2. What is the main purpose of HTTPS?',
        options: ['Encrypting Communication', 'Increasing Web Speed', 'Storing Passwords', 'Designing Layout'],
        correctAnswer: 0
      }
    ]
  }
])

const selectedCourse = ref<typeof courses.value[0] | null>(null)
const userAnswers = ref<Record<number, number>>({})
const isSubmitted = ref(false)
const score = ref(0)

function selectCourse(course: typeof courses.value[0]) {
  selectedCourse.value = course
  userAnswers.value = {}
  isSubmitted.value = false
  score.value = 0
}

function backToCourseList() {
  selectedCourse.value = null
  userAnswers.value = {}
  isSubmitted.value = false
}

function submitExam() {
  if (!selectedCourse.value) return

  let calculatedScore = 0
  selectedCourse.value.questions.forEach((q) => {
    if (userAnswers.value[q.id] === q.correctAnswer) {
      calculatedScore += 50
    }
  })

  score.value = calculatedScore
  isSubmitted.value = true
}

const isAllAnswered = computed(() => {
  if (!selectedCourse.value) return false
  return selectedCourse.value.questions.every((q) => userAnswers.value[q.id] !== undefined)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-8 px-4 font-sans text-slate-800">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- หน้าต่างเลือกวิชา -->
      <div v-if="!selectedCourse" class="space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <h1 class="text-2xl font-bold text-slate-900">Select Exam / เลือกแบบทดสอบ</h1>
          <p class="text-sm text-slate-500 mt-1">เลือกวิชาจาก eLearning ที่ลงทะเบียนไว้เพื่อเริ่มทำแบบทดสอบอัปเกรด Level</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="course in courses" 
            :key="course.id"
            class="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-purple-500 transition flex flex-col justify-between"
          >
            <div>
              <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md inline-block mb-3">
                {{ course.questionsCount }} Questions
              </span>
              <h2 class="text-lg font-bold text-slate-900 mb-2">{{ course.title }}</h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-4">{{ course.description }}</p>
            </div>

            <button
              @click="selectCourse(course)"
              class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition text-sm"
            >
              Start Exam →
            </button>
          </div>
        </div>
      </div>

      <!-- หน้าทำแบบทดสอบ -->
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
          <p class="text-slate-700 mt-2 font-medium">Your Score: <span class="font-bold text-lg">{{ score }} / 100</span></p>
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

    </div>
  </div>
</template>