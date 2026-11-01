<script setup lang="ts">
import type { Level } from '@/types'
import LevelBadge from '@/components/LevelBadge.vue'

/** the title, the benefits and the services of a level (user home, user services, admin level detail) */
withDefaults(defineProps<{ level: Level; showServices?: boolean; showPass?: boolean }>(), {
  showServices: true,
  showPass: false,
})
</script>

<template>
  <section class="card">
    <div class="flex items-center gap-4">
      <LevelBadge :level="level.level" :size="72" />
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-brand-600">Level {{ level.level }}</p>
        <h2 class="text-xl font-extrabold text-slate-900">{{ level.title }}</h2>
        <p v-if="level.description" class="text-sm text-slate-500">{{ level.description }}</p>
      </div>
    </div>

    <p v-if="showPass" class="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Pass criteria: at least <strong>{{ level.passScore }}</strong> correct answers
      ({{ level.questionCount }} questions in the exam)
    </p>

    <h3 class="mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">Benefits</h3>
    <ul class="mt-2 space-y-2">
      <li v-for="(b, i) in level.benefits" :key="b.id ?? i" class="flex items-start gap-2 text-sm text-slate-700">
        <span class="mt-0.5 text-emerald-500">✔</span> {{ b.description }}
      </li>
      <li v-if="level.benefits.length === 0" class="text-sm text-slate-400">No benefits yet.</li>
    </ul>

    <template v-if="showServices">
      <h3 class="mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">Services</h3>
      <div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div v-for="(s, i) in level.services" :key="s.id ?? i" class="rounded-xl border border-slate-200 p-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-bold text-slate-800">{{ s.name }}</p>
            <span v-if="s.badge" class="rounded bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
              {{ s.badge }}
            </span>
          </div>
          <p class="mt-1 text-xs text-slate-500">{{ s.description }}</p>
        </div>
        <p v-if="level.services.length === 0" class="text-sm text-slate-400">No services yet.</p>
      </div>
    </template>
  </section>
</template>
