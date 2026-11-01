<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import ProfileImageUpload from '@/components/ProfileImageUpload.vue'
import { PROVINCES } from '@/utils/constants'

const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()
const serverError = ref('')
const loading = ref(false)

const schema = toTypedSchema(
  yup.object({
    username: yup
      .string()
      .trim()
      .required('Username is required')
      .min(3, 'At least 3 characters')
      .max(30, 'At most 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and _'),
    password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'The passwords do not match'),
    name: yup.string().trim().required('Name is required').max(100),
    surname: yup.string().trim().required('Surname is required').max(100),
    email: yup.string().trim().required('Email is required').email('Email is not valid'),
    phone: yup
      .string()
      .trim()
      .matches(/^$|^[0-9+\- ]{9,15}$/, 'Phone number is not valid (9-15 digits)')
      .default(''),
    province: yup.string().required('Please select a province'),
    profileImage: yup.string().default(''),
  }),
)

const { defineField, handleSubmit, errors, setFieldError } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '', password: '', confirmPassword: '', name: '', surname: '',
    email: '', phone: '', province: '', profileImage: '',
  },
})
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmAttrs] = defineField('confirmPassword')
const [name, nameAttrs] = defineField('name')
const [surname, surnameAttrs] = defineField('surname')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [province, provinceAttrs] = defineField('province')
const [profileImage] = defineField('profileImage')

const provinceOptions = computed(() => PROVINCES.map((p) => ({ value: p, label: p })))

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  loading.value = true
  try {
    await auth.register({
      username: values.username,
      password: values.password,
      name: values.name,
      surname: values.surname,
      email: values.email,
      phone: values.phone ?? '',
      province: values.province,
      profileImage: values.profileImage ?? '',
    })
    toast.success('Welcome to CAMT Passport! You start at Level 1.')
    await router.push({ name: 'user-home' }) // logged in right after registering
  } catch (e) {
    const message = errorMessage(e, 'Cannot create the account.')
    if (message.toLowerCase().includes('username')) setFieldError('username', message)
    else if (message.toLowerCase().includes('email')) setFieldError('email', message)
    else serverError.value = message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-50 via-white to-brand-100 p-4 sm:p-8">
    <div class="card w-full max-w-2xl p-6 shadow-xl sm:p-10">
      <RouterLink :to="{ name: 'landing' }" class="text-sm font-semibold text-brand-600 hover:underline">← Back to sign in</RouterLink>
      <h1 class="mt-3 text-3xl font-extrabold text-slate-900">Create your passport</h1>
      <p class="mb-6 mt-1 text-sm text-slate-500">Register now and start at Level 1.</p>

      <form class="space-y-5" novalidate @submit.prevent="onSubmit">
        <ProfileImageUpload v-model="profileImage" :name="name" :surname="surname" />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput v-model="username" v-bind="usernameAttrs" label="Username" placeholder="Username" autocomplete="username" :error="errors.username" class="sm:col-span-2" />
          <BaseInput v-model="name" v-bind="nameAttrs" label="Name" placeholder="Name" :error="errors.name" />
          <BaseInput v-model="surname" v-bind="surnameAttrs" label="Surname" placeholder="Surname" :error="errors.surname" />
          <BaseInput v-model="email" v-bind="emailAttrs" type="email" label="Email" placeholder="name@example.com" :error="errors.email" />
          <BaseInput v-model="phone" v-bind="phoneAttrs" label="Phone number (optional)" placeholder="0812345678" :error="errors.phone" />
          <BaseSelect v-model="province" v-bind="provinceAttrs" label="Province" placeholder="Select a province" :options="provinceOptions" :error="errors.province" class="sm:col-span-2" />
          <BaseInput v-model="password" v-bind="passwordAttrs" type="password" label="Password" placeholder="At least 6 characters" autocomplete="new-password" :error="errors.password" />
          <BaseInput v-model="confirmPassword" v-bind="confirmAttrs" type="password" label="Confirm password" placeholder="Repeat the password" autocomplete="new-password" :error="errors.confirmPassword" />
        </div>

        <p v-if="serverError" class="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">{{ serverError }}</p>

        <button type="submit" class="btn-primary w-full py-3" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>
    </div>
  </div>
</template>
