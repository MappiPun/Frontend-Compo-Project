<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserService from '@/services/UserService'
import { errorMessage } from '@/services/api'
import type { User } from '@/types'
import UserCard from '@/components/UserCard.vue'
import Pagination from '@/components/Pagination.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { MAX_LEVEL, USERS_PER_PAGE } from '@/utils/constants'

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const provinces = ref<string[]>([])

// the page and the filters are kept in the URL query: /admin/users?page=2&q=som&level=1&province=Chiang%20Mai
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const level = computed(() => (route.query.level ? Number(route.query.level) : null))
const province = computed(() => (typeof route.query.province === 'string' ? route.query.province : ''))

const search = ref(q.value)
let timer: ReturnType<typeof setTimeout> | undefined

function updateQuery(patch: Record<string, string | number | null>) {
  const query: Record<string, string> = {}
  const merged: Record<string, string | number | null> = {
    q: q.value, level: level.value, province: province.value, page: page.value, ...patch,
  }
  for (const [k, v] of Object.entries(merged)) {
    if (v !== null && v !== '' && !(k === 'page' && Number(v) === 1)) query[k] = String(v)
  }
  router.push({ name: 'admin-users', query })
}

function onSearchInput() {
  clearTimeout(timer)
  timer = setTimeout(() => updateQuery({ q: search.value.trim(), page: 1 }), 350)
}
onBeforeUnmount(() => clearTimeout(timer))

const levelOptions = Array.from({ length: MAX_LEVEL }, (_, i) => ({ value: i + 1, label: `Level ${i + 1}` }))
const provinceOptions = computed(() => provinces.value.map((p) => ({ value: p, label: p })))
const hasFilter = computed(() => !!(q.value || level.value || province.value))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const response = await UserService.list({
      q: q.value, level: level.value, province: province.value, page: page.value, size: USERS_PER_PAGE,
    })
    users.value = response.data
    total.value = Number(response.headers['x-total-count'] ?? 0)
    const pages = Math.max(1, Math.ceil(total.value / USERS_PER_PAGE))
    if (page.value > pages) updateQuery({ page: pages }) // e.g. ?page=99
  } catch (e) {
    error.value = errorMessage(e, 'Cannot load the users')
  } finally {
    loading.value = false
  }
}

watch(() => route.query, () => { search.value = q.value; load() }, { immediate: true })
UserService.provinces().then((r) => (provinces.value = r.data)).catch(() => undefined)

function open(user: User) {
  router.push({ name: 'admin-user-info', params: { id: user.id } })
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-5">
    <div>
      <h1 class="page-title">Users</h1>
      <p class="text-sm text-slate-500">All registered users. Click a user to see the details.</p>
    </div>

    <!-- filters: name & surname, level, province (can be combined) -->
    <div class="card grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div class="sm:col-span-2">
        <label class="mb-1 block text-xs font-semibold text-slate-600">Name or surname</label>
        <input v-model="search" class="input" placeholder="Search..." @input="onSearchInput" />
      </div>
      <BaseSelect
        label="Level"
        placeholder="All levels"
        :model-value="level ?? ''"
        :options="levelOptions"
        @update:model-value="(v) => updateQuery({ level: v ? Number(v) : null, page: 1 })"
      />
      <BaseSelect
        label="Province"
        placeholder="All provinces"
        :model-value="province"
        :options="provinceOptions"
        @update:model-value="(v) => updateQuery({ province: v ? String(v) : '', page: 1 })"
      />
      <div v-if="hasFilter" class="sm:col-span-4">
        <button class="text-sm font-semibold text-brand-600 hover:underline" @click="router.push({ name: 'admin-users' })">
          Clear all filters
        </button>
      </div>
    </div>

    <p v-if="error" class="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ error }}</p>

    <div class="space-y-3" :class="{ 'opacity-50': loading }">
      <UserCard v-for="u in users" :key="u.id" :user="u" @open="open" />
      <div v-if="!loading && users.length === 0 && !error" class="card py-12 text-center text-slate-400">
        No users match your search.
      </div>
    </div>

    <Pagination :page="page" :total="total" :size="USERS_PER_PAGE" @change="(p) => updateQuery({ page: p })" />
  </div>
</template>
