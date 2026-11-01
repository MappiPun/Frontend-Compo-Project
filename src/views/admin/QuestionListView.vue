<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import QuestionService from '@/services/QuestionService'
import { errorMessage } from '@/services/api'
import { useLevelStore } from '@/stores/level'
import { useToastStore } from '@/stores/toast'
import type { Question } from '@/types'

const route = useRoute()
const router = useRouter()
const levels = useLevelStore()
const toast = useToastStore()

const questions = ref<Question[]>([])
const loading = ref(false)
const level = computed(() => Number(route.query.level) || 1)
const info = computed(() => levels.getLevel(level.value))
const maxLevel = computed(() => Math.max(...levels.levels.map((l) => l.level), 1))

async function load() {
  loading.value = true
  try {
    questions.value = (await QuestionService.list(level.value)).data
  } catch (e) {
    toast.error(errorMessage(e))
  } finally {
    loading.value = false
  }
}
onMounted(() => levels.fetchLevels(true))
watch(level, load, { immediate: true })

async function remove(q: Question) {
  if (!window.confirm('Delete this question? It will not be used in the next exam.')) return
  try {
    await QuestionService.remove(q.id)
    toast.success('The question has been deleted.')
    await Promise.all([load(), levels.fetchLevels(true)])
  } catch (e) {
    toast.error(errorMessage(e))
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="page-title">Exam questions</h1>
        <p class="text-sm text-slate-500">The questions of the exam which upgrades a user to the next level.</p>
      </div>
      <RouterLink :to="{ name: 'admin-question-new', query: { level } }" class="btn-primary">+ New question</RouterLink>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="l in levels.levels"
        :key="l.level"
        class="btn"
        :class="l.level === level ? 'bg-brand-600 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
        @click="router.push({ query: { level: l.level } })"
      >
        Level {{ l.level }} <span class="rounded-full bg-black/10 px-1.5 text-xs">{{ l.questionCount }}</span>
      </button>
    </div>

    <p v-if="level >= maxLevel" class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Level {{ level }} is the highest level, so there is no upgrade exam for it.
    </p>
    <p v-else-if="info && info.questionCount < info.passScore" class="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
      The pass criteria is {{ info.passScore }} correct answers but this level has only {{ info.questionCount }} questions.
      Nobody can pass until you add more questions or lower the pass score.
    </p>

    <div class="space-y-3" :class="{ 'opacity-50': loading }">
      <article v-for="(q, i) in questions" :key="q.id" class="card">
        <div class="flex items-start justify-between gap-3">
          <h2 class="font-bold text-slate-900">{{ i + 1 }}. {{ q.questionText }}</h2>
          <div class="flex shrink-0 gap-2">
            <RouterLink :to="{ name: 'admin-question-edit', params: { id: q.id } }" class="btn-secondary px-3 py-1">Edit</RouterLink>
            <button class="btn-secondary px-3 py-1 text-rose-600" @click="remove(q)">Delete</button>
          </div>
        </div>
        <ul class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <li
            v-for="(o, idx) in q.options"
            :key="idx"
            class="rounded-lg border px-3 py-2 text-sm"
            :class="idx === q.correctAnswer ? 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-800' : 'border-slate-200 text-slate-600'"
          >
            {{ String.fromCharCode(65 + idx) }}. {{ o }} <span v-if="idx === q.correctAnswer">✔</span>
          </li>
        </ul>
      </article>
      <div v-if="!loading && questions.length === 0" class="card py-12 text-center text-slate-400">
        No questions for Level {{ level }} yet.
      </div>
    </div>
  </div>
</template>
