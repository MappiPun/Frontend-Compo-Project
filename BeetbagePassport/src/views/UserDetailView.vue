<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserProfileHeader from '@/components/UserProfileHeader.vue'

const route = useRoute()
const userStore = useUserStore()

const user = computed(() => userStore.getUserById(route.params.id as string))
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-slate-800">User Details</h1>
      <UserProfileHeader />
    </header>

    <main v-if="user" class="max-w-3xl mx-auto p-6 space-y-6">
      <div class="flex space-x-4 border-b border-slate-200 pb-2">
        <router-link :to="`/users/${user.id}`" class="text-xs font-semibold text-slate-600 hover:text-indigo-600">Info</router-link>
        <router-link :to="`/users/${user.id}/history`" class="text-xs font-semibold text-slate-600 hover:text-indigo-600">Exam History</router-link>
        <router-link :to="`/users/${user.id}/edit`" class="text-xs font-semibold text-slate-600 hover:text-indigo-600">Edit</router-link>
      </div>

      <router-view :user="user" :history="user.examHistory" />
    </main>
  </div>
</template>