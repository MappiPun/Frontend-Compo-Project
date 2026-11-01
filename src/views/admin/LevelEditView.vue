<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useLevelStore } from '@/stores/level'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps<{ level: string }>()
const store = useLevelStore()
const toast = useToastStore()
const router = useRouter()
const saving = ref(false)
const notFound = ref(false)

const schema = toTypedSchema(
  yup.object({
    title: yup.string().trim().required('Title is required').max(255),
    description: yup.string().trim().max(1000).default(''),
    passScore: yup.number().typeError('Pass score must be a number').integer().min(1, 'At least 1').required(),
    benefits: yup
      .array()
      .of(yup.object({ description: yup.string().trim().required('Benefit is required').max(500) }))
      .default([]),
    services: yup
      .array()
      .of(
        yup.object({
          name: yup.string().trim().required('Service name is required').max(255),
          badge: yup.string().trim().max(255).default(''),
          description: yup.string().trim().max(1000).default(''),
        }),
      )
      .default([]),
  }),
)

const { defineField, handleSubmit, errors, resetForm } = useForm({ validationSchema: schema })
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [passScore, passScoreAttrs] = defineField('passScore')
const [benefits] = defineField('benefits')
const [services] = defineField('services')

const err = (key: string) => (errors.value as Record<string, string | undefined>)[key]

watch(
  () => props.level,
  async (n) => {
    await store.fetchLevels()
    const info = store.getLevel(Number(n))
    if (!info) {
      notFound.value = true
      return
    }
    resetForm({
      values: {
        title: info.title,
        description: info.description ?? '',
        passScore: info.passScore,
        benefits: info.benefits.map((b) => ({ description: b.description })),
        services: info.services.map((s) => ({ name: s.name, badge: s.badge ?? '', description: s.description ?? '' })),
      },
    })
  },
  { immediate: true },
)

const addBenefit = () => (benefits.value = [...(benefits.value ?? []), { description: '' }])
const removeBenefit = (i: number) => (benefits.value = (benefits.value ?? []).filter((_, idx) => idx !== i))
const addService = () => (services.value = [...(services.value ?? []), { name: '', badge: '', description: '' }])
const removeService = (i: number) => (services.value = (services.value ?? []).filter((_, idx) => idx !== i))

const onSubmit = handleSubmit(async (values) => {
  saving.value = true
  try {
    await store.updateLevel(Number(props.level), {
      title: values.title,
      description: values.description ?? '',
      passScore: Number(values.passScore),
      benefits: (values.benefits ?? []).map((b) => ({ description: b.description })),
      services: (values.services ?? []).map((s) => ({ name: s.name, badge: s.badge ?? '', description: s.description ?? '' })),
    })
    toast.success(`Level ${props.level} has been saved.`)
    router.push({ name: 'admin-level-detail', params: { level: props.level } })
  } catch (e) {
    toast.error(errorMessage(e, 'Cannot save the level'))
  } finally {
    saving.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <RouterLink :to="{ name: 'admin-levels' }" class="text-sm font-semibold text-brand-600 hover:underline">← All levels</RouterLink>
    <h1 class="page-title">Edit Level {{ level }}</h1>
    <div v-if="notFound" class="card py-12 text-center text-slate-400">Level not found.</div>

    <form v-else class="space-y-5" novalidate @submit.prevent="onSubmit">
      <section class="card space-y-4">
        <h2 class="font-bold">General & pass criteria</h2>
        <BaseInput v-model="title" v-bind="titleAttrs" label="Title" :error="errors.title" />
        <BaseInput v-model="description" v-bind="descriptionAttrs" multiline label="Description" :error="errors.description" />
        <BaseInput
          v-model="passScore"
          v-bind="passScoreAttrs"
          type="number"
          min="1"
          label="Pass score (minimum number of correct answers)"
          :error="errors.passScore"
        />
      </section>

      <section class="card space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Benefits</h2>
          <button type="button" class="btn-secondary" @click="addBenefit">+ Add benefit</button>
        </div>
        <div v-for="(b, i) in benefits" :key="i" class="flex items-start gap-2">
          <BaseInput v-model="b.description" class="grow" placeholder="Benefit description" :error="err(`benefits[${i}].description`)" />
          <button type="button" class="btn-secondary px-3 text-rose-600" aria-label="Remove" @click="removeBenefit(i)">✕</button>
        </div>
        <p v-if="!benefits?.length" class="text-sm text-slate-400">No benefits yet.</p>
      </section>

      <section class="card space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Services</h2>
          <button type="button" class="btn-secondary" @click="addService">+ Add service</button>
        </div>
        <div v-for="(s, i) in services" :key="i" class="space-y-2 rounded-xl border border-slate-200 p-3">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <BaseInput v-model="s.name" class="sm:col-span-2" placeholder="Service name" :error="err(`services[${i}].name`)" />
            <BaseInput v-model="s.badge" placeholder="Badge e.g. L1-LIB" />
          </div>
          <BaseInput v-model="s.description" placeholder="Description" />
          <button type="button" class="text-xs font-semibold text-rose-600 hover:underline" @click="removeService(i)">Remove service</button>
        </div>
        <p v-if="!services?.length" class="text-sm text-slate-400">No services yet.</p>
      </section>

      <div class="flex justify-end gap-2">
        <RouterLink :to="{ name: 'admin-level-detail', params: { level } }" class="btn-secondary">Cancel</RouterLink>
        <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save level' }}</button>
      </div>
    </form>
  </div>
</template>
