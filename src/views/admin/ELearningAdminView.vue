<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import ELearningService from '@/services/ELearningService'
import { errorMessage } from '@/services/api'
import { useLevelStore } from '@/stores/level'
import { useToastStore } from '@/stores/toast'
import { toEmbedUrl } from '@/utils/format'
import type { ELearning } from '@/types'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const levels = useLevelStore()
const toast = useToastStore()
const items = ref<ELearning[]>([])
const editingId = ref<number | null>(null)
const saving = ref(false)

const schema = toTypedSchema(
  yup.object({
    level: yup.number().required().min(1),
    title: yup.string().trim().required('Title is required').max(255),
    description: yup.string().trim().max(1000).default(''),
    videoUrl: yup.string().trim().required('Video url is required').url('Enter a valid url (https://...)').max(500),
  }),
)
const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { level: 1, title: '', description: '', videoUrl: '' },
})
const [level, levelAttrs] = defineField('level')
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [videoUrl, videoUrlAttrs] = defineField('videoUrl')

const levelOptions = computed(() => levels.levels.map((l) => ({ value: l.level, label: `Level ${l.level}` })))

async function load() {
  try {
    items.value = (await ELearningService.list()).data
  } catch (e) {
    toast.error(errorMessage(e))
  }
}
onMounted(() => Promise.all([levels.fetchLevels(), load()]))

function edit(item: ELearning) {
  editingId.value = item.id
  resetForm({ values: { level: item.level, title: item.title, description: item.description ?? '', videoUrl: item.videoUrl } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function cancel() {
  editingId.value = null
  resetForm({ values: { level: 1, title: '', description: '', videoUrl: '' } })
}

const onSubmit = handleSubmit(async (values) => {
  saving.value = true
  const payload = {
    level: Number(values.level),
    title: values.title,
    description: values.description ?? '',
    videoUrl: toEmbedUrl(values.videoUrl),
  }
  try {
    if (editingId.value) await ELearningService.update(editingId.value, payload)
    else await ELearningService.create(payload)
    toast.success('Saved.')
    cancel()
    await load()
  } catch (e) {
    toast.error(errorMessage(e, 'Cannot save the content'))
  } finally {
    saving.value = false
  }
})

async function remove(item: ELearning) {
  if (!window.confirm(`Delete "${item.title}"?`)) return
  try {
    await ELearningService.remove(item.id)
    toast.success('Deleted.')
    await load()
  } catch (e) {
    toast.error(errorMessage(e))
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <div>
      <h1 class="page-title">eLearning content</h1>
      <p class="text-sm text-slate-500">Users see only the videos of their current level.</p>
    </div>

    <form class="card space-y-4" novalidate @submit.prevent="onSubmit">
      <h2 class="font-bold">{{ editingId ? 'Edit video' : 'Add a video' }}</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BaseSelect v-model="level" v-bind="levelAttrs" label="Level" :options="levelOptions" :error="errors.level" />
        <BaseInput v-model="title" v-bind="titleAttrs" label="Title" class="sm:col-span-2" :error="errors.title" />
      </div>
      <BaseInput v-model="description" v-bind="descriptionAttrs" label="Description" :error="errors.description" />
      <BaseInput v-model="videoUrl" v-bind="videoUrlAttrs" label="YouTube url" placeholder="https://www.youtube.com/watch?v=..." :error="errors.videoUrl" />
      <div class="flex justify-end gap-2">
        <button v-if="editingId" type="button" class="btn-secondary" @click="cancel">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="saving">{{ editingId ? 'Update' : 'Add video' }}</button>
      </div>
    </form>

    <div class="grid grid-cols-1 gap-3">
      <article v-for="v in items" :key="v.id" class="card flex items-center gap-4">
        <span class="rounded-lg bg-brand-100 px-3 py-2 text-sm font-bold text-brand-700">L{{ v.level }}</span>
        <div class="min-w-0 grow">
          <p class="truncate font-bold">{{ v.title }}</p>
          <p class="truncate text-xs text-slate-500">{{ v.description }}</p>
        </div>
        <button class="btn-secondary px-3 py-1" @click="edit(v)">Edit</button>
        <button class="btn-secondary px-3 py-1 text-rose-600" @click="remove(v)">Delete</button>
      </article>
      <p v-if="items.length === 0" class="card py-10 text-center text-slate-400">No content yet.</p>
    </div>
  </div>
</template>
