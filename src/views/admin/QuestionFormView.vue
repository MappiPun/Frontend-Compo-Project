<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import QuestionService from '@/services/QuestionService'
import { errorMessage } from '@/services/api'
import { useLevelStore } from '@/stores/level'
import { useToastStore } from '@/stores/toast'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const props = defineProps<{ id?: string }>()
const route = useRoute()
const router = useRouter()
const levels = useLevelStore()
const toast = useToastStore()
const saving = ref(false)
const isEdit = computed(() => !!props.id)

const schema = toTypedSchema(
  yup.object({
    level: yup.number().required('Select a level').min(1),
    questionText: yup.string().trim().required('The question is required').max(1000),
    options: yup
      .array()
      .of(yup.string().trim().required('The choice cannot be empty').max(500))
      .min(2, 'At least 2 choices')
      .max(6, 'At most 6 choices')
      .required(),
    correctAnswer: yup
      .number()
      .required('Select the correct answer')
      .min(0, 'Select the correct answer')
      .test('in-range', 'Select the correct answer', function (value) {
        const opts = this.parent.options as string[] | undefined
        return value !== undefined && !!opts && value < opts.length
      }),
  }),
)

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    level: Number(route.query.level) || 1,
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  },
})
const [level, levelAttrs] = defineField('level')
const [questionText, questionTextAttrs] = defineField('questionText')
const [options] = defineField('options')
const [correctAnswer] = defineField('correctAnswer')
const err = (key: string) => (errors.value as Record<string, string | undefined>)[key]

const levelOptions = computed(() => levels.levels.map((l) => ({ value: l.level, label: `Level ${l.level} - ${l.title}` })))

onMounted(async () => {
  await levels.fetchLevels()
  if (props.id) {
    try {
      const q = (await QuestionService.get(Number(props.id))).data
      resetForm({ values: { level: q.level, questionText: q.questionText, options: [...q.options], correctAnswer: q.correctAnswer } })
    } catch (e) {
      toast.error(errorMessage(e, 'Question not found'))
      router.replace({ name: 'admin-questions' })
    }
  }
})

const addOption = () => {
  if ((options.value?.length ?? 0) < 6) options.value = [...(options.value ?? []), '']
}
function removeOption(i: number) {
  const list = (options.value ?? []).filter((_, idx) => idx !== i)
  options.value = list
  if ((correctAnswer.value ?? 0) === i) correctAnswer.value = 0
  else if ((correctAnswer.value ?? 0) > i) correctAnswer.value = (correctAnswer.value ?? 0) - 1
}

const onSubmit = handleSubmit(async (values) => {
  saving.value = true
  const payload = {
    level: Number(values.level),
    questionText: values.questionText,
    options: values.options,
    correctAnswer: Number(values.correctAnswer),
  }
  try {
    if (props.id) await QuestionService.update(Number(props.id), payload)
    else await QuestionService.create(payload)
    toast.success(props.id ? 'The question has been updated.' : 'The question has been created.')
    router.push({ name: 'admin-questions', query: { level: payload.level } })
  } catch (e) {
    toast.error(errorMessage(e, 'Cannot save the question'))
  } finally {
    saving.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <RouterLink :to="{ name: 'admin-questions', query: { level: Number(level) || 1 } }" class="text-sm font-semibold text-brand-600 hover:underline">
      ← Questions
    </RouterLink>
    <h1 class="page-title">{{ isEdit ? 'Edit question' : 'New question' }}</h1>

    <form class="card space-y-5" novalidate @submit.prevent="onSubmit">
      <BaseSelect v-model="level" v-bind="levelAttrs" label="Level of the exam" :options="levelOptions" :error="errors.level" />
      <BaseInput v-model="questionText" v-bind="questionTextAttrs" multiline label="Question" placeholder="Type the question" :error="errors.questionText" />

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-slate-600">Choices (select the correct one)</p>
          <button type="button" class="btn-secondary px-3 py-1" :disabled="(options?.length ?? 0) >= 6" @click="addOption">+ Add choice</button>
        </div>
        <div v-for="(_, i) in options" :key="i" class="flex items-start gap-2">
          <input v-model="correctAnswer" type="radio" :value="i" class="mt-3 h-4 w-4 accent-emerald-600" :aria-label="`Choice ${i + 1} is correct`" />
          <BaseInput v-model="(options as string[])[i]" class="grow" :placeholder="`Choice ${String.fromCharCode(65 + i)}`" :error="err(`options[${i}]`)" />
          <button type="button" class="btn-secondary px-3 text-rose-600" :disabled="(options?.length ?? 0) <= 2" aria-label="Remove choice" @click="removeOption(i)">✕</button>
        </div>
        <p v-if="typeof errors.options === 'string'" class="text-xs font-medium text-rose-600">{{ errors.options }}</p>
        <p v-if="errors.correctAnswer" class="text-xs font-medium text-rose-600">{{ errors.correctAnswer }}</p>
      </div>

      <div class="flex justify-end gap-2">
        <RouterLink :to="{ name: 'admin-questions', query: { level: Number(level) || 1 } }" class="btn-secondary">Cancel</RouterLink>
        <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save question' }}</button>
      </div>
    </form>
  </div>
</template>
