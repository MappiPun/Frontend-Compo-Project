<script setup lang="ts">
import type { User } from '@/types'

defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'select', userId: string): void
  (e: 'toggle-status', userId: string): void
}>()
</script>

<template>
  <div 
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
    @click="emit('select', user.id)"
  >
    <div class="flex items-start space-x-4">
      <img :src="user.profileImage" :alt="user.name" class="w-12 h-12 rounded-full border border-gray-200" />
      <div class="flex-1">
        <h3 class="font-bold text-gray-800 text-base">{{ user.name }} {{ user.surname }}</h3>
        <p class="text-xs text-gray-500">@{{ user.username }} • {{ user.email }}</p>
        <div class="mt-2 flex items-center space-x-2">
          <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600">
            Level {{ user.level }}
          </span>
          <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {{ user.province }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
      <span 
        class="font-medium"
        :class="user.isActive ? 'text-green-600' : 'text-red-500'"
      >
        ● {{ user.isActive ? 'Active' : 'Deactivated' }}
      </span>
      <button 
        @click.stop="emit('toggle-status', user.id)"
        class="px-2 py-1 text-xs rounded border transition-colors"
        :class="user.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'"
      >
        {{ user.isActive ? 'Deactivate' : 'Activate' }}
      </button>
    </div>
  </div>
</template>