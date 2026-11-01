<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ExamService from '@/services/ExamService'
import { errorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import type { ExamInfo, ExamQuestion, ExamResult } from '@/types'
import LevelBadge from '@/components/LevelBadge.vue'

const auth = useAuthStore()
const levels = useLevelStore()

const info = ref<ExamInfo | null>(null)
const questions = ref<ExamQuestion[]>([])
const answers = ref<Record<number, number>>({})
const result = ref<ExamResult | null>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  result.value = null
  answers.value = {}
  try {
    await auth.refresh()
    info.value = (await ExamService.info()).data
    questions.value = info.value.canTakeExam ? (await ExamService.questions()).data : []
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

const answered = computed(() => questions.value.filter((q) => answers.value[q.id] !== undefined).length)
const completed = computed(() => questions.value.length > 0 && answered.value === questions.value.length)

async function submit() {
  if (!completed.value) return // the exam cannot be submitted before it is completed
  submitting.value = true
  error.value = ''
  try {
    const payload = questions.value.map((q) => ({ questionId: q.id, selected: answers.value[q.id] as number }))
    result.value = (await ExamService.submit(payload)).data
    auth.setUser(result.value.user) // the level is upgraded immediately
    await levels.fetchLevels(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-5">
    <div v-if="loading" class="card py-12 text-center text-slate-400">Loading...</div>
    <p v-else-if="error && !result" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{{ error }}</p>

    <!-- result -->
    <section v-if="result" class="card p-8 text-center">
      <template v-if="result.passed">
        <LevelBadge :level="result.newLevel" :size="120" class="mx-auto" />
        <h1 class="mt-4 text-3xl font-extrabold text-emerald-600">You passed! 🎉</h1>
        <p class="mt-1 text-slate-600">You are now at <strong>Level {{ result.newLevel }}</strong> and received the new badge.</p>
      </template>
      <template v-else>
        <div class="text-6xl">😕</div>
        <h1 class="mt-3 text-3xl font-extrabold text-rose-600">Not passed yet</h1>
        <p class="mt-1 text-slate-600">Study the eLearning content and try again.</p>
      </template>
      <p class="mt-5 text-4xl font-black text-slate-900">{{ result.score }} <span class="text-xl text-slate-400">/ {{ result.totalQuestions }}</span></p>
      <p class="text-sm text-slate-500">Pass criteria: at least {{ result.passScore }} correct answers</p>
      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <RouterLink :to="{ name: 'user-home' }" class="btn-primary">See my level & benefits</RouterLink>
        <RouterLink :to="{ name: 'user-profile-history' }" class="btn-secondary">Exam history</RouterLink>
        <RouterLink v-if="!result.passed" :to="{ name: 'user-elearning' }" class="btn-secondary">Study again</RouterLink>
        <button v-if="!result.passed || result.newLevel < (info?.maxLevel ?? 4)" class="btn-secondary" @click="load">
          {{ result.passed ? 'Take the next exam' : 'Retry the exam' }}
        </button>
      </div>
    </section>

    <!-- no exam available -->
    <section v-else-if="info && !info.canTakeExam" class="card p-8 text-center">
      <LevelBadge :level="info.currentLevel" :size="96" class="mx-auto" />
      <h1 class="mt-4 text-2xl font-extrabold">Level {{ info.currentLevel }}</h1>
      <p class="mt-1 text-slate-600">{{ info.message }}</p>
    </section>

    <!-- the exam -->
    <template v-else-if="info">
      <div class="card">
        <div class="flex items-center gap-4">
          <LevelBadge :level="info.currentLevel" :size="56" />
          <div class="grow">
            <h1 class="text-xl font-extrabold">Level {{ info.examLevel }} → Level {{ info.examLevel + 1 }} exam</h1>
            <p class="text-sm text-slate-500">Pass with at least {{ info.passScore }} of {{ info.questionCount }} correct answers.</p>
          </div>
        </div>
        <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full bg-brand-600 transition-all" :style="{ width: `${(answered / Math.max(questions.length, 1)) * 100}%` }" />
        </div>
        <p class="mt-1 text-right text-xs text-slate-500">{{ answered }} / {{ questions.length }} answered</p>
      </div>

      <article v-for="(q, i) in questions" :key="q.id" class="card">
        <h2 class="font-bold">{{ i + 1 }}. {{ q.questionText }}</h2>
        <div class="mt-3 space-y-2">
          <label
            v-for="(o, idx) in q.options"
            :key="idx"
            class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition hover:bg-slate-50"
            :class="answers[q.id] === idx ? 'border-brand-500 bg-brand-50 font-semibold' : 'border-slate-200'"
          >
            <input v-model="answers[q.id]" type="radio" :name="`q${q.id}`" :value="idx" class="h-4 w-4 accent-brand-600" />
            {{ o }}
          </label>
        </div>
      </article>

      <p v-if="error" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{{ error }}</p>
      <div class="sticky bottom-4 flex justify-end">
        <button class="btn-primary px-8 py-3 shadow-lg" :disabled="!completed || submitting" @click="submit">
          {{ submitting ? 'Submitting...' : completed ? 'Submit answers' : `Answer all questions (${answered}/${questions.length})` }}
        </button>
      </div>
    </template>
  </div>
</template>
