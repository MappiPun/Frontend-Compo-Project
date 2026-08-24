<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AdminProfileHeader from '@/components/AdminProfileHeader.vue'
import AdminNavigation from '@/components/AdminNavigation.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userId = computed(() => route.params.id as string)

onMounted(async () => {
  if (userStore.users.length === 0) {
    await userStore.fetchUsers()
  }
  userStore.setSelectedUser(userId.value)
})

const selectedUser = computed(() => userStore.selectedUser)

function goBack() {
  router.push('/admin')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <AdminProfileHeader />
    <div class="max-w-4xl mx-auto mt-6">
      <AdminNavigation />
    </div>

    <main class="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
      <button @click="goBack" class="text-xs text-purple-600 hover:underline">&larr; Back to Admin</button>

      <div v-if="selectedUser" class="space-y-6">
        <div class="flex items-center space-x-4 border-b pb-4">
          <img :src="selectedUser.profileImage" class="w-16 h-16 rounded-full border" />
          <div>
            <h1 class="text-lg font-bold text-slate-800">{{ selectedUser.name }} {{ selectedUser.surname }}</h1>
            <p class="text-xs text-slate-500">@{{ selectedUser.username }} • {{ selectedUser.email }}</p>
            <span class="inline-block mt-1 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
              Level {{ selectedUser.level }}
            </span>
          </div>
        </div>

        <div class="flex space-x-4 border-b border-slate-200 text-xs font-semibold">
          <router-link 
            :to="`/admin/users/${userId}/info`"
            class="pb-2 px-1 transition-colors"
            active-class="border-b-2 border-purple-600 text-purple-600"
          >
            User Information
          </router-link>
          <router-link 
            :to="`/admin/users/${userId}/exams`"
            class="pb-2 px-1 transition-colors"
            active-class="border-b-2 border-purple-600 text-purple-600"
          >
            Exam History
          </router-link>
          <router-link 
            :to="`/admin/users/${userId}/edit`"
            class="pb-2 px-1 transition-colors"
            active-class="border-b-2 border-purple-600 text-purple-600"
          >
            Edit User
          </router-link>
        </div>

        <router-view />
      </div>

      <div v-else class="text-center py-8 text-xs text-slate-400">
        Loading user details...
      </div>
    </main>
  </div>
</template>