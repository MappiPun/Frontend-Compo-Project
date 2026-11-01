<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { errorMessage } from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import LevelBadge from '@/components/LevelBadge.vue'

const auth = useAuthStore()
const router = useRouter()
const serverError = ref('')
const loading = ref(false)

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string().trim().required('Please enter your username'),
      password: yup.string().required('Please enter your password'),
    }),
  ),
  initialValues: { username: '', password: '' },
})
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  loading.value = true
  try {
    // the username and the password are checked by the backend, which returns the JWT token
    const user = await auth.login(values.username, values.password)
    // admin -> the admin page, user -> the user page
    await router.push(user.role === 'admin' ? { name: 'admin-users' } : { name: 'user-home' })
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 401) {
      serverError.value = 'Invalid username or password.'
    } else {
      serverError.value = errorMessage(e, 'Unable to sign in.')
    }
  } finally {
    loading.value = false
  }
})

function fill(u: string, p: string) {
  setValues({ username: u, password: p })
}

const tiers = [
  { level: 1, name: 'Basic Access' },
  { level: 2, name: 'Intermediate' },
  { level: 3, name: 'Advanced' },
  { level: 4, name: 'Expert VIP' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col bg-linear-to-br from-brand-50 via-white to-brand-100">
    <header class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <span class="text-2xl font-black tracking-tight text-slate-900">CAMT <span class="text-brand-600">Passport</span></span>
      <RouterLink :to="{ name: 'register' }" class="btn-secondary">Create account</RouterLink>
    </header>

    <main class="mx-auto grid w-full max-w-6xl grow items-center gap-10 px-6 py-8 lg:grid-cols-12">
      <section class="space-y-6 lg:col-span-7">
        <span class="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
          Digital learning & assessment platform
        </span>
        <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Level up your skills.<br />Unlock exclusive services.
        </h1>
        <p class="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
          เรียน eLearning ทำแบบทดสอบ แล้วอัปเกรดระดับบริการตั้งแต่ Level 1 ถึง Level 4
          พร้อมรับตราสัญลักษณ์และสิทธิประโยชน์มากมาย
        </p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="t in tiers" :key="t.level" class="card flex flex-col items-center p-3 text-center">
            <LevelBadge :level="t.level" :size="52" />
            <span class="mt-2 text-[11px] font-bold uppercase text-slate-400">Level {{ t.level }}</span>
            <span class="text-sm font-bold text-slate-700">{{ t.name }}</span>
          </div>
        </div>
      </section>

      <section class="lg:col-span-5">
        <div class="card mx-auto w-full max-w-md p-8 shadow-xl">
          <h2 class="text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p class="mb-6 mt-1 text-sm text-slate-500">Sign in to continue</p>

          <form class="space-y-4" novalidate @submit.prevent="onSubmit">
            <BaseInput
              v-model="username"
              v-bind="usernameAttrs"
              label="Username"
              placeholder="Username"
              autocomplete="username"
              :error="errors.username"
            />
            <BaseInput
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              label="Password"
              placeholder="Password"
              autocomplete="current-password"
              :error="errors.password"
            />
            <p v-if="serverError" class="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">
              {{ serverError }}
            </p>
            <button type="submit" class="btn-primary w-full py-2.5" :disabled="loading">
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>

          <div class="mt-6 border-t border-slate-100 pt-4">
            <p class="mb-2 text-[11px] font-semibold text-slate-400">Demo accounts (click to fill)</p>
            <div class="flex gap-2">
              <button class="btn-secondary grow py-1 text-xs" type="button" @click="fill('user1', 'password')">user1</button>
              <button class="btn-secondary grow py-1 text-xs" type="button" @click="fill('user2', 'password')">user2</button>
              <button class="btn-secondary grow py-1 text-xs" type="button" @click="fill('admin', 'adminpassword')">admin</button>
            </div>
          </div>

          <p class="mt-5 text-sm text-slate-500">
            Don't have an account?
            <RouterLink :to="{ name: 'register' }" class="font-semibold text-brand-600 hover:underline">Sign up</RouterLink>
          </p>
        </div>
      </section>
    </main>

    <footer class="py-4 text-center text-xs text-slate-400">© 2026 CAMT Passport · SE331 Term Project II</footer>
  </div>
</template>
