<script setup lang="ts">
import { useUserDetailStore } from '@/stores/userDetail'
import UserDetailsPanel from '@/components/UserDetailsPanel.vue'

const store = useUserDetailStore()
</script>

<template>
  <UserDetailsPanel v-if="store.user" :user="store.user" />
</template>
