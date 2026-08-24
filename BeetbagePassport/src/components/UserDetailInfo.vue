<script setup lang="ts">
import type { User } from '@/types'

defineProps<{
  user?: User | null
}>()
</script>

<template>
  <div v-if="user" class="flex flex-col md:flex-row items-center md:items-start gap-10 pl-4 pt-2">
    <div class="w-48 h-48 min-w-[12rem] bg-slate-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
      <img
        v-if="user.profileImage"
        :src="user.profileImage"
        alt="Profile"
        class="w-full h-full rounded-full object-cover"
      />
      <span v-else>Profile pic</span>
    </div>

    <div class="space-y-3 text-slate-800 text-sm md:text-base">
      <p>
        <span class="font-bold">Full Name:</span> {{ user.name }} {{ user.surname }}
      </p>
      <p>
        <span class="font-bold">Email:</span> {{ user.email || 'somchaihamyaimak@example.com (or N/A)' }}
      </p>
      <p>
        <span class="font-bold">Phone:</span> {{ user.phone || '012-345-6789 (or N/A)' }}
      </p>
      <p>
        <span class="font-bold">Province:</span> {{ user.province || 'Bangkok' }}
      </p>
      <p>
        <span class="font-bold">Registered:</span> 15 August 2026
      </p>
    </div>
  </div>

  <div v-else class="p-8 text-slate-400 text-center">
    Loading user details...
  </div>
</template>